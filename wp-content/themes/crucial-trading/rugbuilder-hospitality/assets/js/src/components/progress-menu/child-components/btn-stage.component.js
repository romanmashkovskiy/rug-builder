RugBuilder.prototype.btnStageComponent = function() {
	const R = rugBuilder;
	const RS = ReduxStore;
	const store = RS.store;

	class BtnStageComponent extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				currentStage: R.colorStage,
				tourStep: false,
				tourStep3: false
			}
		}


		/**
		 *
		 */
		tourStep3 = () => {
			if (this.props.index !== 1) { return }

			this.setState({tourStep3: true})
			this.props.highlightCanvasImageOnHover(this.props.index)
		}

		/**
		 *
		 */
		mouseEnter = () => {
			if (this.props.disableLinkHover) { return; }

			if (this.props.disableButtons) { return; }

			this.props.highlightCanvasImageOnHover(this.props.index);
		}

		/**
		 *
		 */
		mouseLeave = () => {
			if (this.props.disableLinkHover) { return; }

			if (this.props.disableButtons) { return; }

			this.props.removeHighlightOnCanvasImage();
		}



		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			if (this.props.disableLinkHover) { return; }

			if (this.props.disableButtons) {
				throw Error('cant select stage in tour mode')
			}

			R.stageVisited[this.props.index] = true;
			R.colorStage = this.props.index;

			PubSub.publish( 'newStage', this.props.index );
			this.props.handleCurrentStage(this.props.index);
		}



		render() {
			/* stage selected if current stage found in selected canvas images */
			var stageSelected = false

			if (this.props.selectedCanvasImages) {
				stageSelected = this.props.selectedCanvasImages[this.props.index] ?
						this.props.selectedCanvasImages[this.props.index].selected
						:
						false;
			}

			return (
				<li className={
						"progress-menu__item " +
						(stageSelected ? 'selected' : '')
					}

					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
				>
					<a href="#" onClick={(e) => this.handleClick(e)}
						id={"progressMenuLink" + this.props.index}

						className={
							"progress-menu__item__link " +
							(stageSelected ? 'selected' : '')
						}
					>
						{ this.props.stage }
					</a>

					{this.props.index === this.props.currentStage &&
					!this.props.disableLinkHover &&
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
