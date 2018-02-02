RugBuilder.prototype.btnColorComponent = function() {
	const R = rugBuilder;

	class BtnColorComponent extends React.Component {
		constructor(props) {
			super();
		}

		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();
			R.showLittleLoader();

			const col = 'https://d105txpzekqrfa.cloudfront.net/hospitality/colours/' +
				this.props.color + '.jpg';

			const url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' +
				this.props.structure + '/' + this.props.color + '/colour-' +
				R.colorStage + '.png';

			const jpg = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' +
				this.props.structure + '/' + this.props.color + '/colour-' +
				R.colorStage + '.jpg';

			// R.imageComponent(this.props.color, url, jpg);
			// R.imageChoiceComponent(this.props.color, col);

			this.props.selectNewImage({
				alt: this.props.color,
				src: url,
				jpg: jpg,
				img: col
			});

			this.props.onClick(this.props.color);

			R.updateCanvasImageService({
				stageIndex: R.colorStage,
				alt: this.props.color,
				src: url,
				jpg: jpg,
				img: col,
				selected: true
			});
		}

		render() {
			let url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/colours/' +
				this.props.color + '.jpg';

			return (
				<li className="color-item">
					<a href="#" onClick={ this.handleClick }>
						<h3>{ this.props.color }</h3>
						<img src={ url } alt={ this.props.color } />
					</a>
				</li>
			);
		}
	}

	return BtnColorComponent;
}
