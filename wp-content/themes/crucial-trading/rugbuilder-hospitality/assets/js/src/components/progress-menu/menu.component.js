RugBuilder.prototype.menuComponent = function(BtnExitComponent, BtnRestartComponent, BtnSubmitComponent, BtnStageComponent) {
	const R = rugBuilder;

	const MenuComponent = React.createClass({
		getInitialState: function() {
			return {
				stages     : [ 'Structure' ],
				showSubmit : false
			};
		},

		componentDidMount: function() {
			this.structureChange = PubSub.subscribe( 'newStructure', this.structureHasChanged );
			this.colorChange     = PubSub.subscribe( 'newColor', this.colorHasChanged );
			this.stageChange     = PubSub.subscribe( 'newStage', this.stageHasChanged );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.structureChange );
			PubSub.unsubscribe( this.colorChange );
			PubSub.unsubscribe( this.stageChange );
		},

		structureHasChanged: function(sub, code) {
			let colors = R.numStructureColors[code],
			    stages = [ 'Structure' ];

			for ( let i = 0; i < colors; i++ ) {
				let x = i + 1;
				stages.push('Colour ' + x);
			}

			this.setState({
				stages     : stages,
				showSubmit : false
			});
		},

		colorHasChanged: function() {
			if ( R.colorStage > 0 && ( R.colorStage === this.state.stages.length - 1 ) ) {
				this.setState({ showSubmit : true });
			} else if ( R.stageVisited[this.state.stages.length - 1] ) {
				this.setState({ showSubmit : true });
			} else {
				this.setState({ showSubmit : false });
			}
		},

		stageHasChanged: function(abc, stage) {
			console.log('Menu Component -> stage has changed');

			if ( stage === 0 ) {
				this.setState({
					stages     : [ 'Structure' ],
					showSubmit : false
				}, () => { this.forceUpdate() });

				return;
			}

				this.forceUpdate();
		},

		render: function() {
			const STAGES      = this.state.stages;

			const STAGES_HTML = STAGES.map((stage, index) => {
				return React.createElement(BtnStageComponent, { stage: stage, key: index, index: index });
			});

			let submitBtn;

			if ( this.state.showSubmit ) {
				submitBtn = <BtnSubmitComponent />
			} else {
				submitBtn = '';
			}

			const LOGO = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110114837/logo-1.png';

			return (
				<div className="hosp_builder_progress-menu__container">
					<div className="hosp_builder_progress-menu__top">
						<img src={ LOGO } alt="Crucial Trading Rug Builder" />
						{ submitBtn }
						<BtnRestartComponent />
						<BtnExitComponent />
					</div>
					<div className="hosp_builder_progress-menu__bottom">
						<ul className="hosp_builder_progress-menu__stages">
							{ STAGES_HTML }
						</ul>
					</div>
				</div>
			);
		}
	});

	ReactDOM.render(
		<MenuComponent />,
		document.querySelector( '#hosp_builder_progress-menu')
	);
}
