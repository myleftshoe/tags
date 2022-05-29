<script>
    export let price = '99.99'
    export let unit = 'kg'
    export let selectedItem = {}

    export let open = false

    const increment = (e) => {
        dollars = (parseInt(dollars) + 1).toString()
        if (dollars.length > 2)
            dollars = '99'
    }

    const decrement = (e) => {
        dollars = (parseInt(dollars) - 1).toString()
        if (dollars.startsWith('-'))
            dollars = '0'
    }

    let [dollars, cents = ''] = price.split('.')

    $: console.log({ dollars, cents })
</script>

<main class="flex flex-col gap-10 p-5 justify-between place-content-center">
    <header class="flex flex-col w-full">
        <input type="text" class="input input-bordered focus:input-primary text-lg" bind:value={selectedItem.label5} />
        <input type="text" class="input input-bordered focus:input-primary text-lg" bind:value={selectedItem.label4} />
    </header>
    <content>
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
    </content>
    <footer></footer>
</main>
