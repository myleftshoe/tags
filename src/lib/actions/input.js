export function uppercase(node, apply = true) {

    if (!apply) return

    function handleBlur() {
        node.value = node.value.toUpperCase();
    }

    node.style.textTransform = 'uppercase'
    node.addEventListener('blur', handleBlur)

    return {
        destroy() {
            node.removeEventListener('blur', handleBlur)
        }
    }
}

export function clearOnFocus(node) {

    let changed = false
    let initialValue = ''

    function handleFocus(e) {
        if (!changed) {
            initialValue = e.target.value
            e.target.placeholder = initialValue
            e.target.value = ''
        }
        changed = true
    }

    function handleBlur(e) {
        const value = e.target.value.trim()
        if (value === '') {
            e.target.value = initialValue
        }
        else {
            e.target.value = value
        }
        initialValue = ''
        changed = false
    }

    node.addEventListener('focus', handleFocus);
    node.addEventListener('blur', handleBlur)

    return {
        destroy() {
            node.removeEventListener('focus', handleFocus);
            node.removeEventListener('blur', handleBlur)
        }
    }
}