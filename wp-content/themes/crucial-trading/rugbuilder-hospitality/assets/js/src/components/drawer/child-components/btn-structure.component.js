RugBuilder.prototype.structureItemComponent = function() {
	const R = rugBuilder;
	const RS = ReduxStore;
  const store = RS.store;
	// const storeService = R.storeServices;


	class StructureItem extends React.Component {
		constructor(props) {
		  super();

			this.state = {
				tourStep: false,
				tourStageOneComplete: false
			}
		}

		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			if (this.props.disableButtons) {
				throw Error('cant select in tour mode')
			}

			const newImage = {
				stageIndex: 0,
				src: this.props.jpg,
				img: this.props.img,
				jpg: '',
				alt: this.props.code,
				selected: true
			};

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
