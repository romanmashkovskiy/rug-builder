RugBuilder.prototype.imageComponent = function(alt, src) {

	const R = rugBuilder;

	const ImageComponent = React.createClass({

		componentDidMount: function() {
			R.hideLittleLoader();
		},

		render: function() {

			return (
				<img src={ src } alt={ alt } />
			);
		}
	});

	let selector = '#color-' + R.colorStage;

	ReactDOM.render( <ImageComponent />, document.querySelector(selector) );
}