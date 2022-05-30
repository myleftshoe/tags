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
    import demoData from '$lib/stores/demoData.json'
    // console.log(JSON.stringify(demoData, null, 2))

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size

    const text = Object.entries(data.text)
    console.log(text)
    export let product = text.reduce((acc, cur) => {
        console.log(cur)
        const [label] = cur
        const value = labelMappings[label] ?? label
        acc[label] = value
        return acc
    }, {})


    console.warn(JSON.stringify(product, null, 4))

    const dollar = data.icons?.icon1

    // console.log(text)
    console.warn(product)

    function selectText(e) {
        e.target.select()
    }

    let innerWidth
    $: scale = Math.min(innerWidth/width, 1)
    $: if (product.id) { 
        refs.tagcontent.style.filter = 'none';
        refs.tagcontent.style.opacity = 1
    }
</script>
<svelte:window bind:innerWidth/>
{#if product}
<container>
    <tag style="height: {height + 80}px; width: {width}px; transform: scale({scale}, 0.85);">
        <tagcontent bind:this={refs.tagcontent}>
        {#each text as [label, style], i}
            <span style="
                top: {style.y}px; 
                left: {style.x}px; 
                color: {style.color};
                font-size: {style['font-size']}px; 
                font-weight: {style.bold ? 'bold': 'normal'}; 
                font-family: {style["font-family"]}, 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color:blue;
        overflow: scroll;
    }
    tag {
        display: grid;
        /* position: absolute;  */
        top: 20px;
        box-sizing: border-box;
        /* display: grid;
        place-items: center; */
        background-color: #eee;
        /* border: 2px solid black; */
        border-top: 32px solid white;
        border-bottom: 32px solid white;
        border-radius: 32px;
        transform-origin: center top;
        transition: transform 0.1s ease-out;
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
