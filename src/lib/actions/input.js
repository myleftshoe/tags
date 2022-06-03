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


export function preventScroll(node, scrollContainer = document.body) {

    if (!scrollContainer) {
        throw new Error('scrollContainer is required')
    }

    function handleFocus(e) {
        e.preventDefault() 
        // preventScroll doesn't work on all browsers -> 
        // save scroll pos before focus and restore after
        const { scrollX, scrollY } = scrollContainer
        e.target.focus({ preventScroll: true })
        scrollContainer.scrollTo(scrollX, scrollY)
    }

    node.addEventListener('focus', handleFocus);

    return {
        destroy() {
            node.removeEventListener('focus', handleFocus);
        }
    }

}

// COMPATIBILITY FIX: Chrome on android doesn't honor maxlength. 
// Still doesn't work when input value starts empty, i.e. when placeholder is shown
export function enforceMaxlength(node, length = 0) {

    function handleKeypress(e) {
        const { value, maxlength } = e.target
        const limit = parseInt(length || maxlength)
        if (value.length > limit) {
            e.preventDefault()
        }
    }

    node.addEventListener('keypress', handleKeypress)

    return {
        destroy() {
            node.removeEventListener('input', handleKeypress)
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