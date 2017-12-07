RugBuilder.prototype.btnExitComponent = function() {
	const R = rugBuilder;

	const BtnExitComponent = React.createClass({
		render: function() {
			if ( !R.showExit ) { return null; }

			const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133952/exit.svg';
			const URL = window.location.origin;

			return (
				<a href={ URL } className="hosp_builder_progress-menu__exit nav-upper-link">
					<img src={ SRC } />
					Exit
				</a>
			);
		}
	});

	return BtnExitComponent;
}
