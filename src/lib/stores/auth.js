import { writable } from 'svelte/store'

export const loggedIn = writable(false)

export const login = async ( username, password ) => {
    console.log({username, password})
    const response = await fetch('api/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {
            'Content-Type': 'application/json'
        }        
    })
    console.log(response.status)
    const json = await response.json()
    return json.ok
}