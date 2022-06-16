import { USERNAME, PASSWORD } from '$lib/env'
export async function post({ request }) {
    const {username, password} = await request.json()

    if (!(username === USERNAME && password === PASSWORD) ) {
        return {
            status: 401,
            body: {
                ok: false,
                message: 'Incorrect username or password',
            },
        };
    }

    return {
        status: 200,
        body: {
            ok: true,
            message: 'Successfully signed in',
        },
    };
}