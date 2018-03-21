RugBuilder.prototype.btnRestartComponent = function() {

	const R = rugBuilder;

	const BtnRestartComponent = React.createClass({

		restart: function(e) {
			e.preventDefault();


			location.reload();

			let url = window.location.href
			url = url.replace("summary", "")

			window.location.href = url
		},

		render: function() {

			if ( !R.showRestart ) {
				return <span></span>;
			} else {

				const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133914/restart.svg';

				return (
					<a id="restartBuild"
						href="#"
						className="hosp_builder_progress-menu__restart nav-upper-link"
						onClick={ this.restart }
					>
						<img src={ SRC } />
						Start Again
					</a>
				);
			}
		}
	});

	return BtnRestartComponent;
}
