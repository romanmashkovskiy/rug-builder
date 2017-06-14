RugBuilder.prototype.btnRestartComponent = function() {

	const R = rugBuilder;

	const BtnRestartComponent = React.createClass({

		restart: function() {
			R.updateStage(0);
			R.startAgain();
			R.updateBorder('Single Border');
			ReactDOM.unmountComponentAtNode(document.querySelector('#order-screen'));
		},

		render: function() {

			const SRC = 'http://d105txpzekqrfa.cloudfront.net/uploads/20170110133914/restart.svg';

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