const translations = {
    '已绑定': 'bound',
    '未绑定': 'unbound',
}

export default function translate(value) {
    return translations[value] || value;
}