import { AUTHCODE } from '$lib/env'
export async function post({ request }) {
    const pincode = await request.json()

    if (pincode !== AUTHCODE) {
        return {
            status: 401,
            body: {
                ok: false,
                message: 'Incorrect pincode',
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