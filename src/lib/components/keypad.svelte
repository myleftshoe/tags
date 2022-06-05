<script>
    import { browser } from '$app/env'
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();    

    const sleep = (ms) => new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });

    let value = ''

    const select = (num) => async () => {
        value += num
        if (value === '2086') {
            console.log('Correct pin entered')
            await sleep(300)
            dispatch('submit')
        }
        if (value.length > 4) {
            value = ''
            return
        }
    }
    $: view = value ? view.substring(0, value.length - 1) + '●' + view.substring(value.length) : '○○○○'
    $: console.log({browser})
</script>

<main>
    <h1 class="text-3xl text-base-content">Enter PIN</h1>
    <h1 class="text-3xl tracking-widest text-accent-focus">{view}</h1>
    <keypad>
        {#each [1,2,3,4,5,6,7,8,9,null,0] as key}
            <button on:click={select(key)}
                disabled={!browser} 
                class="{key === null ? 'invisible' : ''} no-animation btn btn-circle btn-lg text-accent-content bg-accent text-2xl font-normal hover:bg-accent active:bg-accent-focus" 
            >
                {key}
            </button>
        {/each}
    </keypad>
    <button class="btn btn-link text-accent z-50 {!value && 'invisible'}" on:click={() => (value = '')}>delete</button>
</main>

<style>
    main { 
        display: grid;
        place-items: center;
        place-content: space-around;
        padding: 2em 0;
        gap: 2em;
    }
    keypad {
        display: grid;
        place-content: end;
        place-items: center;
        grid-template-columns: repeat(3, 5em);
        grid-template-rows: repeat(4, 5em);
        grid-gap: 0.5em;
    }
    /* .key {
        @apply btn btn-circle btn-lg text-accent-content bg-accent text-xl font-normal;
    } */
    .blink {
        animation: blinker .3s linear 2;
    }
    @keyframes blinker {  
        50% { opacity: 0; }
    }
</style>
