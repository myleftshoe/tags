export function uppercase(node, use = true) {

    if (!use) return

    function handleChange(e) {
        node.value = node.value.toUpperCase();
    }
    
    node.style.textTransform = 'uppercase'
    node.setAttribute('autocapitalize', 'characters')
    node.addEventListener('change', handleChange)

    return {
        destroy() {
            node.removeEventListener('change', handleChange)
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
export function maxlength(node, length = 0) {
    
    if (!length) return 

    node.size = length
    node.maxlength = length
    node.style.width = `${length}ch`
    
    function handleInput(e) {
        // e.data contains the key pressed.
        // For non-printable chars e.data is null.
        const key = e.data || ''
        const value = node.value + key
        if (value.length > length) {
            e.preventDefault()
        }
    }

    node.addEventListener('beforeinput', handleInput)

    return {
        destroy() {
            node.removeEventListener('beforeinput', handleInput)
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