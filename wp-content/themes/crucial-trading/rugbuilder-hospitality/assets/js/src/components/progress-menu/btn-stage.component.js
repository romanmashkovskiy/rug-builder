RugBuilder.prototype.btnStageComponent = function() {

	const R = rugBuilder;

	const BtnStageComponent = React.createClass({

		handleClick: function() {

			const CURRENT_STAGE = R.colorStage;
			const STAGE_CLICKED = this.props.index;

			if ( CURRENT_STAGE + 1 === STAGE_CLICKED ) {
				R.colorStage = R.colorStage + 1;
			}
			else if ( CURRENT_STAGE - 1 === STAGE_CLICKED ) {
				R.colorStage = R.colorStage - 1;
			}
			else {

				let stageValid = false;

				if ( R.stageVisited[STAGE_CLICKED] ) {
					stageValid = true;
				}
				else if ( R.stageVisited[STAGE_CLICKED - 1] ) {
					stageValid = true;
				}

				if ( !stageValid ) {
					return;
				}

				R.colorStage = STAGE_CLICKED;
			}

			R.stageVisited[STAGE_CLICKED] = true;

			PubSub.publish( 'newStage', STAGE_CLICKED );

			return;
		},

		render: function() {

			const CURRENT_STAGE = R.colorStage;

			let stageClass = '';

			if ( this.props.index === CURRENT_STAGE ) {
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