<script context="module" lang='ts'>

    const pp = (o) => console.log(JSON.stringify(o, null, 2))

    const labelMappings = {
        label3: '0000',
        label4: 'name 1',
        label5: 'name 2',
        label6: '9.99',
        label8: 'Organic',
        label9: 'grade',
        label10: 'kg',
        label11: 'VIC',
    }

    const fields = {
        label3: { name: 'plucode', editable: false, },
        label4: { name: 'name1', editable: true, },
        label5: { name: 'name2', editable: true, },
        label6: { name: 'price', editable: true, },
        label8: { name: 'specification', editable: true, },
        label9: { name: 'grade', editable: true, },
        label10: { name: 'unit', editable: true, },
        label11: { name: 'origin', editable: true, },
    }

</script>

<script>
    import demoData from '$lib/stores/demoData.json'
    import nullProduct from '$lib/stores/products'
    // pp({demoData})

    let refs = {} 

    const data = demoData[0]
    const { height, width } = data.size

    const text = Object.entries(data.text)
    pp({text})
    export let product = nullProduct

    function selectText(e) {
        e.target.select()
    }

    const dollar = data.icons?.icon1

    $: product ??=  nullProduct
    $: pp({product})

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
                                bind:value={product[label]} 
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
    <actions>
        <button class="btn btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus">-</button>
        <button class="btn btn-accent text-3xl w-16 focus:bg-accent active:bg-accent-focus">+</button>
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
        position: fixed;
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
        background-color: transparent;
        /* padding: 0 .5rem; */
        transition: background-color .2s ease;
        border-radius: 5px;
    }
    /* input:focus {
        background-color: #f002;
    } */
</style>
