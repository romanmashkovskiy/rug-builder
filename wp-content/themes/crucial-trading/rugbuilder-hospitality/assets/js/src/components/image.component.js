RugBuilder.prototype.imageComponent = function(alt, src, jpg) {

	const R = rugBuilder;

	const ImageComponent = React.createClass({

		render: function() {

			if ( document.querySelector('#hosp_builder_img-container').classList.contains('hidden') ) {
				document.querySelector('#hosp_builder_img-container').classList.remove('hidden');
			}

			let error = function(e) {
				e.target.src = jpg;
			}

			let load = function() {
//				R.hideLittleLoader();
			}

			return (
				<img src={ src } alt={ alt } onError={ error } onLoad={ load } />
			);
		}
	});

	let selector = '#hosp_builder_color-' + R.colorStage;

	ReactDOM.render( <ImageComponent />, document.querySelector(selector) );
}