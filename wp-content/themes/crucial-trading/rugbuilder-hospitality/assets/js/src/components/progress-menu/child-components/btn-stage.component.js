RugBuilder.prototype.btnStageComponent = function() {
	const R = rugBuilder;

	class BtnStageComponent extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				currentStage: R.colorStage
			}

			console.log('btn stage component !!');
		}

		/**
		 *
		 */
		mouseEnter = () => {
			console.log('on mouse enter !!');
			this.props.highlightCanvasImageOnHover(this.props.index);
		}

		/**
		 *
		 */
		mouseLeave = () => {
			console.log('on mouse leave !!');
			this.props.removeHighlightOnCanvasImage();
		}


		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			R.stageVisited[this.props.index] = true;
			R.colorStage = this.props.index;

			PubSub.publish( 'newStage', this.props.index );
			this.props.handleCurrentStage(this.props.index);
		}

		render() {
			/* stage selected if current stage found in selected canvas images */
			const stageSelected = this.props.selectedCanvasImages.findIndex((x) => {
				return x.stageIndex === this.props.index
			}) > -1 ? true : false;


			return (
				<li
					className="progress-menu__item"
					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
				>
					<a
						href="#"
						className={
							"progress-menu__item__link " +
							(stageSelected ? 'selected' : '')
						}

						onClick={(e) => this.handleClick(e)}
					>
						{ this.props.stage }
					</a>

					{this.props.index === this.props.currentStage &&
						<div className="stage-selected w3-circle">
							<i className="fa fa-chevron-up" aria-hidden="true"></i>
						</div>
					}

					{
						stageSelected &&
						<i className="fa fa-check" aria-hidden="true"></i>
					}
				</li>
		)}
	}

	return BtnStageComponent;
}
