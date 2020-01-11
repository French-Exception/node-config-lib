exports = module.exports = () => {
    return new Promise((resolve, reject) => {
        resolve({
            $: {
                promise: 'resolved'
            }
        });
    })
}
