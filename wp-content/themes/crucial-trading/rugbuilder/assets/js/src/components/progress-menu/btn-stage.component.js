RugBuilder.prototype.btnStageComponent = function() {

	const R = rugBuilder;

	const BtnStageComponent = React.createClass({

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

		render: function() {
			return (
				<li className="progress-menu__stage">
					<a href="#" className="progress-menu__stage__link" onClick={ this.handleClick }>
						{ this.props.stage }
					</a>
				</li>
			);
		}
	});

	return BtnStageComponent;
}