RugBuilder.prototype.btnStageComponent = function() {

	const R = rugBuilder;

	const BtnStageComponent = React.createClass({

		getInitialState: function() {
			// Set initial state
			return { marginLeft : 0 }
		},

		componentWillMount: function() {
			// Calculate Margins
			this.calcMargin();
			window.addEventListener( 'resize', this.calcMargin );
		},

		handleClick: function() {

			// Get the current stage and the stage the user wants to go to

			const CURRENT_STAGE = R.currentStage;
			const STAGE_CLICKED = this.props.index;

			// If the user has clicked on the stage they're already just ignore it and return

			if ( CURRENT_STAGE === STAGE_CLICKED ) {
				return;
			}

			// Call relevent stage function based on what user has clicked and their current stage

			if ( CURRENT_STAGE + 1 === STAGE_CLICKED ) {
				R.nextStage();
			}
			else if ( CURRENT_STAGE - 1 === STAGE_CLICKED ) {
				R.prevStage();
			}
			else {
				R.updateStage(STAGE_CLICKED);
			}

			return;
		},

		calcMargin: function() {

			// If not the first stage, if < 768px calculate a margin-left
			// to apply to the first stage button to move the scroller along

			if ( this.props.index > 0 ) {
				return;
			}

			const WINDOW_WIDTH  = window.innerWidth;
			const CURRENT_STAGE = R.currentStage;

			if ( WINDOW_WIDTH > 768 || CURRENT_STAGE === 0 ) {
				this.setState({ marginLeft: 0 });
				return;
			}

			const ELEM_WIDTH   = WINDOW_WIDTH * 5 * 0.16;
			const TOTAL_MARGIN = WINDOW_WIDTH - ELEM_WIDTH;
			const HALF_MARGIN  = TOTAL_MARGIN / 2;
			const MARGIN       = (ELEM_WIDTH * CURRENT_STAGE) - HALF_MARGIN;

			const CSS_MARGIN = '-' + MARGIN + 'px';

			this.setState({ marginLeft: CSS_MARGIN });
		},

		render: function() {

			// Get current stage

			const CURRENT_STAGE = R.currentStage;

			// Determine whether to give 'active', 'prev', or 'next' class

			let stageClass = '';

			if ( this.props.index === CURRENT_STAGE ) {
				stageClass = 'active';
			}
			else if ( this.props.index > CURRENT_STAGE ) {
				stageClass = 'next';
			}
			else {
				stageClass = 'prev';
			}

			// If not the first stage, add margin left to first item to move scroller along

			let style = { marginLeft : this.state.marginLeft };

			const CLASSES = 'progress-menu__stage ' + stageClass;

			return (
				<li className={ CLASSES } style={ style }>
					<a href="#" className="progress-menu__stage__link" onClick={ this.handleClick }>
						{ this.props.stage }
					</a>
				</li>
			);
		}
	});

	return BtnStageComponent;
}