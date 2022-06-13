import { writable } from 'svelte/store'
import minew from '$lib/datasources/minew'
import translate from '$lib/util/translations'
import { alpha } from '$lib/util/sort'

export async function fetchProducts() {
    const response = await minew.get(`/goods?page=1&size=99999&storeId=123&fuzzy=${encodeURIComponent('@FRUIT&VEG')}`)
    if (response.errcode && response.errcode !== 200) {
        console.warn(response)
        return Promise.resolve([])
    }
    const products = response.rows.map(row => ({
        id: row.id,
        // qrcode: row.qrcode,
        // barcode: row.barcode,
        label3: row.label3 ?? '',
        label4: row.label4?.trim() ?? '',
        label5: row.label5?.trim() ?? '',
        label6: row.label6 ?? '',
        name: getName(row),
        label8: row.label8 ?? '',
        label9: row.label9 ?? '',
        label10: row.label10 ?? '',
        label11: row.label11 ?? '',
        label13: row.label13 ?? '',
        label18: row.label18 || '',
        status: translate(row.status) || row.status,
    }))
    // .filter(row => row.status === "bound")
    .sort(alpha('name'))
    // .slice(0,20)
    return Promise.resolve(products)
}

export default writable([], (set) => {
    fetchProducts().then(set)
})

export const meta = {
    id: {hidden: true},
    name: {hidden: true},
    label5: { name: 'name2', editable: true, maxlength:16, uppercase: true, placeholder: '', tabindex: 1, },
    label4: { name: 'name1', editable: true, maxlength:16, uppercase: true, placeholder: '', tabindex: 2, },
    label6: { name: 'price', editable: true, maxlength:5, placeholder: '9.99', },
    label10: { name: 'unit', editable: true, maxlength:4, placeholder: 'kg', default: 'kg', tabindex: 5, },
    label8: { name: 'specification', editable: true, maxlength:16, placeholder: 'Organic', default: 'Organic', },
    label11: { name: 'origin', editable: true, maxlength:4, uppercase: true, placeholder: 'VIC', },
    label3: { name: 'plucode', editable: false, maxlength:8, uppercase: true, placeholder: '0000', },
    label9: { name: 'grade', editable: true, maxlength:21, placeholder: 'Grade', },
}

export const nullProduct = {
    label3: '0000', 
    label4: '',
    label5: '',
    label6: '9.99',
    label8: 'Organic',
    label9: '',
    label10: 'kg',
    label11: 'VIC',
}

export async function fetchPreview(macAddress) {
    console.log('preview', macAddress)
    const response = await minew.get(`label/query?storeId=123&mac=${macAddress}`)
    console.log(JSON.stringify(response.body, null, 2))
    const product = response.body?.goods ?? {}
    return { 
        macAddress, 
        ...product
    }
}

function getName({label4 = '', label5 = ''} = {}) {
    return `${label4?.trim() ?? ''} ${label5?.trim() ?? ''}`.trim()
} 