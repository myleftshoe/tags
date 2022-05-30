<script context="module">
    const labelMappings = {
        label3: '0000',
        label4: 'name 2',
        label5: 'name 1',
        label6: '9.99',
        label8: 'Organic',
        label9: 'grade',
        label10: 'kg',
        label11: 'VIC',
    }

</script>

<script>
    import { afterUpdate } from 'svelte'
    import demoData from '$lib/stores/demoData.json'
    // console.log(JSON.stringify(demoData, null, 2))

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size

    const text = Object.entries(data.text)
    console.log(text)
    export let product = {}


    afterUpdate(() => {
        const scrollWidth = refs.container.scrollWidth
        refs.container.scrollLeft = (scrollWidth - innerWidth) / 2
    })

    console.warn(JSON.stringify(product, null, 4))

    const dollar = data.icons?.icon1

    // console.log(text)
    console.warn(product)

    function selectText(e) {
        e.target.select()
    }

    $: product = product.id ? product : text.reduce((acc, cur) => {
        console.log(cur)
        const [label] = cur
        const value = labelMappings[label] ?? label
        acc[label] = value
        return acc
    }, {})

    let innerWidth
    $: scale = Math.min((innerWidth - 64)/width, 1)
    $: console.log({scale})
    $: if (product.id) { 
        refs.tagcontent.style.filter = 'none';
        refs.tagcontent.style.opacity = 1
    }
</script>
<svelte:window bind:innerWidth/>
{#if product}
<container bind:this={refs.container}>
    <case  bind:this={refs.case} style="transform: scale({scale});">
        <border>
            <tag style="height: {height + 10}px; width: {width}px;">
                <tagcontent bind:this={refs.tagcontent}>
                {#each text as [label, style], i}
                    <span style="
                        top: {style.y}px; 
                        left: {style.x}px; 
                        color: {style.color};
                        font-size: {style['font-size']}px; 
                        font-weight: {style.bold ? 'bold': 'normal'}; 
                        font-family: {style["font-family"]}, Roboto, 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                    ">
                        {#if (label === 'label6')}
                            {product[label].split('.')[0]}.
                            <sup>{product[label].split('.')[1] ?? ''}</sup>
                        {:else}
                            <input 
                                value="{product[label] ?? ''}" 
                                on:focus={selectText}
                                placeholder="{labelMappings[label]}"
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
    <div class="flex flex-row gap-10">
        <button class="btn btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus">+</button>
        <button class="btn btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus">-</button>
    </div>    

</container>
{/if}
<style>
    container {
        position: relative;
        padding: 5rem 0;
        display: grid;
        place-items: center center;
        width: 100vw;
        /* flex-direction: column;
        align-items: center; */
        overflow: hidden;
        /* background-color: black; */
    }
    case {
        position: relative;
        outline: 1px solid #0001;
        box-shadow: 10px 10px 10px #0007, -1px -1px 1px white;
        border-width: 32px 15px 32px 15px;
        border-color: #fff;
        border-radius: 32px;
        transform-origin: center top;
        transition: transform 0.1s ease-out;
    }
    case:after {
        content: '';
        position:absolute;
        top: -30px;
        right: -13px;
        bottom: -30px;
        left: -13px;;
        /* border: 1px solid #0006; */
        box-shadow: -1px 0px 1px 1px #0002 inset;
        border-radius: 30px;
    }
    border {
        display: grid;
        border: 10px solid #eee;
        border-width: 15px 10px 20px 10px;
        /* background-color:blue; */
    }
    tag {
        display: grid;
        /* position: absolute;  */
        /* top: 20px; */
        box-sizing: border-box;
        /* display: grid;
        place-items: center; */
        background-color: #ddd;
        /* border: 2px solid black; */
        overflow: hidden;
        /* max-width: 100vw; */
    }
    tagcontent {
        filter: contrast(50%) blur(1px);
        opacity: 0.5;
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
        background-color: transparent;
        /* padding: 0 .5rem; */
        transition: background-color .2s ease;
        border-radius: 5px;
    }
    /* input:focus {
        background-color: #f002;
    } */
</style>
