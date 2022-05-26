<script context="module">
    import search from '$lib/stores/search'
    import showUnbound from '$lib/stores/bound';
    import products from '$lib/stores/products'
    import fuzzy from '$lib/util/fuzzy'
</script>
<script>
    let selectedItem = {} 
    function handleItemClick(item) {
        selectedItem = item
        console.log(item)
    }
    function handleDialogClose() {
        console.log('should close')
    }
    $: items = fuzzy($products.filter(({status}) => !$showUnbound ? status === 'bound' : true ), $search.toLocaleUpperCase(), ['label4', 'label5', 'Description', 'id'])
</script>
<ul class="flex flex-col divide-y divide-primary">
    {#each items as item}
    <label for="my-modal-6">
          <li class="flex flex-row justify-between py-4 px-6 text-base-content bg-base-100 active:bg-base-200" on:click={(e) => handleItemClick(item)}>
            <div style={`${item.status === 'unbound' && 'opacity:.50'}`}>
                <div>{item.label5}</div>
                <div>{item.label4}</div>
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


<!-- The button to open modal -->
<!-- <label for="my-modal-6" class="btn modal-button">open modal</label> -->

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-6" class="modal-toggle"/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Congratulations random Interner user!</h3>
    <p class="py-4">{selectedItem.name}</p>
    <div class="modal-action">
        <label for="my-modal-6" class="btn" on:click={handleDialogClose}>Done</label>
    </div>
  </div>
</div>
