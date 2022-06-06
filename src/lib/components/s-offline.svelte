<script lang="ts">
    import Ping from 'ping.js'
    import { browser } from '$app/env'
    import { createEventDispatcher } from 'svelte'

    const emit = createEventDispatcher()
    export let pingUrl = 'https://google.com'

    $: isOnline = browser && navigator.onLine || false // data variable

    const updateOnlineStatus = () => {
        const p = new Ping()
        p.ping(pingUrl, (err) => {
            if (err || !navigator.onLine) {
                isOnline = false
            } else {
                isOnline = true
            }
            emit('detectedCondition', { online: isOnline })
        })
    }
</script>

<svelte:window on:online={updateOnlineStatus} on:offline={updateOnlineStatus} on:load={updateOnlineStatus} />

{#if isOnline}
    <slot name="online">
        <!-- Fallback text -->
        You're online
    </slot>
{:else}
    <slot name="offline">
        <!-- Fallback text -->
        You're offline
    </slot>
{/if}
