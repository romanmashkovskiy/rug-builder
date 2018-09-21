import * as axios from "axios";

export default class OrderSamplesApi {
    static OrderSamples(
        user_id,
        product_id,
        first_name,
        last_name,
        email,
        address_1,
        address_2,
        postcode,
        city
    ) {
        const form = new FormData();
        form.append("user_id", user_id);
        form.append("product_id", product_id);
        form.append("first_name", first_name);
        form.append("last_name", last_name);
        form.append("email", email);
        form.append("address_1", address_1);
        form.append("address_2", address_2);
        form.append("postcode", postcode);
        form.append("city", city);
        form.append("client_token", '2J2fltPtbRZfN5DkPVxEEp2B');

        // return axios({
        //     method: 'POST',
        //     url: process.env.REACT_APP_ORDER_SAMPLES,
        //     data: form
        // })
        //     .then(response => {
        //         return response.data;
        //     })

        return axios({method: 'POST', data: form, url: process.env.REACT_APP_ORDER_SAMPLES})
            .then(response => {
                return new Promise((resolve, reject) => {
                    if (response.data.status === 'success') {
                        resolve(response.data);
                    } else {
                        reject('order samples failed');
                    }
                })
            })
    }
}