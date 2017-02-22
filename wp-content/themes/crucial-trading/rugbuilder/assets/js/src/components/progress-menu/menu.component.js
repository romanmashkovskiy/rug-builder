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
			
			if ( border === 'single' ) {
				this.setState({ stages : [ 'Center', 'Border Type', 'Border', 'Rug Size' ] });
			}
			else if ( border === 'piping' ) {
				this.setState({ stages : [ 'Center', 'Border Type', 'Border', 'Piping', 'Rug Size' ] });
			}
			else if ( border === 'double' ) {
				this.setState({ stages : [ 'Center', 'Border Type', 'Inner Border', 'Outer Border', 'Rug Size' ] });
			}
		},

		displayIsRetina: function() {

			if ( window.devicePixelRatio > 1 ) {
				return true;
			}

			var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
				(min--moz-device-pixel-ratio: 1.5),\
				(-o-min-device-pixel-ratio: 3/2),\
				(min-resolution: 1.5dppx)";
			
			if ( window.matchMedia && window.matchMedia(mediaQuery).matches ) {
				return true;
			}

			return false;

		},

		render: function() {

			const STAGES      = this.state.stages;
			const STAGES_HTML = STAGES.map((stage, index) => {
				return React.createElement(BtnStageComponent, { stage: stage, key: index, index: index });
			});

			let logo;

			if ( this.displayIsRetina() ) {
				logo = templateDirectoryUri + '/rugbuilder/assets/img/logo@2x.png';
			} else {
				logo = templateDirectoryUri + '/rugbuilder/assets/img/logo.png';
			}

			return (
				<div className="progress-menu__container">
					<div className="progress-menu__top">
						<img src={ logo } alt="Crucial Trading Rug Builder" className="logo" />
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