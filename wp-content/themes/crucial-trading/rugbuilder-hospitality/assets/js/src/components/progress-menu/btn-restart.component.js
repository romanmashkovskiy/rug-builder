RugBuilder.prototype.btnRestartComponent = function() {

	const R = rugBuilder;

	const BtnRestartComponent = React.createClass({

		restart: function() {
			R.updateStage(0);
			R.startAgain();
			R.updateBorder('Single & Piping');
		},

		render: function() {

			const SRC = templateDirectoryUri + '/rugbuilder/assets/icons/restart.svg';

			return (
				<a href="#" className="progress-menu__restart" onClick={ this.restart }>
					<img src={ SRC } />
					Start Again
				</a>
			);
		}
	});

	return BtnRestartComponent;
}