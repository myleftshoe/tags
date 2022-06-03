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

    function resetItem() {
        Object.assign(selectedItem, originalItem)
    }

    const isHex12 = (value = '') => /^#([0-9A-Fa-f]{12})$/.test(value.trim())
    async function getProduct(value) {
        console.log(value)
        if (!isHex12(value)) return
        document.activeElement.blur()
        modals.tag.open = true
        selectedItem = await fetchPreview(value.slice(1)) // remove # prefix
    }    


    const dollars = (price) => price.split('.')[0]
    const cents = (price) => {
        const c = price.split('.')[1] ?? ''
        return c && `.${c}`
    }

    let items = []
    $:  if ($search.startsWith('#')) {
            getProduct($search)
        } else {
            items = fuzzy($products.filter(({status}, i) => !$showUnbound ? status === 'bound' : true ), $search.toLocaleUpperCase(), ['label4', 'label5', 'label13', 'Description', 'id'])
        }
</script>
<ul class="flex flex-col divide-y divide-base-300">
    {#each items as item}
        <li class="flex flex-row gap-3 py-4 px-4 text-base-content bg-base-100 active:bg-base-200 {item.status === 'unbound' && 'opacity-50'}" on:click={handleItemClick(item)}>
            <price class="w-1/4 text-right pr-10 text-xl" data-cents="{cents(item.price)}" data-unit="{item.label10}">{dollars(item.price)}</price>
            <span class="w-3/4 flex flex-col justify-center">
                {`${item.label4.trim()} ${item.label5.trim()}`.trim()}
            </span>
        </li>
    {/each}
</ul>

<Overlay bind:open={modals.tag.open} closeButton on:close={resetItem}>
    <Tag product={selectedItem}/>
</Overlay>

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