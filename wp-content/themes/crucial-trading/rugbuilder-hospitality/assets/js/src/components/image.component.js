RugBuilder.prototype.imageComponent = function(alt, src, jpg) {

	const R = rugBuilder;

	const ImageComponent = React.createClass({

		componentDidMount: function() {
			R.hideLittleLoader();
		},

		render: function() {

			let error = function(e) {
				e.target.src = jpg;
			}

			return (
				<img src={ src } alt={ alt } onError={ error } />
			);
		}
	});

	let selector = '#color-' + R.colorStage;

	ReactDOM.render( <ImageComponent />, document.querySelector(selector) );
}