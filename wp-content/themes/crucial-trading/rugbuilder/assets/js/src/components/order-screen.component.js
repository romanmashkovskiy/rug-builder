RugBuilder.prototype.orderScreenComponent = function() {

	const R = rugBuilder;

	const OrderScreenComponent = React.createClass({

		getInitialState: function() {
			
			const CENTER_MATERIAL        = R.centerMaterial;
			const BORDER_TYPE            = R.borderType;
			const SINGLE_BORDER_MATERIAL = BORDER_TYPE === 'single' || BORDER_TYPE === 'piping' ? R.borderMaterials[BORDER_TYPE] : false;
			const INNER_BORDER_MATERIAL  = BORDER_TYPE === 'double' ? R.borderMaterials.double.inner : false;
			const OUTER_BORDER_MATERIAL  = BORDER_TYPE === 'double' ? R.borderMaterials.double.outer : false;
			const LENGTH                 = R.length;
			const WIDTH                  = R.width;
			const PRICE                  = R.price;

			const CAMERA_POS = R.camera.position;
			const CAMERA_ROT = R.camera.rotation;

			let obj = {
				centerMaterial       : CENTER_MATERIAL,
				borderType           : BORDER_TYPE,
				singleBorderMaterial : SINGLE_BORDER_MATERIAL,
				innerBorderMaterial  : INNER_BORDER_MATERIAL,
				outerBorderMaterial  : OUTER_BORDER_MATERIAL,
				length               : LENGTH,
				width                : WIDTH,
				price                : PRICE,
				cameraPosition       : CAMERA_POS,
				cameraRotation       : CAMERA_ROT
			};

			return obj;
		},

		edit: function() {

			R.camera.position.x = this.state.cameraPosition.x;
			R.camera.position.y = this.state.cameraPosition.y;
			R.camera.position.z = this.state.cameraPosition.z;
			R.camera.rotation.x = this.state.cameraRotation.x;
			R.camera.rotation.y = this.state.cameraRotation.y;
			R.camera.rotation.z = this.state.cameraRotation.z;

			R.updateStage(4);

			// ¯\_(ツ)_/¯

			ReactDOM.unmountComponentAtNode(document.querySelector( '#order-screen' ));
		},

		print: function() {

		},

		order: function() {

		},

		basket: function() {

		},

		render: function() {

			let materialObj = {};

			materialObj['Center'] = this.state.centerMaterial;

			if ( this.state.borderType === 'single' || this.state.borderType === 'piping' ) {
				materialObj['Border'] = this.state.singleBorderMaterial;
			}
			else if ( this.state.borderType === 'double' ) {
				materialObj['Inner Border'] = this.state.innerBorderMaterial;
				materialObj['Outer Border'] = this.state.outerBorderMaterial;
			}

			let detailsHTML = () => {
				return Object.keys(materialObj).map((key, index) => {
					return <div className="details__row clearfix" key={ index }>
						<p>{ materialObj[key] }</p>
						<p>{ key }</p>
					</div>
				});
			};

			const CANVAS_SRC = document.querySelector('canvas').toDataURL();

			return (
				<div className="order">
					<h2 className="order__title">Order Rug</h2>
					<span className="order__underline"></span>
					<div className="order__content clearfix">
						<div className="order__image">
							<img src={ CANVAS_SRC } alt="Your Rug" />
						</div>
						<div className="order__details">
							<div className="details__row header clearfix">
								<h3>Material</h3>
								<h3>Section</h3>
							</div>
							{ detailsHTML() }
							<div className="details__row header sizing clearfix">
								<h3>Sizing</h3>
								<h3>Price</h3>
							</div>
							<div className="details__row clearfix">
								<p>{ this.state.length }m x { this.state.width }m</p>
								<p>£{ this.state.price }</p>
							</div>
						</div>
					</div>
					<div className="order__links">
						<a href="#" className="link__edit" onClick={ this.edit }>Edit Rug</a>
						<a href="#" className="link__print" onClick={ this.print }>Print Details</a>
						<a href="#" className="link__order" onClick={ this.order }>Order Samples</a>
						<a href="#" className="link__basket" onClick={ this.basket }>Add to Basket</a>
					</div>
				</div>
			);
		}
	});

	ReactDOM.render( <OrderScreenComponent />, document.querySelector( '#order-screen' ) );
}