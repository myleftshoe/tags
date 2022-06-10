<script>
    import { afterUpdate } from 'svelte'
    import { uppercase, clearOnFocus, maxlength, preventScroll } from '$lib/actions/input'
    import { nullProduct, meta } from '$lib/stores/products'
    import demoData from '$lib/stores/demoData.json'

    export let product = { ...nullProduct }

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size
    const text = Object.entries(data.text)

    function formatPrice(price) {
        const [d, c = ''] = price.replace(',','.').split('.')
        const dollars = Number(d.trim()).toString()
        const cents = c.trim().length ? c.trim().padEnd(2, '0') : ''
        return cents !== '' ? [dollars, cents].join('.') : dollars
    }

    function handlePriceChange(e) {
        product.label6 = formatPrice(e.target.value)
    }

    let editingPrice = false;
    function handlePriceFocus(e) {
        editingPrice = true
    }
    function handlePriceBlur(e) {
        editingPrice = false
    }
    afterUpdate(() => {
        editingPrice && refs.price.focus()  
    })

    const toCss = style => `
        position: absolute;
        top: ${style.y}px; 
        left: ${style.x}px; 
        color: ${style.color};
        font-size: ${style['font-size']}px; 
        font-weight: ${style.bold ? '500': '400'}; 
        font-family: ${style['font-family']}, alibaba-puhuiti, Roboto, 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    `

    $: document?.activeElement.blur()
    $: product ??= { ...nullProduct }
    $: [dollars, cents = ''] = product.label6.split('.')

</script>

<container bind:this={refs.container}>
    <case bind:this={refs.case} style="transform: scale(.8);">
        <tag style="height: {height}px; width: {width}px;">
            <tagcontent bind:this={refs.tagcontent} class:loading={!product?.id}>
                {#each text as [label, style], i}
                    <span style={toCss(style)}>
                        {#if (label !== 'label6')}
                            <input 
                                use:uppercase={meta[label].uppercase || false}
                                use:preventScroll
                                use:clearOnFocus={label === 'label10'}
                                use:maxlength={meta[label]?.maxlength}
                                bind:value={product[label]}
                                id={label}
                                tabindex={meta[label].tabindex || -1}]
                                placeholder="{meta[label]?.placeholder}"
                                type="text"
                                autocapitalize="{label === 'label10' ? 'none' : 'words'}"
                            />
                        {:else}
                            <price>
                                {#if !editingPrice}
                                    <dollars contenteditable="true" class:dot={Boolean(cents.length)} tabindex={3} on:focus={handlePriceFocus} style="visiblity: {editingPrice ? 'hidden' : 'visible'}">{dollars}</dollars>
                                    <cents tabindex={4} on:focus={handlePriceFocus} style="visiblity: {editingPrice ? 'hidden' : 'visible'}"><sup bind:this={refs.sup}>{cents}</sup></cents>
                                {:else}
                                    <input
                                        bind:this={refs.price}
                                        type="text"
                                        inputmode="decimal"
                                        pattern="[0-9]*"
                                        tabindex={3} 
                                        on:blur={handlePriceBlur}
                                        bind:value={product[label]} 
                                        use:clearOnFocus 
                                        use:maxlength={meta[label]?.maxlength}
                                        on:change={handlePriceChange}
                                    />
                                {/if}
                            </price>
                        {/if}
                    </span>
                {/each}
            </tagcontent>
        </tag>
    </case>
</container>

<style>
    container {
        position: relative;
        display: grid;
        place-items: start center;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    case {
        position: absolute;
        outline: 1px solid #0001;
        box-shadow: 10px 10px 10px #0007, -1px -1px 1px white;
        border-width: 32px 15px 32px 15px;
        border-color: #f5f7f7;
        border-radius: 32px;
        transform-origin: top center;
        transition: transform 0.1s ease-out;
    }
    case:after {
        content: '';
        position:absolute;
        top: -30px;
        right: -13px;
        bottom: -30px;
        left: -13px;;
        border: 1px solid #0002;
        box-shadow: -1px 0px 1px 1px #0007 inset;
        border-radius: 30px;
        pointer-events: none;
    }
    tag {
        display: grid;
        box-sizing: content-box;
        /* padding: 0 0 10px 5px; */
        border: 10px solid #e7e7e7;
        border-width: 15px 10px 20px 10px;
        background-color: #d7d7d7;
        /* overflow: hidden; */
    }
    tagcontent.loading {
        opacity: 0.5;
        filter:  contrast(20%);
    }
    tagcontent {
        position: relative;
        opacity: 1;
        filter: contrast(50%);
        /* transition: opacity .6s linear, filter .6s linear; */
        transform: translateY(-10px);
    }
    span { 
        position: absolute;
        display:flex;
    }
    input { 
        border: none; 
        outline: none;
        background-color: transparent;
        font-weight: inherit;
    }
    input:focus {
        background-color: #f002;
    }
    price { 
        display: flex;
        align-items: center;
        line-height: 2ex;
        height: 2ex;
        transform: translate(-.2ch, .15ex);
    }
    price::before {
        content: "$";
        position: absolute;
        left: -1ch;
    }
    dollars::after {
        content: ".";
        visibility: hidden;
    }
    dollars.dot::after {
        visibility: visible;
    }
    @keyframes animateCents {
        from { transform: scale(1.25); } 
        to { transform: scale(1); }
    }
    cents {
        animation: animateCents .1s ease;
        transform-origin: top left;
    }
    sup {
		font-size: 0.6em;
    }
</style>
