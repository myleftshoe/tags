<script context="module">
    import Ripple from 'svelte-ripple'
    const items = Array.from({length: 5}, (v, i) => ({
        primary: `primary ${i}`,
        secondary: `secondary ${i}`,
    }))
</script>
<ul class="flex flex-col divide-y divide-zinc-500">
    {#each items as { primary, secondary}}
    <li class="flex flex-row justify-between py-4 px-6 text-base-content" use:Ripple={{ centered: false, color: 'hsl(var(--p))', opacity: .2, }}>
        <div>
            <div>primary 1</div>
            <div>secondary1</div>
        </div>
        <div class="flex flex-col justify-center">meta</div>
    </li>
    {/each}
</ul>

<button class="btn m-10" use:Ripple={{ centered: false }}>
    test
</button>