RugBuilder.prototype.structureItemComponent = function() {
	const R = rugBuilder;
	const RS = ReduxStore;
	const storeActions = ReduxStore.actions;
	// const storeService = R.storeServices;

	class StructureItem extends React.Component {
		constructor(props) {
		  super();
		}

		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			// R.imageChoiceComponent(this.props.code, this.props.img);

			const newImage = {
				stageIndex: 0,
				src: this.props.jpg,
				img: this.props.img,
				jpg: '',
				alt: this.props.code
			};

			this.props.selectNewImage(newImage);
			this.props.updateStructure(this.props.code);

			// const RS = new ReduxStore();

			// RS.store.dispatch(
			// 	RS.getMutateSelectedStructureAction(newImage)
			// );

			R.updateCanvasImageService(newImage);
			// RS.dispatchAction(newImage);
			// console.log(RS.getState());
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
