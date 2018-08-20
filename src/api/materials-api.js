export default class MaterialsApi {
    static getMaterials() {
        return fetch('http://vps.89hosting.co.uk/~crucialtrading/rugbuilder/?request=materials')
            .then(response => {
                console.log(response);
                return response.json();
            }).catch(error => {
                return error;
            });
    }
}