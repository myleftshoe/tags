<script>
    import Skeleton from 'svelte-skeleton/Skeleton.svelte'
    import demoData from '$lib/stores/demoData.json'
import { each, hasContext } from 'svelte/internal';
    // console.log(JSON.stringify(demoData, null, 2))

    export let product = {}
    const data = demoData[0]

    const { height, width } = data.size
    const text = Object.entries(data.text)
    const dollar = data.icons?.icon1 

    // console.log(text)
    console.log(product)

    let innerWidth
    $: scale = Math.min(innerWidth/width, 1)
</script>
<svelte:window bind:innerWidth/>
{#if !product.hasOwnProperty('id')}
<container>
    <tag style="height: {height + 80}px; width: {width}px; transform: scale({scale}, 0.85);">
        <Skeleton height={height + 80} width={width} primaryColor="#ddd"> 
            {#each text as [label, style], i}
                <rect width="96" height={style['font-size']} x={style.x} y={style.y} rx={8} ry={8}/>
            {/each}
        </Skeleton>

    </tag>
</container>
{:else}
<container>
    <tag style="height: {height + 80}px; width: {width}px; transform: scale({scale}, 0.85);">
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
                    <input style="background:none" value="{product[label] ?? ''}"/>
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
</container>
{/if}
<style>
    container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100vh;
        justify-content: flex-start;
        align-items: center;
        background-color:blue;

    }
    tag {
        position: absolute; 
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
    }
    span { 
        position: absolute;
    }
    sup { 
        font-size: .6em;
    }
</style>
