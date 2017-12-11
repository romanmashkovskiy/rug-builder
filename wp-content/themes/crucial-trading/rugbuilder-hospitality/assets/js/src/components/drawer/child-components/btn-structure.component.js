RugBuilder.prototype.structureItemComponent = function() {
	const R = rugBuilder;

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
				src: this.props.jpg,
				img: this.props.img,
				jpg: '',
				alt: this.props.code
			};

			this.props.selectNewImage(newImage);
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
