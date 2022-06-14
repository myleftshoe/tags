<script>
    import { meta, nullProduct } from '$lib/stores/products'
    export let product = { ...nullProduct }
</script>
<form method="dialog" id="form" class="form-control">
    {#each Object.entries(meta) as [key, value]}
        {#if !(value.hidden)}
            <span>
                <span class="flex justify-between items-center">
                    <label for="{key}">{value.name}</label>
                    {#if value.alt}
                        <span class="label-text-alt">{value.alt}</span>
                    {/if}
                </span>
                <input class="input input-bordered w-full max-w-xs focus:input-primary"
                    id="{key}" 
                    type="text" 
                    bind:value={product[key]}
                    placeholder="{value.placeholder}"
                />
            </span>
        {/if}
    {/each}
    <a class="link text-right text-accent text-sm" target="_blank" rel="noopener noreferrer" href="https://www.ifpsglobal.com/PLU-Codes/PLU-codes-Search">Lookup PLU Code</a>
</form>
<style>
    label { 
        @apply uppercase inline-block mb-1
    }
    form { 
        @apply grid grid-cols-2 grid-rows-4 grid-flow-row gap-y-5 gap-x-10 m-5 text-base-content
    }
</style>
