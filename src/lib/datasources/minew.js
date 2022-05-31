import Fetcher from './fetcher'
import { MINEW_USERNAME, MINEW_PASSWORD } from '$lib/env'

// TODO: remove credentials

const fetcher = new Fetcher(`https://esl.minew.com:9090/V1`)
let token


async function get(path) {
    console.log('get')
    token = await login()
    const headers = { 'Authorization': `Bearer ${token}` } 
    const response = await fetcher.fetch(path, { headers })
    return response.json()
}

async function post(path, payload) {
    const headers = { 
        "content-type": 'application/json',
        "Authorization": `Bearer ${await token}` 
    }
    const options = { 
        method: 'POST', 
        headers, 
        body: JSON.stringify(payload) 
        // body: JSON.stringify(sample) 
    }
    const response = await fetcher.fetch(path, options)
    const json = await response.json()
    return json
}

async function put(path, payload) {
    const headers = { 
        "content-type": 'application/json',
        "Authorization": `Bearer ${await token}` 
    }
    const options = { 
        method: 'PUT', 
        headers, 
        body: JSON.stringify(payload) 
        // body: JSON.stringify(sample) 
    }
    const response = await fetcher.fetch(path, options)
    console.log(await response.json())
}

async function login() {
    console.log('*** MINEW LOGIN ***')
    const payload = {
        "username": MINEW_USERNAME,
        "password": MINEW_PASSWORD
    }
    const response = await fetcher.fetch(`/pc/Login`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    const json = await response.json()
    const { token } = json.body
    console.log({token})
    return token
}


async function bind(macAddress = "ac233fd0b591", id = 2084) {
    console.log('minew bind!!!!', macAddress, id)
    const token = await login()

    // return Promise.resolve(`bound ${id} to ${macAddress}`)
    const path = 'label/update'
    const payload = {
        "mac": macAddress,
        "only": id,
        "storeId": "123",
        "templets": [
            {
                "demoId": "164cb6d35ac8407484bb88c8b0bdcf1c",
                "demoName": "Bulk Bins",
                "templateType": "1",
                "effect": true,
                "mac": macAddress,
                "promotionStartTime": 1619672348299,
                "promotionEndTime": 1619672348299,
                "use": false
            }
        ]
    } 
    const headers = { 
        "content-type": 'application/json',
        "Authorization": `Bearer ${token}` 
    }
    const options = { 
        method: 'POST', 
        headers, 
        body: JSON.stringify(payload) 
        // body: JSON.stringify(sample) 
    }
    const response = await fetcher.fetch(path, options)
    console.log(await response.json())
}


export default { get, post, put, bind, login }
export { bind }