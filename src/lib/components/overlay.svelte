<script>
    import { browser } from '$app/env'
    import { createEventDispatcher } from 'svelte'
    import { scale } from 'svelte/transition'
    const dispatch = createEventDispatcher()
    
    export let open = false
    export let closeButton = false
    export let cancel = ''    
    
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
    <main in:scale={{duration: 250}} out:scale={{duration: 500}} class="bg-base-100 z-30">
        <slot/>
        {#if (closeButton)}
            <button class="no-animation btn btn-sm btn-circle absolute right-5 top-4" on:click={close}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        {/if}
        <actions class="fixed flex w-full justify-between px-4 py-10 bottom-0 h-32 z-40 text-base">
            {#if cancel}
                <button class="no-animation btn btn-ghost gap-2" style="font-size: inherit;" on:click={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>            
                    <span>{cancel}</span>
                </button>
            {/if}
            <slot name='actions'/>
        </actions>
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
    }
</style>
