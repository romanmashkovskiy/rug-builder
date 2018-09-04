export default class LoginApi {
    static LoginUser(username, password) {
        const form = new FormData();
        form.append("username", username);
        form.append("password", password);

        return fetch(process.env.REACT_APP_LOGIN_ROOT, {method: 'POST', body: form})
            .then(response => {
                if (!response.redirected) {
                    return response.json();
                } else {
                    throw new Error('incorrect login or password!');
                }
            })
    }
}