<script>
    import '../app.css';
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
    import search from '$lib/stores/search';
    import products, { fetchProducts } from '$lib/stores/products'
    import Overlay from '$lib/components/overlay.svelte'
    import Keypad  from '$lib/components/keypad.svelte'
    import SOffline from "$lib/components/s-offline.svelte"
    import { sleep } from '$lib/util/sleep'
    import Hero from '$lib/components/hero.svelte'
    
    const handleNetworkChange = ({ detail }) => {
        console.warn("event details: ", detail);
    }

    const modals = {
        login: { open: true },
    }

    let themeColor = ''
    let dark = true
    
    const setTheme = ({ matches }) => {
        dark = matches
        const theme = dark ? 'dark' : 'light'
        document.documentElement.setAttribute("data-theme", theme)
        setTimeout(() => { 
            // update mobile appbar color consistent with color of navbar AFTER DOM HAS UPDATED
            themeColor = window.getComputedStyle(refs.nav).getPropertyValue('background-color') 
        }, 0)
    }

    function toggleTheme() {
        setTheme({matches: !dark})
    }

    onMount(() => {
        const matchMediaList = window.matchMedia("(prefers-color-scheme: dark)")
        matchMediaList.addEventListener('change', setTheme);        
        setTheme(matchMediaList)
        if ("virtualKeyboard" in navigator) {
            navigator.virtualKeyboard.overlaysContent = true;
        }        
    });

    let refs = {};

    function clearSearch() {
        search.set('');
        refs.search.focus();
    }

    function handleWindowKeyPress(e) {
        if (e.key === '#' && (document.activeElement !== refs.search || $search.startsWith('#'))) {
            // Scanning using built in phone barcode scanner!!!
            refs.search.setAttribute('virtualkeyboardpolicy', 'manual')
            modals.login.open = false
            clearSearch()
        }
    }

    function handleSubmit() {
        modals.login.open = false        
        refs.search.setAttribute('virtualkeyboardpolicy', 'auto')
    }

    function handlePointerDown() {
        refs.search.blur()
    }

    let alert = false
    async function reloadProducts() {
        try {
            products.set(await fetchProducts())
        } catch(e) {
            alert = true
            await sleep(6000)
            alert = false
        }
    }

</script>

<svelte:head>
    <!-- 
        "theme-color" set color of "surrounding ui" which includes the mobile appbars!
        (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color)
      -->
    <meta name="theme-color" content="{themeColor}"/> 
    <!-- 
        Script to include Alibaba PuHuiTi fonts. Can also put the script in App.html
        Source: https://fonts.adobe.com/fonts/alibaba-puhuiti

        Alibaba PuHuiTi Light
        font-family: alibaba-puhuiti, sans-serif;
        font-weight: 300;
        font-style: normal;
        
        Alibaba PuHuiTi Regular
        font-family: alibaba-puhuiti, sans-serif;
        font-weight: 400;
        font-style: normal;
        
        Alibaba PuHuiTi Medium
        font-family: alibaba-puhuiti, sans-serif;
        font-weight: 500;
        font-style: normal;
        
        Alibaba PuHuiTi Bold
        font-family: alibaba-puhuiti, sans-serif;
        font-weight: 700;
        font-style: normal;
        
        Alibaba PuHuiTi Heavy
        font-family: alibaba-puhuiti, sans-serif;
        font-weight: 900;
        font-style: normal;
    -->
    <script>
        (function(d) {
            var config = {
            kitId: 'ysq0rft',
            scriptTimeout: 3000,
            async: true
            },
            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
        })(document);			
    </script>
</svelte:head>

<svelte:window on:keypress|capture={handleWindowKeyPress}/>
<svelte:body on:pointerdown|capture={handlePointerDown}/>

<nav on:click|stopPropagation bind:this={refs.nav} class="navbar bg-base-100 sticky top-0 shadow-xl z-20">
    <SOffline pingUrl="https://esl.minew.com" on:detectedCondition={handleNetworkChange}>
        <span slot="online" class="absolute -top-1 left-0 text-green-500 select-none">●</span>
        <span slot="offline" class="absolute -top-1 left-0 text-red-500 select-none">●</span>
    </SOffline>
    <div class="navbar-start">
        <button class="no-animation transition-colors btn btn-ghost btn-circle active:bg-base-300 focus:bg-transparent" on:click={reloadProducts}>
            <svg class="fill-current transition-transform active:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
        </button>
    </div>
    <div class="relative">
        <input
            bind:this={refs.search}
            bind:value={$search}
            id="search"
            type="search"
            placeholder="Search"
            autocapitalize="none"
            class="w-48 input input-bordered input-xs px-3 py-5 text-base focus:input-primary"
        />
        <button
            class="{$search.length === 0 ? 'invisible': '' } no-animation btn btn-sm btn-ghost absolute right-0 h-full text-base-content hover:bg-transparent"
            on:click={clearSearch}
        >
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
    <div class="navbar-end">
        <button class="no-animation btn btn-ghost btn-circle swap swap-rotate active:bg-base-300 focus:bg-transparent {dark ? 'swap-active' : ''}" on:click={toggleTheme}>
            <svg class="swap-on fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
            <svg class="swap-off fill-current w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
        </button>
    </div>
</nav>

<Overlay bind:open={modals.login.open}>
    <Hero on:submit={handleSubmit}/>
</Overlay>

<slot />

{#if alert}
<div transition:fly class="alert alert-warning shadow-lg absolute top-16">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <p>Can't login to esl.minew.com. No internet or the server is down.</p>
    </div>
</div>
{/if}

<style>
    :global(body) {
        overflow: auto;
        overscroll-behavior-y: contain;
    }
</style>