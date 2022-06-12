<script>
    export const show = () => ref.showModal()
    let ref
</script>
<svelte:options accessors={true}/>  
<dialog bind:this={ref} on:close>
    <content>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <slot/>
    </content>
    <form class="actions" method="dialog">
        <button class="btn" value="cancel" on:click={close}>Cancel</button>
        <button class="btn btn-accent" value="default">Confirm</button>
    </form>
</dialog>
<style>
    /* dialog::backdrop { background-color: red;} */
    dialog {
        @apply rounded-box bg-warning shadow-xl max-w-xs py-5 px-10
    }
    content {
      @apply flex flex-row gap-2 justify-center items-center
    }
    .actions {
        @apply flex w-full justify-center gap-10 mt-5
    }
</style>