<script>
    export let id
    export let closeButton = 'outside'
    export let closeOnOutsideClick = false

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()

    function handleDialogClose() {
        console.log('should close')
        dispatch('close')
    }

    let open = false
    $:console.log($$props, {closeButton}, {open})
    $: !open && dispatch('close')
</script>

<input type="checkbox" {id} class="modal-toggle" bind:checked={open}/>
<div class="modal">
    {#if closeOnOutsideClick}
        <label for={id} class="absolute left-0 top-0 h-full w-full"/>
    {:else if closeButton === "outside"}
        <label for={id} class="btn btn-sm btn-circle absolute right-2 top-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </label>
    {/if}
    <div class="relative w-11/12 max-w-lg scale-95">
        {#if (closeButton === true)}
            <label for={id} class="btn btn-sm btn-circle absolute -right-5 -top-4 z-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </label>
        {/if}
        <div class="modal-box overflow-y-scroll w-full p-5 pb-0">
            <slot/>
            <div class="modal-action">
                <slot name='actions'/>
            </div>
        </div>
    </div>
</div>
