<script>
    import { browser } from '$app/env'
    import { createEventDispatcher } from 'svelte'
    import { scale } from 'svelte/transition'
    const dispatch = createEventDispatcher()
    
    export let open = false
    export let closeButton = false    
    
    if (browser) console.log(screen.width)

    function close(e) {
        dispatch('close', e.target.innerText)
        open = false
    }

    $: if (browser) {
        document.body.style.overflow = open ? 'hidden' : 'auto'
    }
</script>
{#if open}
    <main in:scale={{duration: 200}} out:scale={{duration: 500}} class="bg-base-100">
        <slot/>
        {#if (closeButton)}
            <button class="btn btn-sm btn-circle absolute right-5 top-4" on:click={close}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        {/if}
        <footer on:click={close} class="grid place-items-center">
            <slot name='actions'/>
        </footer>
    </main>
{/if}
<style>
    main { 
        display: grid;
        place-content: center center;
        /* background-color: #f003; */
        position: fixed;
        top: 0;
        left:0;
        right: 0;
        bottom:0;
        z-index: 999;
    }
</style>

<!-- <div slot="actions" class="grid grid-cols-auto-fit gap-2 w-2/3"> -->
