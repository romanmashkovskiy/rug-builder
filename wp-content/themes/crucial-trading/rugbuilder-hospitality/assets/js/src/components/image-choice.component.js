RugBuilder.prototype.imageChoiceComponent = function(alt, src) {

	const R = rugBuilder;

	const ImageChoiceComponent = React.createClass({

		render: function() {

			let text;

			if ( R.colorStage === 0 ) {
				text = 'Pattern: ' + alt;
			} else {
				text = 'Colour ' + R.colorStage + ': ' + alt;
			}

			return (
				<span>
					<p>{ text }</p>
					<img src={ src } alt={ alt } />
				</span>
			);
		}
	});

	let selector = '#hosp_builder_choice-' + R.colorStage;

	ReactDOM.render( <ImageChoiceComponent />, document.querySelector(selector) );
}