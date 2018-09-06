import axios from 'axios';

export default class LoginApi {
    static LoginUser(username, password) {
        const form = new FormData();
        form.append("username", username);
        form.append("password", password);

        return axios({method: 'POST', data: form, url: process.env.REACT_APP_LOGIN_ROOT})
            .then(response => {
                return new Promise((resolve, reject) => {
                    if (!response.data.redirected) {
                        resolve(response.data);
                    } else {
                        reject('incorrect login or password!');
                    }
                })
            })
    }
}