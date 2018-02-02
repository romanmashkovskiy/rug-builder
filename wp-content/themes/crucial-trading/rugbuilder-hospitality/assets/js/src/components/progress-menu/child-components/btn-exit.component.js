RugBuilder.prototype.btnExitComponent = function() {
	const R = rugBuilder;

	class BtnExitComponent extends React.Component {
		constructor() {
			super();
		}

		render() {
			if ( !R.showExit ) { return null; }

			const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133952/exit.svg';
			const URL = window.location.origin;

			return (
				// <p>
					<a href={ URL } className="hosp_builder_progress-menu__exit nav-upper-link">
						<img src="https://d105txpzekqrfa.cloudfront.net/uploads/20170110133952/exit.svg" />
						Exit
					</a>
				// </p>
			);
		}
	}

	return BtnExitComponent;
}
