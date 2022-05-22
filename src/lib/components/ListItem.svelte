<script>
import { compute_slots } from 'svelte/internal';

</script>
<li class="flex flex-row justify-between py-4 px-6 text-base-content">
    <div class="flex flex-col">
        <slot/>
    </div>
    {#if $$slots.meta}
        <div class="text-accent-content flex flex-col justify-center">
            <slot name="meta"/>
        </div>
    {/if}
</li>