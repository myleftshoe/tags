import { RippleStart, RippleStop } from './material-ripple';

/**
 * @param node {Element}
 */
export default (node, _options = {}) => {
    let options = _options;
    let destroyed = false;
    let ripple;
    let keyboardActive = false;
    const handleStart = (e) => {
        ripple = RippleStart(e, options);
    };
    const handleStop = () => RippleStop(ripple);
    const handleKeyboardStart = (e) => {
        if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
            ripple = RippleStart(e, { ...options, centered: true });
            keyboardActive = true;
        }
    };
    const handleKeyboardStop = () => {
        keyboardActive = false;
        handleStop();
    };

    let { position, overflow } = node.style;

    function setup() {
        ({ position, overflow } = node.style);
        node.style.position = 'relative';
        node.style.overflow = 'hidden';
        // node.classList.add('s-ripple-container');
        node.addEventListener('pointerdown', handleStart);
        node.addEventListener('pointerup', handleStop);
        node.addEventListener('pointerleave', handleStop);
        node.addEventListener('keydown', handleKeyboardStart);
        node.addEventListener('keyup', handleKeyboardStop);
        destroyed = false;
    }

    function destroy() {
        node.style.position = position;
        node.style.overflow = overflow;
        // node.classList.remove('s-ripple-container');
        node.removeEventListener('pointerdown', handleStart);
        node.removeEventListener('pointerup', handleStop);
        node.removeEventListener('pointerleave', handleStop);
        node.removeEventListener('keydown', handleKeyboardStart);
        node.removeEventListener('keyup', handleKeyboardStop);
        destroyed = true;
    }

    if (options) setup();

    return {
        update(newOptions) {
            options = newOptions;
            if (options && destroyed) setup();
            else if (!(options || destroyed)) destroy();
        },
        destroy,
    };
};
