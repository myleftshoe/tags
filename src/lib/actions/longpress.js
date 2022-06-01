export function longpress(node, ms = 150) {
    let interval

    const event = new CustomEvent('longpress')
    const dispatch = () => node.dispatchEvent(event)

    const start = (e) => {
        e.preventDefault()
        e.stopPropagation()
        interval = setInterval(dispatch, ms)
        alert('contextment', e.target)
    }

    const stop = (e) => {
        alert('pointerup' + JSON.stringify(e, null, 2))
        clearInterval(interval)
    }

    node.addEventListener('contextmenu', start);
    node.addEventListener('pointerup', stop)
    node.addEventListener('pointerleave', stop)

    return {
        destroy() {
            node.removeEventListener('contextmenu', start);
            node.removeEventListener('pointerup', stop)
            node.removeEventListener('pointerleave', stop)
        }
    }
}