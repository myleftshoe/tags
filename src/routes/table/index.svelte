<script>
    import products from '$lib/stores/products'
    import search from '$lib/stores/search'
    import fuzzy from '$lib/util/fuzzy'
    import minew from '$lib/datasources/minew'
    import { alpha, num } from '$lib/util/sort'
    import Modal from '$lib/components/modal.svelte'
    import AddProduct from '$lib/components/addProduct.svelte'

    let sort = { by: 'label4', desc: false }

    let refs = {}

    function getSelectedItems(e) {
        const checkboxes = document.querySelectorAll('input[data-checkbox="row"]:checked')
        console.log(checkboxes)
        const ids = [...checkboxes].map(({dataset}) => dataset.id)
        console.log(ids)
        const selectedItems = items.filter(({id}) => ids.includes(id)).map(({ name, status, ...extracted }) => ({ ...extracted, label18: '@FRUIT&VEG'}))
        console.table(selectedItems)
        sendIt(selectedItems)
        // [...checkboxes].forEach(checkbox => {
        //     checkbox.checked = e.target.checked
        // })
        
    }

    async function sendIt(payload) {
        console.log('payload', JSON.stringify(payload, null, 2))
        minew.batchPost('goods?storeId=123', payload)
    }


    function selectAll(e) {
        const checkboxes = document.querySelectorAll('[data-checkbox="row"]');
        [...checkboxes].forEach(checkbox => {
            checkbox.checked = e.target.checked
        })
    }

    function handleCheckboxChange(e) {
        const checkboxes = [...document.querySelectorAll('[data-checkbox="row"]')]
        refs.selectAll.indeterminate = checkboxes.some(({checked}) => checked !== refs.selectAll.checked)
    }

    function handleTHeadClick(e) {
        const { key, type } = e.target.dataset
        if (!key) return
        const fn = type === 'number' ? num : alpha
        if (sort.by === key) {
            sort.desc = !sort.desc
        } else {
            sort.by = key
            sort.desc = false
        }

        items.sort(fn(key))
        sort.desc && items.reverse()
        items = [...items]
    }

    let selectedItem = {}

    function editProduct(item) {
        selectedItem = item
        refs.addModal.show()
    }

    let items = []

    $: console.warn($products.length)
    $: items = fuzzy($products, $search.toUpperCase(), ['label4', 'label5', 'id', ''])
</script>
<div class="absolute inset-0 bg-base-300">
    <div class="absolute inset-12 top-24">
        <div class="w-full flex justify-between items-center">
            <!-- Department -->
            <div>
            <div class="dropdown">
                <button tabindex="0" class="btn btn-ghost">
                    <span class="px-2">@FRUIT&VEG</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                </button>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button>@FRUIT&VEG</button></li>
                  <li><button>@BULK</button></li>
                </ul>
            </div>
            <span class="badge badge-lg bg-accent text-accent-content">
            {$products.length} products
            </span>
        </div>            
            <!-- actions -->
            <ul class="menu menu-horizontal bg-base-100 mb-2 rounded-box shadow-md">
                <li><button on:click={getSelectedItems}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </button></li>
                <li><button on:click={refs.addModal.show}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button></li>
                <li><button>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </button></li>
            </ul>   
        </div>
        <!-- table -->
        <div class="absolute inset-y-16 overflow-auto">
            <div class="relative">
                <table class="table table-zebra table-fixed table-compact w-full z-0 p-8 rounded-lg">
                    <thead on:click={handleTHeadClick}>
                        <th class="w-16 text-center">
                            <input bind:this={refs.selectAll} type="checkbox" data-checkbox="header" class="checkbox checkbox-sm" checked={false} on:change={selectAll}/>
                        </th>
                        <th class="w-16 text-center" data-key="id" data-type="number">ID</th>
                        <th class="w-16 text-center" data-key="label3" data-type="number">PLU</th>
                        <th class="w-56 text-left" data-key="name">Product</th>
                        <th class="w-20 text-right" data-key="label6" data-type="number">Price</th>
                        <th class="w-16 text-left" data-key="label10">Unit</th>
                        <th class="w-32 text-left" data-key="label13">Category</th>
                        <th class="w-32 text-left" data-key="label18">Department</th>
                        <th class="w-24 text-left" data-key="status">Status</th>
                    </thead>
                    <tbody>
                        {#each items as item (item.id) }
                            <tr on:click={() => editProduct(item)} class="cursor-pointer {item === selectedItem ? 'active' : ''}">
                                <td class="w-16 text-center">
                                    <input data-id="{item.id}" type="checkbox" data-checkbox="item" class="checkbox checkbox-sm" checked={false} on:change={handleCheckboxChange} on:click|stopPropagation/>
                                </td>
                                <td class="w-20 text-center">{item.id}</td>
                                <td class="w-20 text-center">{item.label3}</td>
                                <td class="w-24 text-left">{`${item.label4} ${item.label5}`}</td>
                                <td class="w-20 text-right">${item.label6}</td>
                                <td class="w-16 text-left">{item.label10}</td>
                                <td class="w-32 text-left">{item.label13}</td>
                                <td class="w-32 text-left">{item.label18}</td>
                                <td class="w-20 text-left" on:click={sort()}>{item.status}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /table -->
    </div>
</div>

<!-- {#if modals.add} -->
<Modal bind:this={refs.addModal}>
    <AddProduct product={selectedItem}/>
</Modal>

<!-- {/if} -->

<style>
    th {
        @apply bg-primary text-primary-content sticky top-0 cursor-pointer shadow-2xl;
    }
</style>
