RugBuilder.prototype.imageComponent = function(alt, src, jpg) {

	const R = rugBuilder;

	const ImageComponent = React.createClass({

		render: function() {

			let error = function(e) {
				e.target.src = jpg;
			}

			let load = function() {
				R.hideLittleLoader();
			}

			return (
				<img src={ src } alt={ alt } onError={ error } onLoad={ load } />
			);
		}
	});

	let selector = '#color-' + R.colorStage;

	ReactDOM.render( <ImageComponent />, document.querySelector(selector) );
}