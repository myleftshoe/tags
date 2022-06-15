<script context="module">
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'
    import search, { searchRef } from '$lib/stores/search'
    import products, { nullProduct } from '$lib/stores/products'
    import { fetchPreview } from '$lib/stores/products'
    import minew from '$lib/datasources/minew'
    import fuzzy from '$lib/util/fuzzy'
    import Overlay from '$lib/components/overlay.svelte'
    import Tag from '$lib/components/tag.svelte'
    export const router = false
    export const prerender = true
</script>

<script>
    let selectedItem = { ...nullProduct }
    let scannedItem = null
    let originalItem = { ...nullProduct }

    let refs = {}

    const modals = {
        tag: { open: false },
        confirm: { open: false },
    }

    const handleItemClick = (item) => (e) => {
        originalItem = { ...item }
        selectedItem = item
        modals.tag.open = true
    }

    function resetItem() {
        Object.assign(selectedItem, originalItem)
        selectedItem = { ...nullProduct }
        originalItem = { ...nullProduct }
        scannedItem = null
        modals.tag.open = false
    }

    function bind() {
        modals.confirm.open = false
        minew.bind(scannedItem.macAddress, selectedItem.id)
        selectedItem = scannedItem
        originalItem = { ...scannedItem }
        scannedItem = null
    }

    function cancelBind() {
        modals.confirm.open = false
        scannedItem = null
    }

    const dollars = (price) => price.split('.')[0]
    const cents = (price) => {
        const c = price.split('.')[1] ?? ''
        return c && `.${c}`
    }

    async function sendIt(item) {
        let payload = {
            id: item.id,
            label3: item.label3 ?? '', 
            label4: item.label4.toUpperCase() ?? '',
            label5: item.label5.toUpperCase() ?? '',
            label6: item.label6 ?? '',
            label8: item.label8 || 'Organic',
            label10: item.label10 ?? '',
            label11: item.label11 ?? '',
            label13: item.label13 || 'VEGETABLES',
            label18: '@FRUIT&VEG'
        }        
        console.log('item', JSON.stringify(item, null, 2))
        console.log('payload', JSON.stringify(payload, null, 2))
        originalItem = { ...item }
        // items = [...items]
        await minew.post('goods?storeId=123', payload)
    }

    const isHex12 = (value = '') => /^#([0-9A-Fa-f]{12})$/.test(value.trim()) // first char is #
    const getName = ({label4 = '', label5 = ''} = {}) => `${label4.trim()} ${label5.trim()}`.trim() 
    const getNameReversed = ({label4 = '', label5 = ''} = {}) => `${label5.trim()} ${label4.trim()}`.trim() 

    async function handleMac(mac) {
        if (!isHex12(mac)) return
        document.activeElement.blur()
        modals.tag.open = true // open it eagely, i.e. it will show nullProduct them update
        scannedItem = await fetchPreview(mac.slice(1)) // remove # prefix
        if (selectedItem.id) {
            // Previous was a scan.
            if (JSON.stringify(scannedItem) !== JSON.stringify(selectedItem)) {
                modals.confirm.open = true
            }
        }
        else {
            selectedItem = scannedItem
            originalItem = { ...selectedItem }
            // modals.tag.open = true  // uncomment to open it lazily, ie wait for fetch
        }
    }


    function handlePointerdown() {
        // closes virtual keyboard
        $searchRef.blur()
    }

    let prevClickedElement = null

    function handleFocusout(e) {
        prevClickedElement = null
    }

    function stopFirstClick(e) {
        if (prevClickedElement === e.currentTarget) {
            prevClickedElement = null
            return
        }
        e.stopImmediatePropagation()
        prevClickedElement = e.currentTarget
    }

    onMount(() => {
        const callback = ([entry]) => entry.isIntersecting && loadMore()
        new IntersectionObserver(callback).observe(refs.scrollTrigger)
    })

    function loadMore() {
        if (displayedItems > items.length) return
        displayedItems += chunkSize
    }

    let chunkSize = 20
    let displayedItems = 20
        
    let items = []
    
    $:  changed = JSON.stringify(selectedItem) !== JSON.stringify(originalItem)
    $:  if ($search.startsWith('#')) {  
            isHex12($search) && handleMac($search)
        } 
        else {
            items = fuzzy($products, $search.toUpperCase(), ['label4', 'label5', 'id'])
        }
</script>

<ul tabIndex="-1" class="fixed top-16 bottom-0 inset-x-0 overflow-y-scroll flex flex-col divide-y divide-base-300" on:pointerdown={handlePointerdown} on:focusout={handleFocusout}>
    {#each items as item, i (item.id)}
        <li  
            on:click={stopFirstClick} 
            on:click={handleItemClick(item)}
            class={item.status === 'unbound' && 'opacity-50'} 
            style="display: {i > displayedItems ? 'none': ''}"
        >
            <price class="w-1/4 text-right pr-10 text-xl" data-cents={cents(item.label6)} data-unit={item.label10}>{dollars(item.label6)}</price>
            <span class="w-3/4 flex flex-col justify-center">{`${item.label4.trim()} ${item.label5.trim()}`.trim()}</span>
        </li>
    {/each}
    <li bind:this={refs.scrollTrigger}></li>
</ul>

<Overlay bind:open={modals.tag.open} on:close={resetItem} cancel="Go Back">
    <Tag bind:product={selectedItem} />
    <svelte:fragment slot="actions">
        <button disabled={!changed} class="no-animation btn btn-primary gap-2" style="font-size: inherit;" on:click={() => sendIt(selectedItem)}>
            <span>Send It!</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" /></svg>
        </button>
    </svelte:fragment>
</Overlay>

{#if modals.confirm.open}
    <confirm transition:slide class="alert alert-warning fixed bottom-0 rounded-b-none px-5 z-50 flex flex-col items-start">
        <span >
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{`Change the tag you just scanned (${getNameReversed(scannedItem)} $${scannedItem.label6}) to the product above (${getNameReversed(selectedItem)} $${selectedItem.label6})?`}</span>
        </span>
        <div class="gap-10 w-full justify-center">
            <button class="btn btn-ghost btn-active px-10" on:click={cancelBind}>No</button>
            <button class="btn btn-accent px-10" on:click={bind}>Yes</button>
        </div>
    </confirm>
{/if}

<style>
    price:before {
        content: '$';
        vertical-align: text-bottom;
        font-size: 0.75rem;
        letter-spacing: 0.25ex;
    }
    price:after {
        content: attr(data-cents) '\a'attr(data-unit);
        position: absolute;
        font-size: 0.75rem;
        white-space: pre-line;
        line-height: 2.5ch;
        text-align: center;
        transform: translateX(0.25ch);
    }
    li {
        @apply flex flex-row gap-3 py-4 px-4 text-base-content;
    }
</style>
