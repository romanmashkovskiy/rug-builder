export const loadWithPromise = (url, loader) => {
    return new Promise((resolve, reject) => {
        loader.load(url,
            (result) => {
                resolve(result);
            },
            undefined,
            (err) => {
                reject(err);
            });
    })
};