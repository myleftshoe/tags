<script>
    import { browser } from '$app/env'
    import { createEventDispatcher } from 'svelte'
    // import { sleep } from '$lib/util/sleep'
    import { loggedIn, loginWithPincode } from '$lib/stores/auth.js'

    const dispatch = createEventDispatcher();    


    async function checkPincode() {
        const ok = await loginWithPincode(value)
        if (!ok) {
            console.warn('Incorrect pincode')
            return
        }            
        console.log('Correct pin entered')
        $loggedIn = true
        // await sleep(300)
        dispatch('submit')
    }


    let value = ''

    const select = (num) => () => {
        value += num
        if (value.length === 4) {
            checkPincode()
        }
        if (value.length > 4) {
            value = ''
        }
    }

    $: view = value ? view.substring(0, value.length - 1) + '●' + view.substring(value.length) : '○○○○'
    $: console.log({browser})
</script>

<div class="bg-primary-focus fixed inset-0 z-50">
    <main class="glass h-full py-8">
        <p class="text-2xl text-primary-content opacity-60 select-none after:content-['*'] after:text-sm after:absolute">Enter PIN</p>
        <h1 class="text-3xl tracking-widest text-accent select-none">{view}</h1>
        <keypad>
            {#each [1,2,3,4,5,6,7,8,9,null,0] as key}
                <button name="key" on:click={select(key)}
                    disabled={!browser} 
                    class="{key === null ? 'invisible' : ''} no-animation transition-none btn btn-circle border-primary-content opacity-60 btn-lg text-primary-content bg-accent/0 text-2xl font-normal hover:bg-transparent active:bg-accent active:border-accent active:text-accent-content hover:border-primary-content" 
                >
                    {key}
                </button>
            {/each}
        </keypad>
        <button class="btn btn-link text-accent {!value && 'invisible'}" on:click|stopPropagation={() => (value = '')}>delete</button>
        <footer class="grid place-content-center w-full absolute bottom-4 text-sm text-primary-content opacity-50 select-none">*or scan a tag to start</footer>
    </main>
</div>

<style>
    main { 
        align-self: flex-end;
        overflow: hidden;
        display: grid;
        place-items: center;
    }
    keypad {
        display: grid;
        place-content: end;
        place-items: center;
        grid-template-columns: repeat(3, 5em);
        grid-template-rows: repeat(4, 4.5em);
        grid-gap: 0.5em;
    }
</style>
