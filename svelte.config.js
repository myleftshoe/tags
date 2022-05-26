import adapter from '@sveltejs/adapter-auto';
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE']
		},
		vite: {
            define: {
                'process.env': process.env,
            },
        },
    },
    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],
};

export default config;
