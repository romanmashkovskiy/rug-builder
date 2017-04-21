RugBuilder.prototype.submitScreenComponent = function() {
	
	const R = rugBuilder;

	const SubmitScreenComponent = React.createClass({

		getInitialState: function() {
			return {
				structure : R.choices.structure,
				colour1   : R.choices.color1,
				colour2   : R.choices.color2,
				colour3   : R.choices.color3,
				colour4   : R.choices.color4,
				colour5   : R.choices.color5,
				colour6   : R.choices.color6,
				colour7   : R.choices.color7,
				colour8   : R.choices.color8,
				colour9   : R.choices.color9
			}
		},

		email: function() {
			R.emailForm(this.state);
		},

		print: function() {
			window.print();
		},

		render: function() {

			let str = '';

			Object.keys(this.state).map((key) => {

				if ( this.state[key] !== undefined ) {
					str += key;
					str += ': ';
					str += this.state[key];
					str += ", ";
				}

			});

			const href = "mailto:abc@123.xyz?subject=New Hospitality Builder Design&body=" + str;

			return (
				<div className="hosp_builder_submit">
					<h3>Your Rug</h3>
					<a href="#" onClick={ this.email } className="hosp_builder_email">Email</a>
					<a href="#" onClick={ this.print } className="hosp_builder_print">Print</a>
				</div>
			);
		}
	});

	ReactDOM.render( <SubmitScreenComponent />, document.querySelector( '#hosp_builder_submit-screen' ) );
}