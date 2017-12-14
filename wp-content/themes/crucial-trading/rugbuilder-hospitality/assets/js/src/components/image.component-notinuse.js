RugBuilder.prototype.imageComponent = function(alt, src, jpg) {
	const R = rugBuilder;

	class Image extends React.Component {
		constructor(props) {
			super();
		}

		render() {
			//
			// if ( document.querySelector('#hosp_builder_img-container').classList.contains('hidden') ) {
			// 	document.querySelector('#hosp_builder_img-container').classList.remove('hidden');
			// }

			return (
				<img src={ this.props.src } alt={ this.props.alt } onError={ error } onLoad={ load } />
			);
		}
	}

	// let selector = '#hosp_builder_color-' + R.colorStage;
	// ReactDOM.render( <ImageComponent />, document.querySelector(selector) );

	return ImageComponent
}
