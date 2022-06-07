<script>
    import demoData from '$lib/stores/demoData.json'
    import { nullProduct, meta } from '$lib/stores/products'
    import { uppercase, clearOnFocus, enforceMaxlength, preventScroll } from '$lib/actions/input'

    export let product = { ...nullProduct }

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size
    const text = Object.entries(data.text)
    const dollar = data.icons?.icon1

    function handlePriceChange(e) {
        product.label6 = `${refs.dollars.value}.${refs.cents.value}`
        console.log('price', product.label6)
    }

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
                                bind:value={product[label]} 
                                use:uppercase={meta[label].uppercase ?? false}
                                use:preventScroll
                                use:clearOnFocus={label === 'label10'}
                                use:enforceMaxlength
                                id={label}
                                tabindex={meta[label].tabindex || -1}]
                                placeholder="{meta[label]?.placeholder}"
                                type="text"
                                autocapitalize="{meta[label].uppercase ? 'characters' : label === 'label10' ? 'none' : 'words'}"
                                size="{meta[label]?.maxlength || ''}"
                                maxlength="{meta[label]?.maxlength || ''}"
                                style="width: {meta[label]?.maxlength}ch; font-weight: inherit;"
                            />
                        {:else}
                            <!-- {price}. -->
                            <input
                                bind:this={refs.dollars} 
                                class="dollars" 
                                type="number"
                                inputmode="numeric"
                                size="2" 
                                maxlength="2" 
                                tabindex={3} 
                                on:change={handlePriceChange}
                                value={dollars} 
                                use:clearOnFocus 
                                use:enforceMaxlength 
                            />.
                            <sup><input 
                                bind:this={refs.cents} 
                                class="cents" 
                                type="number" 
                                inputmode="numeric"
                                size="2" 
                                maxlength="2" 
                                tabindex={4} 
                                on:change={handlePriceChange}
                                value={cents} 
                                use:clearOnFocus
                                use:enforceMaxlength 
                            /></sup>
                        {/if}
                    </span>
                {/each}
                <!--
                    Dollar sign. Inputs can't have psuedo elements so not implemented with 
                    ::before on dollar input. I.e. would need a wrapper element.
                -->
                <span style="
                    top: {data.text['label6'].y}px; 
                    left: calc({data.text['label6'].x}px - 1ch);
                    font-size: {dollar['font-size']}px; 
                    color: {dollar.color};
                ">$</span>
            </tagcontent>
        </tag>
    </case>
</container>

<style>
    .dollars { 
        width: 2ch; 
        height: 1.75ex; 
        font-weight: inherit; 
        text-align: right;
    }
    .cents { 
        width: 2ch; 
        font-weight: inherit; 
        text-align: left;
        transform: translateX(-0.7ch);
    }
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
    }
    sup { 
        font-size: .6em;
    }
    input { 
        border: none; 
        outline: none;
    }
    input {
        background-color: transparent;
    }
    input:focus {
        background-color: #f002;
    }
</style>
