module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    plugins: [require("@tailwindcss/typography"), require('daisyui')],
    daisyui: {
        styled: true,
        themes: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: '',
        darkTheme: 'dark',
        themes: [ 'dark', 'light' ],
    },
    theme: {
        extend: {
          gridTemplateColumns: {
            'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
            'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
          },
          gridTemplateRows: {
            'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
            'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
          },
        },
    },    
};
