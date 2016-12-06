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

		print: function() {
			window.print();
		},

		render: function() {

			return (
				<div className="submit">
					<h3>Your Rug</h3>
					<a href="mailto:abc@123.xyz" className="email">Email</a>
					<a href="#" onclick={ this.print } className="print">Print</a>
				</div>
			);
		}
	});

	ReactDOM.render( <SubmitScreenComponent />, document.querySelector( '#submit-screen' ) );
}