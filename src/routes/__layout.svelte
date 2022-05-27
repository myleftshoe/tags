<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import search from '$lib/stores/search';
    import showUnbound from '$lib/stores/bound';

    let themeColor = ''

    const setTheme = ({ matches }) => {
        const theme = matches ? 'dark' : 'light'
        document.documentElement.setAttribute("data-theme", theme)
        themeColor = window.getComputedStyle(refs.nav).getPropertyValue('background-color')
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

</script>

<svelte:head>
    <meta name="theme-color" content="{themeColor}"/> 
</svelte:head>

<nav bind:this={refs.nav} class="navbar bg-secondary sticky top-0 shadow-xl">
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
        <!-- empty -->
    </div>
</nav>

<slot />
