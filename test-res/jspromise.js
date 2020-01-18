exports = module.exports = () => {
    return new Promise((resolve, reject) => {
        resolve({
            imports: [],
            ns: "",
            $: {
                promise: 'resolved'
            }
        });
    })
}
