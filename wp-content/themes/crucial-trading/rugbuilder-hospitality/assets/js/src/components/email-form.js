RugBuilder.prototype.emailForm = function(choices) {

	const R = rugBuilder;

	const EmailForm = React.createClass({

		submit: function() {

			const EMAIL = document.querySelector('#hosp_builder_email-submit').value;

			let req = new XMLHttpRequest();

			req.addEventListener('load', callback);

			req.open('POST', `${siteurl}/crucial-trading/hospitality-builder`);
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
