RugBuilder.prototype.btnSubmitComponent = function() {

	const R = rugBuilder;

	const SubmitBtnComponent = React.createClass({
		submit: function(e) {
			e.preventDefault();

			document.querySelector('#hosp_builder_img-container').style.zIndex = 11;
			document.querySelector('#hosp_builder_choices').style.zIndex = 11;

			PubSub.publish('submit', true);
			R.submitScreenComponent();
		},

		render: function() {
			if ( !R.showSubmit ) {
				return <span></span>;
			} else {

				const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133914/restart.svg';

				return (
					<a href="#" className="hosp_builder_progress-menu__submit nav-upper-link" onClick={ this.submit }>
						<img src={ SRC } />
						Submit
					</a>
				);
			}
		}
	});

	return SubmitBtnComponent;
}
