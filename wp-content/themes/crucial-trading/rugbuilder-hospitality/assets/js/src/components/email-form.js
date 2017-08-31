RugBuilder.prototype.emailForm = function(choices) {

	const R = rugBuilder;

	const EmailForm = React.createClass({

		submit: function() {
			console.log('email form !!!!');
			const EMAIL = document.querySelector('#hosp_builder_email-submit').value;

			let req = new XMLHttpRequest();

			req.addEventListener('load', callback);

			console.log('send email request');

			// const postUrl = window.location.href;
			let apiUrl = '';

			if (window.location.hostname === 'localhost') {
				apiUrl = 'http://localhost:8888/crucial-trading/';
			} else if (window.location.hostname == 'vps.89hosting.co.uk') {
				apiUrl = 'http://vps.89hosting.co.uk/~crucialtrading/';
			} else {
				apiUrl = 'http://www.crucial-trading.com/';
			}

			apiUrl += 'wp-json/api/v1/';
			const postUrl = `${apiUrl}email-hospitality-rug-choices`;

			console.log('post url --->');
			console.log(postUrl);

			req.open('POST', postUrl);
			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.send("choices=" + JSON.stringify(choices) + "&from=" + EMAIL);

			function callback(response) {
				document.querySelector('#hosp_builder_email-response').innerText = '';

				let res = response.srcElement.responseText;
				let msg = '';

				switch ( res ) {

					case 'invalid email' :
						msg = 'Sorry, your email is invalid. Please ensure you have typed it correctly and try again.';
						break;

					case 'success' :
						msg = 'Thank you, an email detailing your selections has been received. You will hear from us shortly.';
						break;

					default :
						msg = 'Sorry, an error has occured. Please try again.';

				}

				document.querySelector('#hosp_builder_email-response').innerText = msg;

			}

		},

		render: function() {
			return (
				<div className="hosp_builder_email-form-container">
					<p id="hosp_builder_email-response"></p>
					<input type="email" placeholder="Please enter your email" id="hosp_builder_email-submit" />
					<button type="button" onClick={ this.submit }>Send</button>
				</div>
			);
		}
	});

	ReactDOM.render( <EmailForm />, document.querySelector( '#hosp_builder_email-form' ) );

}
