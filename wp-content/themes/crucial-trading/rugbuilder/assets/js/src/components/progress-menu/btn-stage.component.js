RugBuilder.prototype.btnStageComponent = function() {

	const R = rugBuilder;

	const BtnStageComponent = React.createClass({

		handleClick: function() {
			// Get the current stage and the stage the user wants to go to

			const CURRENT_STAGE = R.currentStage;
			const STAGE_CLICKED = this.props.index;

			// If the user has clicked on the stage they're already reset

			if ( CURRENT_STAGE === STAGE_CLICKED ) {
				R.updateStage(STAGE_CLICKED);
				return;
			}

			// If the user has a single border rug and clicks from 'border' to 'rug size',
			// instead of going to STAGE_CLICKED, go to stage 4, as that is the size stage
			// and STAGE_CLICKED will have a value of 3, which is the outer border stage,
			// which is not used on single border rugs. Then return.

			if ( R.borderType === 'single' && CURRENT_STAGE === 2 && STAGE_CLICKED === 3 ) {
				R.updateStage(4);
				return;
			}

			// Otherwise, call relevent stage function based on what user has clicked and their current stage

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

		render: function() {

			const CURRENT_STAGE = R.currentStage;

			let stageClass = '';

			if ( ( this.props.index === CURRENT_STAGE ) || ( R.borderType === 'single' && this.props.index === 3 && CURRENT_STAGE === 4 ) ) {
				stageClass = 'active';
			}

			let classes = 'progress-menu__stage ' + stageClass;

			return (
				<li className={ classes }>
					<a href="#" className="progress-menu__stage__link" onClick={ this.handleClick }>
						{ this.props.stage }
					</a>
				</li>
			);
		}
	});

	return BtnStageComponent;
}
