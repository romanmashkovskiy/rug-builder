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

			// store.subscribe(this.handleReduxStoreChange)
		}

		/**
		 *
		 */
		// reduxStructureSelected = (index) => {
		// 	console.log('redux, structure selected')
		// 	console.log(index)
		//
		// 	R.stageVisited[index] = true
		// 	R.colorStage = index
		//
		// 	PubSub.publish('newStage', index);
		// 	this.props.handleCurrentStage(index);
		// }

		/**
		 *
		 */
		// handleReduxStoreChange = () => {
		// 	if (!store.getState().tourStage[0]) { return }
		//
		// 	const tourStage = store.getState().tourStage[0].tourStage
		//
		// 	if (tourStage === 2 && !this.state.tourStep) {
		// 		this.tourStep()
		// 	}
		//
		// 	if (tourStage === 3 && !this.state.tourStep3) {
		// 		this.tourStep3()
		// 	}
		// }

		/**
		 *
		 */
		// tourStep = () => {
		// 	if (this.props.index !== 1) { return }
		//
		// 	this.setState({tourStep: true})
		//
		// 	R.stageVisited[1] = true;
		// 	R.colorStage = 1
		//
		// 	PubSub.publish( 'newStage', 1);
		// 	this.props.handleCurrentStage(1);
		// }

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

			this.props.highlightCanvasImageOnHover(this.props.index);
		}

		/**
		 *
		 */
		mouseLeave = () => {
			if (this.props.disableLinkHover) { return; }

			this.props.removeHighlightOnCanvasImage();
		}



		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			if (this.props.disableLinkHover) { return; }

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
