RugBuilder.prototype.btnStageComponent = function() {
	const R = rugBuilder;

	class BtnStageComponent extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				currentStage: R.colorStage
			}
		}

		handleClick = (e) => {
			e.preventDefault();

			R.stageVisited[this.props.index] = true;
			R.colorStage = this.props.index;

			PubSub.publish( 'newStage', this.props.index );
			this.props.handleCurrentStage(this.props.index);
		}

		render() {
			return (
				<li className="progress-menu__item">
					<a href="#"
						className="progress-menu__item__link"
						onClick={(e) => this.handleClick(e)}
					>
						{ this.props.stage }
					</a>

					{this.props.index === this.props.currentStage &&
						<div className="stage-selected w3-circle">
							<i className="fa fa-chevron-up" aria-hidden="true"></i>
						</div>
					}
				</li>
		)}
	}

	return BtnStageComponent;
}
