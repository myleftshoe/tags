<script context="module" lang='ts'>

    const pp = (o) => console.log(JSON.stringify(o, null, 2))

    const meta = {
        label3: { name: 'plucode', editable: false, maxlength:8, uppercase: true, placeholder: '0000'},
        label4: { name: 'name1', editable: true, maxlength:16, uppercase: true, placeholder: '', },
        label5: { name: 'name2', editable: true, maxlength:16, uppercase: true, placeholder: '', },
        label6: { name: 'price', editable: true, },
        label8: { name: 'specification', editable: true, maxlength:16, placeholder: 'Organic', default: 'Organic' },
        label9: { name: 'grade', editable: true, maxlength:21, placeholder: 'Grade', },
        label10: { name: 'unit', editable: true, maxlength:4, placeholder: 'kg/ea', default: 'kg' },
        label11: { name: 'origin', editable: true, maxlength:4, placeholder: 'VIC', },
    }

</script>

<script>
    import demoData from '$lib/stores/demoData.json'
    import { nullProduct } from '$lib/stores/products'
    // pp({demoData})

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size

    const text = Object.entries(data.text)
    pp({text})
    export let product = { ...nullProduct }

    function selectText(e) {
        // e.target.select()
    }

    // COMPATIBILITY FIX: Chrome on android doesn't honor maxlength. 
    // Still doesn't work when input value starts empty, i.e. when placeholder is shown
    function handleInput(e) { 
        const {id, value} = e.target
        if (value.length > meta[id].maxlength) {
            console.log(e.target.id)
            e.preventDefault()
        }
    }

    function handleBlur(e) {
        const { id, value } = e.target
        if (meta[id].uppercase)
            product[id]  = value.toUpperCase()
    }

    const dollar = data.icons?.icon1

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

    let [dollars, cents = ''] = product.label6.split('.')
    $: pp({dollars, cents})

    $: product ??=  { ...nullProduct }
    $: pp({product})

    $: document?.activeElement.blur()
    // let innerWidth
    // $: scale = Math.min((innerWidth - 84)/width, .75)
    // $: pp({scale})

</script>
<!-- <svelte:window bind:innerWidth/> -->
<container bind:this={refs.container}>
    <case  bind:this={refs.case} style="transform: scale({.8});">
        <border>
            <tag style="height: {height + 10}px; width: {width}px;">
                <tagcontent bind:this={refs.tagcontent} class:loading={!product?.id}>
                {#each text as [label, style], i}
                    <span style="
                        position: absolute;
                        top: {style.y}px; 
                        left: {style.x}px; 
                        color: {style.color};
                        font-size: {style['font-size']}px; 
                        font-weight: {style.bold ? 'bold': 'normal'}; 
                        font-family: {style["font-family"]}, Roboto, 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                    ">
                        {#if (label === 'label6')}
                            {dollars}.
                            <!-- <input style="width: 2ch; text-align: center;" type="tel" size="2" maxlength="2" bind:value={dollars}/>. -->
                            <sup>
                                <input type="tel" size="2" maxlength="2" bind:value={cents} 
                                    style="position: absolute; top:0; font-weight: inherit; width: 2ch; text-align: center;" 
                                />
                            </sup>
                        {:else}
                            <input 
                                id={label}
                                bind:value={product[label]} 
                                on:focus={selectText}
                                on:keypress={handleInput}
                                on:blur={handleBlur}
                                class:uppercase={meta[label].uppercase}
                                placeholder="{meta[label]?.placeholder}"
                                type="text"
                                size="{meta[label]?.maxlength || ''}"
                                maxlength="{meta[label]?.maxlength || ''}"
                                style="width: {meta[label]?.maxlength}ch;"
                            />
                        {/if}
                    </span>
                {/each}
                <span style="
                    top: {dollar.y}px; 
                    left: {dollar.x}px;
                    font-size: {dollar['font-size']}px; 
                    color: {dollar.color};
                ">$</span>
            </tagcontent>
            <!-- {#if !product.id}
                <progress class="absolute progress w-{width} bottom-0"></progress>
            {/if} -->
            </tag>
        </border>
    </case>
    <actions>
        <button class="btn btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus" on:click={decrement}>-</button>
        <button class="btn btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus" on:click={increment}>+</button>
    </actions>
</container>

<style>
    actions { 
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: row;
        justify-content: center;
        gap: 2rem;
        padding: 2rem 0;
        align-items: flex-end;
    }
    container {
        position: relative;
        padding: 2rem 0;
        display: grid;
        place-items: start center;
        width: 100vw;
        height: 100vh;
        /* flex-direction: column;
        align-items: center; */
        overflow: hidden;
    }
    @media (orientation: landscape) {
        container {
            place-items: center center;
        }
        actions {
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }
    }    
    case {
        position: absolute;
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
    border {
        display: grid;
        border: 10px solid #e7e7e7;
        border-width: 15px 10px 20px 10px;
    }
    tag {
        display: grid;
        box-sizing: border-box;
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
        transition: all .6s linear;
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
        box-sizing: border-box;
        background-color: transparent;
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
</style>
