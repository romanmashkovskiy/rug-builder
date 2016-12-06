RugBuilder.prototype.viewControls = function() {

	const R = rugBuilder;

	const ViewControlsComponent = React.createClass({

		getInitialState: function() {

			// Set initial view state: 0 = above vertical, 1 = above horizontal, 2 = angled, 3 = angled-horizontal

			return {
				view: 0
			};
		},

		iconURLS: [
			templateDirectoryUri + '/rugbuilder/assets/icons/above-horizontal.svg',
			templateDirectoryUri + '/rugbuilder/assets/icons/angled.svg',
			templateDirectoryUri + '/rugbuilder/assets/icons/angled-horizontal.svg',
			templateDirectoryUri + '/rugbuilder/assets/icons/above-vertical.svg'
		],

		changeView: function() {
			const NEW_VIEW = R.changeView(this.state.view);
			this.setState({ view : NEW_VIEW });
		},

		zoomIn: function() {
			R.zoomIn(this.state.view);
		},

		zoomOut: function() {
			R.zoomOut(this.state.view);
		},

		render: function() {

			const ICON_URL = this.iconURLS[this.state.view];
			const ZOOM_IN  = templateDirectoryUri + '/rugbuilder/assets/icons/zoom-in.svg';
			const ZOOM_OUT = templateDirectoryUri + '/rugbuilder/assets/icons/zoom-out.svg';
			const CLASS    = 'view' + this.state.view;

			return (
				<div className="controls__container">
					<div className="control">
						<a className="control__link" onClick={ this.changeView }>
							<img src={ ICON_URL } alt="Change View" className={ CLASS } />
						</a>
					</div>
					<div className="control">
						<a className="control__link" onClick={ this.zoomIn }>
							<img src={ ZOOM_IN } alt="Zoom In" className="zoom" />
						</a>
					</div>
					<div className="control">
						<a className="control__link" onClick={ this.zoomOut }>
							<img src={ ZOOM_OUT } alt="Zoom Out" className="zoom" />
						</a>
					</div>
				</div>
			);
		}
	});

	ReactDOM.render( <ViewControlsComponent />, document.querySelector( '#view-controls' ) );
}