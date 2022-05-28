<script>
    import Modal from '$lib/components/modal.svelte'
    export let price = '99.99'
    export let unit = 'kg'

    const increment = (e) => {
        dollars = (parseInt(dollars) + 1).toString()
    } 

    const decrement = (e) => {
        dollars = (parseInt(dollars) - 1).toString()
    }     

    let [dollars, cents] = price.split('.')
    $: console.log({ dollars, cents })
</script>

<Modal id="price-modal" on:close>
    <div class="flex flex-col justify-center items-center gap-5">
        <span class="text-lg">APPLES FUJI</span>
        <div class="flex flex-row justify-around items-center gap-5">
            <div class="flex flex-col gap-2">
                <button on:click={increment} class="btn text-3xl">+</button>
                <button on:click={decrement} class="btn text-3xl">-</button>
            </div>
            <span class="text-3xl">$</span>
            <input
                bind:value={dollars}
                type="tel"
                maxlength="2"
                class="input input-lg input-bordered px-3 pt-3 pb-1 w-1/3 h-full focus:input-primary text-center text-5xl font-mono"
            />
            <div class="flex flex-col gap-2 w-16">
                <input
                    bind:value={cents}
                    type="tel"
                    maxlength="2"
                    class="input input-md input-ghost focus:input-primary w-full text-xl px-2"
                />
                <input 
                    bind:value={unit} 
                    type="text" 
                    class="input input-md input-ghost focus:input-primary w-full text-xl px-2" 
                />        
            </div>
        </div>
    </div>
    <div slot="actions" class="grid grid-cols-auto-fit gap-2 w-full">
        <!-- <label for="price-modal" class="btn" on:click={forceRefresh}>OK</label> -->
        <label for="price-modal" class="btn btn-primary">OK</label>
        <label for="price-modal" class="btn">Cancel</label>
    </div>
</Modal>
