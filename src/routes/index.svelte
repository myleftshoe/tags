<script context="module">
    import search from '$lib/stores/search'
    import showUnbound from '$lib/stores/bound';
    import products, {nullProduct} from '$lib/stores/products'
    import { fetchPreview } from '$lib/stores/products'
    import fuzzy from '$lib/util/fuzzy'
    import Overlay from '$lib/components/overlay.svelte'
    import PriceModal from '$lib/components/priceModal.svelte'
    import Tag from '$lib/components/tag.svelte'
</script>
<script>

    let loggedIn = false
    let selectedItem = {}
    let originalItem = {} 

    const handleItemClick = (item) => (e) => {
        originalItem = { ...item }
        selectedItem = item
        console.log(item)
        open = true
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
        selectedItem = {}
    }


    let product = nullProduct

    const isHex12 = (value = '') => /^([0-9A-Fa-f]{12})$/.test(value.trim())
    async function getProduct(value) {
        console.log(value)
        if (!isHex12(value)) return
        open = true
        product = await fetchPreview(value)
        console.log(product)
    }    


    const dollars = (price) => price.split('.')[0]
    const cents = (price) => {
        const c = price.split('.')[1] ?? ''
        return c && `.${c}`
    }

    let open = false
    $: getProduct($search)
    $: items = fuzzy($products.filter(({status}) => !$showUnbound ? status === 'bound' : true ), $search.toLocaleUpperCase(), ['label4', 'label5', 'Description', 'id'])
</script>
<ul class="flex flex-col divide-y divide-base-300">
    {#each items as item}
        <li class="flex flex-row gap-3 justify-between py-4 px-4 text-base-content bg-base-100 active:bg-base-200" on:click={handleItemClick(item)}>
            <div class="flex flex-row justify-center items-center w-1/3" style={`${item.status === 'unbound' && 'opacity:.50'}`} >
                <label for="price-modal">
                    <sup>$</sup>
                    <span class="text-xl">{dollars(item.price)}</span>
                    <sup>{cents(item.price)}</sup>
                    <sub >{item.label10}</sub>
                    <!-- <span class="text-xs relative -right-1 -bottom-2">{item.label10}</span> -->
                    <!-- <div>{item.label10}</div> -->
                </label>
            </div>
            <div class="w-2/3 flex flex-col justify-center" style={`${item.status === 'unbound' && 'opacity:.50'}`}>
                <label for="edit-modal">
                    {`${item.label4.trim()} ${item.label5.trim()}`.trim()}
                    <!-- <div>{item.label5}</div>
                    <div>{item.label4}</div> -->
                </label>
            </div>
        </li>
    {/each}
</ul>

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
<!-- <Overlay bind:open on:close={() => console.log('close evet')}>
    <Keypad on:submit={() => open=false}/>
</Overlay> -->


<!-- {#if !$products.length}
    <progress class="progress progress-accent"></progress>
{/if} -->
<Overlay bind:open closeButton on:close={() => product = nullProduct}>
    <Tag {product}/>
</Overlay>
