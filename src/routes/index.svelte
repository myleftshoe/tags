<script context="module">
    import search from '$lib/stores/search'
    import showUnbound from '$lib/stores/bound';
    import products from '$lib/stores/products'
    import fuzzy from '$lib/util/fuzzy'
    import Modal from '$lib/components/modal.svelte'
</script>
<script>
    let selectedItem = {} 
    const handleItemClick = (item) => (e) => {
        selectedItem = item
        console.log(item)
    }

    function forceRefresh() {
        console.log('forceRefresh', {selectedItem})
        console.table(items)
        items = [ ...items ]
    }

    $: items = fuzzy($products.filter(({status}) => !$showUnbound ? status === 'bound' : true ), $search.toLocaleUpperCase(), ['label4', 'label5', 'Description', 'id'])
</script>
<ul class="flex flex-col divide-y divide-base-300">
    {#each items as item}
    <label for="edit-modal">
          <li class="flex flex-row justify-between py-4 px-6 text-base-content bg-base-100 active:bg-base-200 dark:border-b" on:click={handleItemClick(item)}>
            <div style={`${item.status === 'unbound' && 'opacity:.50'}`}>
                <div>{item.name}</div>
                <!-- <div>{item.label5}</div>
                <div>{item.label4}</div> -->
            </div>
            <div class="flex flex-col justify-center items-end"
                style={`${item.status === 'unbound' && 'opacity:.50'}`}
            >
                <div>${item.price}</div>
                <div>{item.label10}</div>
            </div>
        </li>
    </label>
    {/each}
</ul>
<!-- {#if !$products.length}
    <progress class="progress progress-accent"></progress>
{/if} -->

<Modal id="edit-modal" closeButton  on:close={forceRefresh}>
    <div class="flex flex-col gap-4">
        <input type="text" class="input input-bordered w-full focus:input-primary text-lg" bind:value={selectedItem.label4}/>
        <input type="text" class="input input-bordered w-full focus:input-primary text-lg" bind:value={selectedItem.label5}/>
        <span class="flex flex-row items-center relative gap-2">
            <span class="absolute left-4 text-xl">$</span>
            <input id="price" type="number" class="input input-lg input-bordered w-full focus:input-primary text-right text-xl" bind:value={selectedItem.price}/>
            <input type="text" class="input input-lg input-bordered w-full focus:input-primary text-xl" bind:value={selectedItem.label10}/>
        </span>
        <label for="edit-modal" class="btn">Done</label>
    </div>
</Modal>
