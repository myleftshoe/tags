<script>
    import products from '$lib/stores/products'
    import search from '$lib/stores/search'
    import fuzzy from '$lib/util/fuzzy'
    import { alpha, num } from '$lib/util/sort'

    let sort = { by: 'label4', desc: false }

    let refs = {}

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

    $: items = fuzzy($products, $search.toUpperCase(), ['label4', 'label5', 'id'])
</script>

<div class="absolute inset-0 grid place-items-center bg-base-300">
    <div class="absolute top-40 bottom-16 inset-x-12 overflow-auto">
        <div class="relative">
            <table class="table table-zebra table-fixed w-full z-0 p-8 rounded-lg">
                <thead on:click={handleTHeadClick}>
                    <th class="w-16 text-center">
                        <input bind:this={refs.selectAll} type="checkbox" data-checkbox="header" class="checkbox checkbox-sm" checked={false} on:change={selectAll}/>
                    </th>
                    <th class="w-16 text-center" data-key="label3" data-type="number">PLU</th>
                    <th class="w-24 text-left" data-key="name">Product</th>
                    <th class="w-20 text-right" data-key="label6" data-type="number">Price</th>
                    <th class="w-16 text-left" data-key="label10">Unit</th>
                    <th class="w-32 text-left" data-key="label13">Category</th>
                    <th class="w-32 text-left" data-key="label18">Department</th>
                    <th class="w-24 text-left" data-key="status">Status</th>
                </thead>
                <tbody>
                    {#each items as row}
                        <tr>
                            <td class="w-16 text-center">
                                <input type="checkbox" data-checkbox="row" class="checkbox checkbox-sm" checked={false} on:change={handleCheckboxChange}/>
                            </td>
                            <td class="w-20 text-center">{row.label3}</td>
                            <td class="w-24 text-left">{`${row.label4} ${row.label5}`}</td>
                            <td class="w-20 text-right">${row.label6}</td>
                            <td class="w-16 text-left">{row.label10}</td>
                            <td class="w-32 text-left">{row.label13}</td>
                            <td class="w-32 text-left">FRUIT&VEG</td>
                            <td class="w-20 text-left" on:click={sort()}>{row.status}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    th {
        @apply bg-primary text-primary-content sticky top-0 cursor-pointer shadow-2xl;
    }
</style>
