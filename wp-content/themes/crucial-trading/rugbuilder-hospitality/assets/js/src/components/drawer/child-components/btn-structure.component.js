RugBuilder.prototype.structureItemComponent = function() {
	const R = rugBuilder;
	const RS = ReduxStore;
  const store = RS.store;
	// const storeService = R.storeServices;


	class StructureItem extends React.Component {
		constructor(props) {
			console.log('Btn stage constructor !!!!!')

		  super();

			this.state = {
				tourStep: false,
				tourStageOneComplete: false
			}

			// store.subscribe(this.handleReduxStoreChange)

		}

		componentDidMount() {
				// this.tour1 = PubSub.subscribe('tourStageOne', this.tourStepOne)
		}

		componentWillUnmount() {
			// PubSub.unsubscribe(this.tour1)
		}

		/**
		 *
		 */
		// handleReduxStoreChange = () => {
		// 	this.tourStepComplete = false
		//
		// 	if (!store.getState().tourStage[0]) { return }
		//
		// 	const tourStage = store.getState().tourStage[0].tourStage
		//
		// 	if (tourStage === 1 && !this.state.tourStep) {
		// 		this.tourStep()
		// 	}
		// }


		/**
		 *
		 */
		// tourStepOne = () => {
		// 	PubSub.unsubscribe(this.tour1)
		//
		// 	if (this.state.tourStageOneComplete) { return }
		//
		// 	console.log('<----- tour step one !! -------->')
		// 	console.log(this.state.tourStageOneComplete)
		// 	console.log('<--------------')
		//
		// 	this.setState({'tourStageOneComplete': true})
		//
		// 	console.log('double check ------->')
		// 	console.log(this.state.tourStageOneComplete)
		// 	console.log('<-----------------')
		//
		// 	const newImage = {
		// 		stageIndex: 0,
		// 		src: 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H4350/base.jpg',
		// 		img: 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H4350/base-colour.jpg',
		// 		jpg: '',
		// 		alt: 'H4350',
		// 		selected: true
		// 	};
		//
		// 	this.props.selectNewImage(newImage);
		// 	R.updateCanvasImageService(newImage);
		// 	this.props.updateStructure('H4350');
		// }


		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			const newImage = {
				stageIndex: 0,
				src: this.props.jpg,
				img: this.props.img,
				jpg: '',
				alt: this.props.code,
				selected: true
			};

			console.log('handle click')
			console.log(this.props.code)

			this.props.selectNewImage(newImage);
			R.updateCanvasImageService(newImage);
			this.props.updateStructure(this.props.code);
		}

		render() {
			return (
				<li className="structure-item">
					<a href="#" onClick={this.handleClick}>
						<h3>{this.props.code}</h3>
						<img src={this.props.img} alt={this.props.code} />
					</a>
				</li>
		)}
	}

	return StructureItem;
}
