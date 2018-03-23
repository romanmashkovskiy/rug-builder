RugBuilder.prototype.btnColorComponent = function() {
	const R = rugBuilder;
	const RS = ReduxStore;
	const store = RS.store;


	class BtnColorComponent extends React.Component {
		constructor(props) {
			super();

			this.state = {
				tourStep:false
			}

			store.subscribe(this.handleReduxStoreChange)
		}

		/**
		 *
		 */
		handleReduxStoreChange = () => {
			this.tourStepComplete = false

			if (!store.getState().tourStage[0]) { return }

			const tourStage = store.getState().tourStage[0].tourStage
		}

		/**
		 *
		 */
		handleClick = (e) => {
			e.preventDefault();

			if (this.props.disableButtons) {
				throw Error('cant select in tour mode')
			}

			R.showLittleLoader();



			const col = 'https://d105txpzekqrfa.cloudfront.net/hospitality/colours/' +
				this.props.color + '.jpg';

			const url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' +
				this.props.structure + '/' + this.props.color + '/colour-' +
				R.colorStage + '.png';

			const jpg = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' +
				this.props.structure + '/' + this.props.color + '/colour-' +
				R.colorStage + '.jpg';


			var obj = { alt: this.props.color, src: url, jpg: jpg, img: col }

			this.props.selectNewImage(obj);

			this.props.onClick(this.props.color);

			var obj = {
				stageIndex: R.colorStage,
				alt: this.props.color,
				src: url,
				jpg: jpg,
				img: col,
				selected: true
			}

			R.updateCanvasImageService(obj);
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
