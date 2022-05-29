<script>
    import { browser } from '$app/env'
    import { createEventDispatcher } from 'svelte'
    import { scale as tran } from 'svelte/transition'
    const dispatch = createEventDispatcher()
    export let open = false
    if (browser) console.log(screen.width)
    let bodyHeight = browser && document.body.style.height  || ''

    function handleClose(e) {
        console.log(e.target.innerText)
        dispatch('close')
        open = false
    }

    $: console.log(open)
    $: if (open) {
        // document.body.style.height = '100vh'
        document.body.style.overflow = 'hidden'
    }
    $: if (browser && !open) {
        //  document.body.style.height = bodyHeight
         document.body.style.overflow = 'auto'
    }
</script>
{#if open}
    <overlay transition:tran={{duration: 200}} class="bg-base-100">
        <slot/>
    </overlay>
{/if}
<style>
    overlay { 
        display: grid;
        place-content: end center;
        /* background-color: #f003; */
        position: fixed;
        top: 0;
        left:0;
        height: 100%;
        width: 100%;
        z-index: 999;
    }
</style>