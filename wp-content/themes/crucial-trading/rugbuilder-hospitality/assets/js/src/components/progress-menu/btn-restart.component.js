RugBuilder.prototype.btnRestartComponent = function() {

	const R = rugBuilder;

	const BtnRestartComponent = React.createClass({

		restart: function(e) {
			e.preventDefault();
			PubSub.publish( 'restart', true );
		},

		render: function() {

			if ( !R.showRestart ) {
				return <span></span>;
			} else {

				const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133914/restart.svg';

				return (
					<a href="#" className="hosp_builder_progress-menu__restart" onClick={ this.restart }>
						<img src={ SRC } />
						Start Again
					</a>
				);
			}
		}
	});

	return BtnRestartComponent;
}