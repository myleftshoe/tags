<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import search from '$lib/stores/search';
    import showUnbound from '$lib/stores/bound';

    let theme = ''

    const setTheme = ({ matches }) => {
        theme = matches ? 'dark' : 'light'
        document.documentElement.setAttribute("data-theme", theme)
    }

    onMount(() => {
        const matchMediaList = window.matchMedia("(prefers-color-scheme: dark)")
        matchMediaList.addEventListener('change', setTheme);        
        setTheme(matchMediaList)
    });

    let refs = {};
    async function clearSearch() {
        search.set('');
        refs.search.focus();
    }

    $: console.log($showUnbound, {theme})
</script>

<svelte:head>
    {#if (theme === 'dark')}
        <meta name="theme-color" content="#2A303C"> 
    {:else}
        <meta name="theme-color" content="#FFFFFF">
    {/if}
</svelte:head>

<nav bind:this={refs.nav} class="navbar bg-base-100 sticky top-0 shadow-xl">
    <div class="navbar-start">
        <button class="btn btn-ghost btn-circle">
            <label class="swap">
                <input type="checkbox" bind:checked={$showUnbound}/>
                <svg class="swap-on h-5 w-5 stroke-current" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />  <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg>
                <svg class="swap-off h-5 w-5 stroke-current"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />  <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />  <line x1="16" y1="21" x2="16" y2="19" />  <line x1="19" y1="16" x2="21" y2="16" />  <line x1="3" y1="8" x2="5" y2="8" />  <line x1="8" y1="3" x2="8" y2="5" /></svg>
            </label>
        </button>
    </div>
    <div class="form-control flex flex-row relative">
        <input
            bind:this={refs.search}
            bind:value={$search}
            type="search"
            placeholder="Search"
            class="input input-bordered text-base focus:input-primary"
        />
        <button
            class="btn btn-xs btn-circle btn-ghost absolute right-2 text-base-content bg-base-300"
            on:click={clearSearch}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    <div class="navbar-end">
        <button class="btn btn-ghost btn-circle">
            <div class="swap {theme === 'dark' ? 'swap-active' : ''}">
                <svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
                <svg class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
            </div>
        </button>
    </div>
</nav>

<slot />
