<script>
    import demoData from '$lib/stores/demoData.json'
    // console.log(JSON.stringify(demoData, null, 2))

    export let product = {}
    const data = demoData[0]

    const { height, width } = data.size
    const text = Object.entries(data.text)
    const dollar = data.icons?.icon1 

    // console.log(text)
    console.log(product)

    let innerWidth
    $: scale = Math.min(innerWidth/width, .85)
</script>
<svelte:window bind:innerWidth/>
{#if product.id}
<tag style="height: {height}px; width: {width}px; transform: scale({scale});">
    {#each text as [label, style], i}
        <span style="
            top: {style.y}px; 
            left: {style.x}px; 
            color: {style.color};
            font-size: {style['font-size']}px; 
            font-weight: {style.bold ? 'bold': 'normal'}; 
            font-family: {style["font-family"]};
        ">
            {#if (style['effect'] === 'minitail-up')}
                {product[label].split('.')[0]}.
                <sup>{product[label].split('.')[1]}</sup>
            {:else}
                {product[label] ?? ''}
            {/if}
        </span>
    {/each}
    <span style="
        top: {dollar.y}px; 
        left: {dollar.x}px;
        font-size: {dollar['font-size']}px; 
        color: {dollar.color};
    ">$</span>
</tag>
{/if}
<style>
    tag { 
        display: grid;
        background-color: white;
        border: 2px solid black;
        transform-origin: center top;
        transition: transform 0.1s ease-out;
    }
    span { 
        position: absolute;
    }
    sup { 
        font-size: .6em;
    }
</style>
