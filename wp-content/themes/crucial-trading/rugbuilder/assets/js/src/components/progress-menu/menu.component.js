RugBuilder.prototype.menuComponent = function(BtnExitComponent, BtnRestartComponent, BtnStageComponent) {

	const R = rugBuilder;

	const MenuComponent = React.createClass({

		getInitialState: function() {

			return {
				stages : [ 'Center', 'Border Type', 'Border', 'Rug Size' ]
			};
		},

		componentDidMount: function() {
			this.stageChange  = PubSub.subscribe( 'stageChange', this.stageHasChanged );
			this.borderChange = PubSub.subscribe( 'borderUpdate', this.borderHasChanged );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
			PubSub.unsubscribe( this.borderChange );
		},

		stageHasChanged: function() {
			this.forceUpdate();
		},

		borderHasChanged: function(border) {
			
			if ( border === 'single' || border === 'piping' ) {
				this.setState({ stages : [ 'Center', 'Border Type', 'Border', 'Rug Size' ] });
			}
			else if ( border === 'double' ) {
				this.setState({ stages : [ 'Center', 'Border Type', 'Inner Border', 'Outer Border', 'Rug Size' ] });
			}
		},

		render: function() {

			const STAGES      = this.state.stages;
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