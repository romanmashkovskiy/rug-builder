RugBuilder.prototype.btnCollectionComponent = function() {

	const BtnCollectionComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatches', chosenCollection: the collection clicked on }
			this.props.updateContent('swatches');
			this.props.onUpdate(this.props.collection.replace(/ /g, '-'));
		},

		render: function() {

			let className = 'page-' + this.props.page;

			if ( this.props.page === this.props.pageInView - 1 ) {
				className += ' left-of-window';
			}
			else if ( this.props.page === this.props.pageInView + 1 ) {
				className += ' right-of-window';
			}
			else if ( this.props.page === this.props.pageInView ) {
				className += ' in-window';
			}
			else {
				className += ' hidden';
			}
			
			return (
				<li className={ className } data-page={ this.props.page }>
					<a href="#" onClick={ this.handleClick }>
						<h3>{ this.props.title }</h3>
						<div className="swatch-img-container">
							<img src={ this.props.image } />
						</div>
					</a>
				</li>
			);
		}
	});

	return BtnCollectionComponent;
}