<script>
    import { meta, nullProduct } from '$lib/stores/products'
    export let product = { ...nullProduct }
</script>
    <title>add product</title>
    <form method="dialog" id="form">
        {#each Object.entries(meta) as [key, value]}
            {#if !(value.hidden)}
                <span>
                    <label for="{key}">{value.name}</label>
                    <input 
                        id="{key}" 
                        type="text" 
                        bind:value={product[key]}
                        placeholder="{value.placeholder}"
                    />
                </span>
            {/if}
        {/each}
    </form>
    <!-- <div class="divider" /> -->
    <actions>
        <button form="form" class="btn" value="cancel">Cancel</button>
        <button form="form" class="btn btn-primary" value="default">Confirm</button>
    </actions>
<style>
    title { 
        @apply uppercase block text-2xl text-accent font-bold w-full text-center  p-2 pb-5 
    }
    label { 
        @apply uppercase inline-block mb-1
    }
    input {
       @apply input input-bordered w-full max-w-xs focus:input-primary
    }
    form { 
        @apply grid grid-cols-2 grid-rows-4 grid-flow-row gap-y-5 gap-x-10 m-5 text-base-content
    }
    actions {
        @apply flex w-full justify-center gap-10 mt-10
    }

</style>
