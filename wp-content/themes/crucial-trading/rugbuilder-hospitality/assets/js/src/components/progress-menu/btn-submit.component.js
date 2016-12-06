RugBuilder.prototype.btnSubmitComponent = function() {

	const R = rugBuilder;

	const SubmitBtnComponent = React.createClass({
		
		submit: function() {

			document.querySelector('#img-container').style.zIndex = 11;
			document.querySelector('#choices').style.zIndex = 11;

			PubSub.publish('submit', true);
			R.submitScreenComponent();
		},

		render: function() {

			const SRC = templateDirectoryUri + '/rugbuilder/assets/icons/restart.svg';

			return (
				<a href="#" className="progress-menu__submit" onClick={ this.submit }>
					<img src={ SRC } />
					Submit
				</a>
			);
		}
	});

	return SubmitBtnComponent;
}