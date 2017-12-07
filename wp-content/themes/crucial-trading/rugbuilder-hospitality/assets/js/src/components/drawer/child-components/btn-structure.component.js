RugBuilder.prototype.btnStructureComponent = function() {
	const R = rugBuilder;

	class BtnStructureComponent extends React.Component {
		constructor(props) {
		  super();
		}

		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			R.imageComponent(this.props.code, this.props.jpg);
			R.imageChoiceComponent(this.props.code, this.props.img);

			this.props.updateStructure(this.props.code);
		}

		render() {
			return (
				<li class="structure-item">
					<a href="#" onClick={this.handleClick}>
						<h3>{this.props.code}</h3>
						<img src={this.props.img} alt={this.props.code} />
					</a>
				</li>
			);
		}
	}

	return BtnStructureComponent;
}
