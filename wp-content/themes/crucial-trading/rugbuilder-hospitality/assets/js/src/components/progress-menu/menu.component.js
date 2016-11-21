RugBuilder.prototype.menuComponent = function(BtnExitComponent, BtnRestartComponent, BtnStageComponent) {

	const R = rugBuilder;

	const MenuComponent = React.createClass({

		getInitialState: function() {

			return {
				stages : [ 'Structure' ]
			};
		},

		componentDidMount: function() {
			this.structureChange = PubSub.subscribe( 'newStructure', this.structureHasChanged );
			this.stageChange     = PubSub.subscribe( 'newStage', this.stageHasChanged );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.structureChange );
			PubSub.unsubscribe( this.stageChange );
		},

		structureHasChanged: function(code) {

			let colors = R.numStructureColors[code],
			    stages = [ 'Structure' ];

			for ( let i = 0; i < colors; i++ ) {
				let x = i + 1;
				stages.push('Colour ' + x);
			}

			this.setState({ stages : stages });
		},

		stageHasChanged: function(stage) {
			this.forceUpdate();
		},

		render: function() {

			const STAGES      = this.state.stages;
			const STAGES_HTML = STAGES.map((stage, index) => {
				return React.createElement(BtnStageComponent, { stage: stage, key: index, index: index });
			});

			const LOGO = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/logo.png';

			return (
				<div className="progress-menu__container">
					<div className="progress-menu__top">
						<img src={ LOGO } alt="Crucial Trading Rug Builder" />
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