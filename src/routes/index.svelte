<script>
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import products, { nullProduct } from '$lib/stores/products'
    import search from '$lib/stores/search'
    import fuzzy from '$lib/util/fuzzy'
    import UID from '$lib/util/uid'
    import minew from '$lib/datasources/minew'
    import { alpha, num } from '$lib/util/sort'
    import Modal from '$lib/components/modal.svelte'
    import Confirm from '$lib/components/confirm.svelte'
    import AddProduct from '$lib/components/addProduct.svelte'

    let sort = { by: 'label4', desc: false }

    let checkedCount = 0

    let refs = {}

    function getChecked() {
        return [...document.querySelectorAll('input[data-checkbox="row"]:checked')]
    }

    async function postOne(product) {
        const { name, status, checked, ...payload } = { ...product, label18: '@FRUIT&VEG' }
        if (!payload.id) {
            let id
            let response
            // check for uid collisions
            do {
                id = new UID().value
                console.log(id)
                response = await minew.get(`goods/check?storeId=123&barcode=${id}`)
                console.log(`goods/check?storeId=123&barcode=${id}`)
                console.log(response)
            } while (response.errcode == 10000701)
            payload.id = id
        }
        console.log('payload', JSON.stringify(payload, null, 2))
        minew.post('goods?storeId=123', payload)
    }

    async function postMany(payload) {
        console.log('payload', JSON.stringify(payload, null, 2))
        minew.batchPost('goods?storeId=123', payload)
    }

    function selectAll(e) {
        const checkboxes = document.querySelectorAll('[data-checkbox="row"]')
        ;[...checkboxes].forEach((checkbox) => {
            checkbox.checked = e.target.checked
        })
        checkedCount = getChecked().length
        for (const item of items) {
            item.checked = e.target.checked
        }
        // items = [...items]
        // console.table(items)
    }

    function handleCheckboxChange(e) {
        const checkboxes = [...document.querySelectorAll('[data-checkbox="row"]')]
        refs.selectAll.indeterminate = checkboxes.some(({ checked }) => checked !== refs.selectAll.checked)
        checkedCount = getChecked().length

        const item = $products.find((product) => product.id === e.target.dataset.id)
        item.checked = e.target.checked
        // console.log(item)
    }

    function sortRows(e) {
        const { key, type } = e.target.dataset
        if (!key) return
        const fn = type === 'number' ? num : alpha
        if (sort.by === key) {
            sort.desc = !sort.desc
        } else {
            sort.by = key
            sort.desc = false
        }

        let _products = [...$products].sort(fn(key))    
        sort.desc && _products.reverse()
        products.set(_products)
    }

    let selectedItem = {}

    function addProduct() {
        selectedItem = { ...nullProduct }
        refs.addModal.title = 'Add Product'
        refs.addModal.show()
    }

    function editProduct(item) {
        selectedItem = item
        refs.addModal.title = 'Edit Product'
        refs.addModal.show()
    }

    function deleteProducts() {
        checkedCount && refs.confirmModal.show()
    }

    function handleModalClose(e) {
        if (e.target.returnValue === 'default') {
            console.log('Confirm pressed!')
            console.log(selectedItem)
            postOne(selectedItem)
        }
    }

    function handleConfirmClose(e) {
        if (e.target.returnValue === 'default') {
            const idsToDelete = $products.filter((product) => product.checked).map((product) => product.id)
            minew.batchDelete('goods?storeId=123', idsToDelete)
        }
    }

    onMount(() => {
        const observer = new IntersectionObserver(([scrollTrigger]) => {
            if (scrollTrigger.intersectionRatio > 0) {
                loadMore()
            }
        })
        observer.observe(refs.scrollTrigger)
    })

    function loadMore() {
        if (startIndex + maxItems > items.length) return
        startIndex += maxItems
        console.log(startIndex)
    }

    let maxItems = 20
    let startIndex = 0

    function reset() {
        console.log('resetting ')
        startIndex = 0
        items = []
    }

    let fuzzed = []
    let items = []

    $: $products, $search, reset()
    $: fuzzed = fuzzy($products, $search.toUpperCase(), ['label4', 'label5', 'id'])
    $: items = [...items].concat(fuzzed.slice(startIndex, startIndex + maxItems))
</script>

<div class="absolute inset-0 bg-base-300">
    <div class="absolute inset-12 top-28">
        <div class="w-full flex justify-between items-center">
            <!-- Department -->
            <div>
                <div class="dropdown">
                    <button tabindex="0" class="btn btn-ghost">
                        <span class="px-2">@FRUIT&VEG</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                    </button>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button>@FRUIT&VEG</button></li>
                        <li><button>@BULK</button></li>
                    </ul>
                </div>
                <span class="badge badge-lg border-0 bg-base-100 text-accent-content">
                    <div class="text-sm breadcrumbs">
                        <ul>
                            <li>{$products.length} products</li>
                            <li>{$products.length - fuzzed.length} filtered</li>
                            <li>{checkedCount} selected</li>
                        </ul>
                    </div>
                </span>
            </div>
            <!-- actions -->
            <div class="btn-group shadow-md">
                <button class="btn bg-base-100 btn-ghost" on:click={addProduct}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" width="24">
                        <path d="M11 19V13H5V11H11V5H13V11H19V13H13V19Z" />
                    </svg>
                </button>
                <button class="btn bg-base-100 btn-ghost" disabled={!checkedCount} on:click={deleteProducts}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" width="24">
                        <path d="M7 21Q6.175 21 5.588 20.413Q5 19.825 5 19V6H4V4H9V3H15V4H20V6H19V19Q19 19.825 18.413 20.413Q17.825 21 17 21ZM17 6H7V19Q7 19 7 19Q7 19 7 19H17Q17 19 17 19Q17 19 17 19ZM9 17H11V8H9ZM13 17H15V8H13ZM7 6V19Q7 19 7 19Q7 19 7 19Q7 19 7 19Q7 19 7 19Z" />
                    </svg>
                </button>
            </div>
        </div>
        <!-- table -->
        <div class="absolute top-20 bottom-0 overflow-y-scroll bg-base-100 rounded-lg">
            <div class="relative ">
                <table class="table table-zebra table-fixed table-compact w-full rounded-lg">
                    <thead on:click={sortRows}>
                        <th class="w-12 text-right">
                            <input bind:this={refs.selectAll}
                                type="checkbox"
                                data-checkbox="header"
                                class="checkbox checkbox-sm"
                                checked={false}
                                on:change={selectAll}
                            />
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
                        {#each items as item (item.id)}
                            <tr on:click={() => editProduct(item)} class="cursor-pointer {item === selectedItem ? 'active' : ''}" >
                                <td class="w-12 pt-3 text-right" on:click|stopPropagation>
                                    <input
                                        data-id={item.id}
                                        type="checkbox"
                                        data-checkbox="row"
                                        class="checkbox checkbox-sm"
                                        checked={item.checked}
                                        on:change={handleCheckboxChange}
                                    />
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
                        <!-- scroll trigger -->
                        <tr bind:this={refs.scrollTrigger}>
                            <td> <input type="checkbox" class="checkbox checkbox-sm invisible" /> </td>
                            <td /><td /><td /><td /><td /><td /><td /><td />
                        </tr>
                        <!-- empty rows -->
                        {#each new Array(4).fill('') as empty, i}
                            <tr>
                                <td> <input type="checkbox" class="checkbox checkbox-sm invisible" /> </td> <td />
                                <td /><td /><td /><td /><td /><td /><td />
                            </tr>
                        {/each}
                        <!-- No products alert -->
                        {#if !items.length}
                            <div transition:fade class="absolute w-full grid place-content-center place-items-center h-64" >
                                <div class="alert max-w-xs px-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6" >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg >
                                    <span>No matching products found.</span>
                                </div>
                            </div>
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
        <!-- /table -->
    </div>
</div>

<Modal bind:this={refs.addModal} on:close={handleModalClose}>
    <AddProduct product={selectedItem} />
    <svelte:fragment slot="actions">
        <button form="form" class="btn w-32" value="cancel">Cancel</button>
        <button form="form" class="btn btn-primary w-32" value="default">Confirm</button>
    </svelte:fragment>
</Modal>

<Confirm bind:this={refs.confirmModal} on:close={handleConfirmClose}>
    Are you sure you want to delete {checkedCount} items
</Confirm>

<style>
    th {
        @apply bg-primary text-primary-content sticky top-0 py-4 cursor-pointer shadow-2xl;
    }
</style>
