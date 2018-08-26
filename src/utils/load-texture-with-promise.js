export const loadWithPromise = (url, textureLoader) => {
    return new Promise((resolve, reject) => {
        textureLoader.load(url,
            (texture) => {
                resolve(texture);
            },
            undefined,
            (err) => {
                reject(err);
            });
    })
};