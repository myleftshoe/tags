import { readable } from 'svelte/store'
import minew from '$lib/datasources/minew'
import translate from '$lib/util/translations'
import { alpha } from '$lib/util/sort'


export default readable([], (set) => {
    (async function asyncWrapper() {
        console.log('productStore')
        // set([])
        // return
        const response = await minew.get(`/goods?page=1&size=9999&storeId=123`)
        const products = response.rows
            .filter(row => ['FRUIT', 'VEGETABLES'].includes(row.label13))
            .map(row => ({
                id: row.id,
                // qrcode: row.qrcode,
                // barcode: row.barcode,
                plucode: row.label3,
                label4: row.label4.trim(),
                label5: row.label5.trim(),
                label6: row.label6,
                name: getName(row),
                price: row.label6,
                label8: row.label8,
                label9: row.label9,
                label10: row.label10,
                label11: row.label11,
                label13: row.label13,
                status: translate(row.status) || row.status,
            }))
            // .filter(row => row.status === 'bound')
            .sort(alpha('name'))
    
        // console.table(products)
        set(products)
    })()
})

export const nullProduct = {
    label3: '0000', 
    label4: 'name 1',
    label5: 'name 2',
    label6: '9.99',
    label8: 'Organic',
    label9: 'Grade',
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
        name: getName(product),
        ...product
    }
}

function getName({label4 = '', label5 = ''} = {}) {
    return `${label4.trim()} ${label5.trim()}`.trim()
} 