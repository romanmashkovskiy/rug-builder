export default class ForgotPasswordApi {
    static ForgotPassword(email) {
        const form = new FormData();
        form.append("email", email);

        return fetch(process.env.REACT_APP_FORGOT_PASSWORD_ROOT, {method: 'POST', body: form})
            .then(response => {
                if (response) {
                    return response.json();
                } else {
                    throw new Error('incorrect login or password!');
                }
            })
    }
}