RugBuilder.prototype.menuComponent = function(BtnExitComponent, BtnRestartComponent, BtnStageComponent) {

	const MenuComponent = React.createClass({

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'stageChange', this.stageHasChanged );
		},

		stageHasChanged: function() {
			this.forceUpdate();
		},

		render: function() {

			const STAGES      = [ 'Center', 'Border Type', 'Inner Border', 'Outer Border', 'Rug Size' ];
			const STAGES_HTML = STAGES.map((stage, index) => {
				return React.createElement(BtnStageComponent, { stage: stage, key: index, index: index });
			});

			return (
				<div className="progress-menu__container">
					<div className="progress-menu__top">
						<img src="assets/logo.png" alt="Crucial Trading Rug Builder" />
						<BtnRestartComponent />
						<BtnExitComponent />
					</div>
					<div className="progress-menu__bottom">
						<ul className="progress-menu__stages">
							{ STAGES_HTML }
						</ul>
					</div>
				</div>
			);
		}
	});

	ReactDOM.render( <MenuComponent />, document.querySelector( '#progress-menu' ) );
}