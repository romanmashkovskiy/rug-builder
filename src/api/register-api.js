import axios from 'axios';

export default class RegisterApi {
    static RegisterUser(email, password, first_name, last_name, address_1, address_2, postcode, city) {
        const form = new FormData();
        form.append("email", email);
        form.append("password", password);
        form.append("first_name", first_name);
        form.append("last_name", last_name);
        form.append("address_1", address_1);
        form.append("address_2", address_2);
        form.append("postcode", postcode);
        form.append("city", city);

        return axios({method: 'POST', data: form, url: process.env.REACT_APP_REGISTER_ROOT})
            .then(response => {
                    return new Promise((resolve, reject) => {
                        if (typeof response.data.user_id === 'number') {
                            resolve(response.data);
                        } else {
                            reject('registration failed');
                        }
                    })
                }
            )
    }
}