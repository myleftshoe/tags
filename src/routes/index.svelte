<script context="module">
    import search from '$lib/stores/search'
    import showUnbound from '$lib/stores/bound'
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
    let prevScannedItem = null
    let originalItem = {}

    const modals = {
        tag: { open: false },
    }

    const handleItemClick = (item) => (e) => {
        originalItem = { ...item }
        selectedItem = item
        prevScannedItem = { ...selectedItem }
        modals.tag.open = true
    }

    function resetItem() {
        Object.assign(selectedItem, originalItem)
        selectedItem = { ...nullProduct }
        prevScannedItem = null
    }

    const dollars = (price) => price.split('.')[0]
    const cents = (price) => {
        const c = price.split('.')[1] ?? ''
        return c && `.${c}`
    }

    async function sendIt(product) {
        let payload = {
            id: product.id,
            label3: product.label3, 
            label4: product.label4.toUpperCase(),
            label5: product.label5.toUpperCase(),
            label6: `${dollars}.${cents}`,
            label8: product.label8 || 'Organic',
            label10: product.label10,
            label13: product.label13 || 'VEGETABLES',
        }        
        console.log('product', JSON.stringify(product, null, 2))
        console.log('payload', JSON.stringify(payload, null, 2))
        originalItem = { ...product }
        items = [...items]
        await minew.post('goods?storeId=123', payload)

    }

    const isHex12 = (value = '') => /^#([0-9A-Fa-f]{12})$/.test(value.trim()) // first char is #
    const getName = ({label4 = '', label5 = ''} = {}) => `${label4.trim()} ${label5.trim()}`.trim() 

    async function showTag(value) {
        document.activeElement.blur()
        modals.tag.open = true

        if (isHex12(value)) {
            selectedItem = await fetchPreview(value.slice(1)) // remove # prefix
            if (prevScannedItem?.id) {
                // Previous was a scan. 
                if (confirm(`Bind ${getName(prevScannedItem)} [${prevScannedItem.id}] [${prevScannedItem.macAddress}] to ${getName(selectedItem)} [${selectedItem.macAddress}]?`)) {
                    minew.bind(selectedItem.macAddress, prevScannedItem.id)
                }
            }
            prevScannedItem = { ...selectedItem }
            return
        }
    }

    let items = []
    
    $:  if ($search.length === 0) {
            items = []
        } else if ($search.startsWith('#')) {
            isHex12($search) && showTag($search)
        } else {
            // items = $showUnbound ? $products : $products.filter(({ status }) => status === 'bound')
            items = fuzzy($products, $search.toLocaleUpperCase(), ['label4', 'label5', 'id']) //TODO: id or plucode?
        }
</script>

<ul class="flex flex-col divide-y divide-base-300">
    {#each items as item}
        <li class={item.status === 'unbound' && 'opacity-50'} on:click={handleItemClick(item)}>
            <price class="w-1/4 text-right pr-10 text-xl" data-cents={cents(item.price)} data-unit={item.label10}>{dollars(item.price)}</price>
            <span class="w-3/4 flex flex-col justify-center">{`${item.label4.trim()} ${item.label5.trim()}`.trim()}</span>
        </li>
    {/each}
</ul>

<Overlay bind:open={modals.tag.open} on:close={resetItem} cancel="← Go Back">
    <Tag product={selectedItem} />
    <svelte:fragment slot="actions">
        <button class="no-animation btn btn-accent z-50" on:click={() => sendIt(selectedItem)}>Send It!</button>
    </svelte:fragment>
</Overlay>

<style>
    price:before {
        font-size: 0.75rem;
        content: '$';
    }
    price:after {
        position: absolute;
        font-size: 0.75rem;
        white-space: pre-line;
        line-height: 2.5ch;
        text-align: center;
        content: attr(data-cents) '\a'attr(data-unit);
        transform: translateX(0.25ch);
    }
    li {
        @apply flex flex-row gap-3 py-4 px-4 text-base-content bg-base-100 active:bg-base-200;
    }
</style>
