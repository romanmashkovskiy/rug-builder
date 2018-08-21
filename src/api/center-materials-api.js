export default class CenterMaterialsApi {
    static getMaterials(url) {
        return fetch(`${process.env.REACT_APP_API_ROOT}/${url}`)
            .then(response => {
                return response.json();
            }).catch(error => {
                console.log(error);
                return error;
            });
    }
}