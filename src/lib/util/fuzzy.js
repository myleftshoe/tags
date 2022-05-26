const nonAlpha = /[^a-z ]/gi
const spaces = /\s+/g

function fuzzy(array, value) {
    const fuzzed = array.reduce((acc, cur) => {
        const stringified = Object.values(cur).join(' ').toUpperCase()
        if (stringified.includes(value))
            acc.push(cur)
        return acc
    }, [])
    return fuzzed
}

function fuzzy1(array, value, fields) {
    const picked = Array.isArray(fields) && array.map(pick(...fields)) || [...array]
    const fuzzed = picked.reduce((acc, cur, index) => {
        const stringified = Object.values(cur)
            .join(' ')
            .toUpperCase()
            // .replace(nonAlpha, '')
            .replace(spaces, ' ');
        if (stringified.includes(value))
            acc.push(array[index])
        return acc
    }, [])
    return fuzzed
}


const pick = (...props) => o => props.reduce((a, e) => ({ ...a, [e]: o[e] }), {});

export default fuzzy1