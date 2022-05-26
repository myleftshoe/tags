export default class Fetcher {
    constructor(root) {
        this.root = root
    }
    async fetch(path, options) {
        // console.log(`${this.root}/${path}`)
        // console.log(options)
        return fetch(`${this.root}/${path}`, options)
    }
}
