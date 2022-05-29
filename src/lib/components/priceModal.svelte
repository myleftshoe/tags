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

    function handleInputFocus(e) {
        e.target.select()
    }

    let [dollars, cents = ''] = price.split('.')

    $: console.log({ dollars, cents })
</script>

<main class="flex flex-col gap-20 p-5 justify-between place-content-center">
    <header class="flex flex-col w-full gap-2">
        <input type="text" placeholder="[LINE 1]" class="input input-lg w-full max-w-xs text-3xl" bind:value={selectedItem.label5} />
        <input type="text" placeholder="[LINE 2]" class="input input-lg w-full max-w-xs text-3xl" bind:value={selectedItem.label4} />
    </header>
    <content>
        <div class="flex flex-row justify-center items-center gap-5">
            <div class="flex flex-col gap-2">
                <button on:click={increment} class="btn text-3xl">+</button>
                <button on:click={decrement} class="btn text-3xl">-</button>
            </div>
            <span class="text-3xl translate-x-3">$</span>
                <input
                    bind:value={dollars}
                    on:focus={handleInputFocus}
                    type="tel"
                    maxlength="2"
                    class="input input-lg px-3 pt-3 pb-1 w-32 h-full focus:border-none focus:outline-none text-center text-7xl font-mono"
                />
                <div class="flex flex-col gap-4 w-1/4">
                    <input
                        bind:value={cents}
                        on:focus={handleInputFocus}
                        type="tel"
                        maxlength="2"
                        class="input input-md input-ghost focus:border-none focus:outline-none w-full text-3xl -translate-x-7"
                    />
                    <input
                        bind:value={unit}
                        on:focus={handleInputFocus}
                        type="text"
                        class="input input-md input-ghost focus:border-none focus:outline-none w-full text-xl -translate-x-7"
                    />
                </div>
        </div>
    </content>
    <footer></footer>
</main>
