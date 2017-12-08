RugBuilder.prototype.imageChoiceComponent = function(alt, src) {

	const R = rugBuilder;

	const ImageChoiceComponent = React.createClass({

		render: function() {
			let text;

			if ( R.colorStage === 0 ) {
				text = 'Structure: ' + alt;
			} else {
				text = 'Colour ' + R.colorStage + ': ' + alt;
			}

			return (
				<div className="choice-item">
					<div className="choice-item__left-side">
						<img src={ src } alt={ alt } />
					</div>

					<div className="choice-item__right-side">
						<p>{ text }</p>
					</div>
				</div>
			);
		}
	});

	let selector = '#hosp_builder_choice-' + R.colorStage;

	ReactDOM.render( <ImageChoiceComponent />, document.querySelector(selector) );
}
