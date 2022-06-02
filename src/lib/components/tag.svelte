<script>
    import demoData from '$lib/stores/demoData.json'
    import { nullProduct, meta } from '$lib/stores/products'
    import minew from '$lib/datasources/minew'

    export let product = { ...nullProduct }

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size
    const text = Object.entries(data.text)
    const dollar = data.icons?.icon1

    // COMPATIBILITY FIX: Chrome on android doesn't honor maxlength. 
    // Still doesn't work when input value starts empty, i.e. when placeholder is shown
    function handleInput(e) { 
        const {id, value} = e.target
        if (value.length > meta[id].maxlength) {
            console.log(e.target.id)
            e.preventDefault()
        }
    }

    function handleFocus(e) {
        // preventScroll doesn't work on all browsers -> 
        // save scroll pos before focus and restore after 
        const x = refs.tagcontent.scrollX;
        const y = refs.tagcontent.scrollY;
        e.target.focus({preventScroll: true})
        refs.tagcontent.scrollTo(x, y);        
        e.target.select()        
    }

    function handleBlur(e) {
        const { id, value } = e.target
        if (meta[id].uppercase)
            product[id]  = value.toUpperCase()
    }

    const increment = () => {
        dollars = (parseInt(dollars) + 1).toString()
        if (dollars.length > 2)
            dollars = '99'
    }

    const decrement = () => {
        dollars = (parseInt(dollars) - 1).toString()
        if (dollars.startsWith('-'))
            dollars = '0'
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

    let [dollars, cents = ''] = product.label6.split('.')


    async function sendIt() {
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
        await minew.post('goods?storeId=123', payload)
    }


    $: product ??=  { ...nullProduct }

    $: document?.activeElement.blur()
    // let innerWidth
    // $: scale = Math.min((innerWidth - 84)/width, .75)

</script>
<!-- <svelte:window bind:innerWidth/> -->
<container bind:this={refs.container}>
    <case bind:this={refs.case} style="transform: scale({.8});">
        <tag style="height: {height}px; width: {width}px;">
            <tagcontent bind:this={refs.tagcontent} class:loading={!product?.id}>
                {#each text as [label, style], i}
                    <span style={toCss(style)}>
                        {#if (label !== 'label6')}
                            <input 
                                id={label}
                                bind:value={product[label]} 
                                on:focus|preventDefault={handleFocus}
                                on:keypress={handleInput}
                                on:blur={handleBlur}
                                tabindex={meta[label].tabindex || -1}]
                                class:uppercase={meta[label].uppercase}
                                placeholder="{meta[label]?.placeholder}"
                                type="text"
                                size="{meta[label]?.maxlength || ''}"
                                maxlength="{meta[label]?.maxlength || ''}"
                                style="width: {meta[label]?.maxlength}ch; font-weight: inherit;"
                            />
                        {:else}
                            <!-- {dollars}. -->
                            <input 
                                type="tel" 
                                size="2"    
                                maxlength="2" 
                                tabindex={3}
                                bind:value={dollars}
                                on:focus|preventDefault={handleFocus}
                                style="width: 2ch; height: 1.75ex; font-weight: inherit; text-align: right;" 
                            />.
                            <sup><input 
                                type="tel" 
                                size="2" 
                                maxlength="2" 
                                tabindex={4}
                                bind:value={cents} 
                                on:focus|preventDefault={handleFocus}
                                style="
                                    width: 2ch; 
                                    font-weight: inherit; 
                                    text-align: left;
                                    transform: translateX(-0.7ch);
                                "/>
                            </sup>
                        {/if}
                    </span>
                {/each}
                <span style="
                    top: {data.text['label6'].y}px; 
                    left: calc({data.text['label6'].x}px - 1ch);
                    font-size: {dollar['font-size']}px; 
                    color: {dollar.color};
                ">$</span>
            </tagcontent>
            <!-- {#if !product.id}
                <progress class="absolute progress w-{width} bottom-0"></progress>
            {/if} -->
        </tag>
    </case>
    <actions>
        <button class="btn btn-lg btn-circle btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus" on:click={decrement}>-</button>
        <button class="btn btn-lg btn-circle btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus" on:click={increment}>+</button>
    </actions>
    <!-- <button on:click={sendIt}>Send It!</button> -->
</container>

<style>
    actions { 
        position: absolute;
        display: flex;
        width: 50%;
        justify-content: space-between;
        bottom: 20%;
    }
    container {
        position: relative;
        padding: 5rem 0;
        display: grid;
        place-items: start center;
        width: 100vw;
        height: 100vh;
        /* flex-direction: column;
        align-items: center; */
        overflow: hidden;
    }
    case {
        position: absolute;
        top: 2rem;
        outline: 1px solid #0001;
        box-shadow: 10px 10px 10px #0007, -1px -1px 1px white;
        border-width: 32px 15px 32px 15px;
        border-color: #f5f7f7;
        border-radius: 32px;
        transform-origin: center center;
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
    @media (orientation: landscape) {
        container {
            place-items: center center;
        }
        case {
            top: 0;
        }
        actions {
            justify-content: space-between;
            bottom: 41.25%;
            width: 90%;
        }
    }    
    tag {
        display: grid;
        box-sizing: content-box;
        /* padding: 0 0 10px 5px; */
        border: 10px solid #e7e7e7;
        border-width: 15px 10px 20px 10px;
        background-color: #d7d7d7;
        overflow: hidden;
    }
    tagcontent.loading {
        opacity: 0.5;
        filter:  contrast(20%);
    }
    tagcontent {
        opacity: 1;
        filter: contrast(50%);
        transition: opacity .6s linear, filter .6s linear;
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
        /* user-select: none; */
        /* padding: 0 .5rem;
        transition: background-color .2s ease;
        border-radius: 5px; */
    }
    input.uppercase {
        text-transform: uppercase;
    }
    input:focus {
        background-color: #f002;
        /* font-family: monospace; */
    }
    /* button {
        position: absolute;
        top: 0;
    } */
</style>
