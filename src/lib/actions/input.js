export function uppercase(node, use = true) {

    if (!use) return

    function handleInput() {
        node.value = node.value.toUpperCase();
    }
    
    node.style.textTransform = 'uppercase'
    node.setAttribute('autocapitalize', 'characters')
    node.addEventListener('input', handleInput)

    return {
        destroy() {
            node.removeEventListener('input', handleInput)
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


export function clearOnFocus(node, use = true) {

    if (!use) return

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