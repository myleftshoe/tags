<script context="module">
    import search from '$lib/stores/search'
    import showUnbound from '$lib/stores/bound';
    import products, {nullProduct} from '$lib/stores/products'
    import { fetchPreview } from '$lib/stores/products'
    import fuzzy from '$lib/util/fuzzy'
    import Overlay from '$lib/components/overlay.svelte'
    import Tag from '$lib/components/tag.svelte'
    export const router = false;
    export const prerender = true;
</script>
<script>

    let selectedItem = { ...nullProduct }
    let originalItem = {} 

    const modals = {
        tag: { open: false },
    }

    const handleItemClick = (item) => (e) => {
        originalItem = { ...item }
        selectedItem = item
        console.log(item)
        modals.tag.open = true
    }

    function handleClose(e) {
        console.log(e.target.innerText)
        open = false
    }

    function resetItem() {
        Object.assign(selectedItem, originalItem)
    }

    function forceRefresh() {
        items = [ ...items ]
        selectedItem = { ...nullProduct }
    }

    const isHex12 = (value = '') => /^([0-9A-Fa-f]{12})$/.test(value.trim())
    async function getProduct(value) {
        console.log(value)
        if (!isHex12(value)) return
        modals.tag.open = true
        selectedItem = await fetchPreview(value)
    }    


    const dollars = (price) => price.split('.')[0]
    const cents = (price) => {
        const c = price.split('.')[1] ?? ''
        return c && `.${c}`
    }

    let open = false
    $: getProduct($search)
    $: items = fuzzy($products.filter(({status}) => !$showUnbound ? status === 'bound' : true ), $search.toLocaleUpperCase(), ['label4', 'label5', 'label13', 'Description', 'id'])
</script>
<ul class="flex flex-col divide-y divide-base-300">
    {#each items as item}
        <li class="flex flex-row gap-3 justify-between py-4 px-4 text-base-content bg-base-100 active:bg-base-200" on:click={handleItemClick(item)}>
            <div class="w-1/4 text-right pr-10" style={`${item.status === 'unbound' && 'opacity:.50'}`} >
                <price class="text-xl" data-cents="{cents(item.price)}" data-unit="{item.label10}">{dollars(item.price)}</price>
            </div>
            <div class="w-3/4 flex flex-col justify-center" style={`${item.status === 'unbound' && 'opacity:.50'}`}>
                <label for="edit-modal">
                    {`${item.label4.trim()} ${item.label5.trim()}`.trim()}
                    <!-- <div>{item.label5}</div>
                    <div>{item.label4}</div> -->
                </label>
            </div>
        </li>
    {/each}
</ul>

<Overlay bind:open={modals.tag.open} closeButton on:close={resetItem}>
    <Tag product={selectedItem}/>
</Overlay>

<!-- <Overlay closeButton on:close={resetItem} bind:open>
    <div class="flex flex-col gap-4">
        <input type="text" class="input input-bordered w-full focus:input-primary text-lg" bind:value={selectedItem.label5}/>
        <input type="text" class="input input-bordered w-full focus:input-primary text-lg" bind:value={selectedItem.label4}/>
        <span class="flex flex-row items-center relative gap-2">
            <span class="absolute left-4 text-xl">$</span>
            <input id="price" type="number" class="input input-lg input-bordered w-full focus:input-primary text-right text-xl" bind:value={selectedItem.price}/>
            <input type="text" class="input input-lg input-bordered w-full focus:input-primary text-xl" bind:value={selectedItem.label10}/>
        </span>
    </div>
    <div slot="actions" class="grid grid-cols-auto-fit gap-2 w-2/3">
        <button class="btn" on:click={forceRefresh}>OK</button>
        <button class="btn" on:click={resetItem}>Cancel</button>
    </div>
</Overlay> -->

<!-- <Overlay closeButton on:close={resetItem} bind:open>
    <PriceModal bind:open price={selectedItem.price} unit={selectedItem.label10} {selectedItem}/>
    <div slot="actions" class="grid grid-cols-auto-fit gap-2 w-2/3">
        <button class="btn btn-accent" on:click={forceRefresh}>OK</button>
        <button class="btn btn-ghost" on:click={resetItem}>Cancel</button>
    </div>
</Overlay> -->

<style>
    price:before { 
        font-size: .75rem;
        content: "$"
    }
    price:after { 
        position: absolute;
        font-size: .75rem;
        white-space: pre-line;
        line-height: 2.5ch;
        text-align: center;
        content: attr(data-cents)"\a"attr(data-unit);
        transform: translateX(.25ch);
    }

</style>