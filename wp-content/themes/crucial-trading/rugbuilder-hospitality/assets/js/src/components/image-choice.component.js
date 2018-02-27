RugBuilder.prototype.imageChoiceComponent = function() {
	const R = rugBuilder;

	class ImageChoiceComponent extends React.Component {
		render() {
			const stage = this.props.stage === 0 ?
				'STRUCTURE:' : `COLOUR: ${this.props.stage}`;

			return (
				<div className="choice-item">
					<div className="choice-item__left-side">
						<img src={ this.props.src } alt={ this.props.alt } />
					</div>

					<div className="choice-item__right-side">
						<p className="stage">{ stage }</p>
						<p>{ this.props.alt }</p>
					</div>
				</div>
			);
		}
	}

	return ImageChoiceComponent;
}
