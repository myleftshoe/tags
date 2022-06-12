<script>
    export const show = () => ref.showModal()
    export let title =''
    let ref
</script>
<svelte:options accessors={true}/>  
<dialog bind:this={ref} class="rounded-box border-8 border-base-300 p-5 bg-base-200 shadow-2xl">
    <title>{title}</title>
    <slot/>
    <actions>
        <slot name="actions"></slot>
    </actions>
</dialog>
<style>
    /* dialog::backdrop { background-color: red;} */
    title { 
        @apply uppercase block text-2xl text-accent font-bold w-full text-center  p-2 pb-5 
    }
    actions {
        @apply flex w-full justify-center gap-10 mt-10
    }
    
</style>