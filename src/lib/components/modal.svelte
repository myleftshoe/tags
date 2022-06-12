<script>
    export const show = () => ref.showModal()
    let ref
</script>
<dialog bind:this={ref} class="rounded-box border-8 border-base-300 p-5 bg-base-200 shadow-2xl">
    <slot/>
</dialog>
<style>
    /* dialog::backdrop { background-color: red;} */
</style>