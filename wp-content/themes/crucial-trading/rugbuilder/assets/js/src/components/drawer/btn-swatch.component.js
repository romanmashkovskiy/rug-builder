RugBuilder.prototype.btnSwatchComponent = function() {

	const BtnSwatchComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatchesSelected', chosenCollection: the swatch clicked on }
			this.props.updateContent('swatchesSelected');
			this.props.onUpdate(this.props.swatch, this.props.thumb, this.props.id, this.props.maps);
		},

		render: function() {

			let classes = '';

			if ( this.props.selected === this.props.swatch ) {
				classes = 'selected';
			}

			classes += 'page-' + this.props.page;

			if ( this.props.page === this.props.pageInView - 1 ) {
				classes += ' left-of-window';
			}
			else if ( this.props.page === this.props.pageInView + 1 ) {
				classes += ' right-of-window';
			}
			else if ( this.props.page === this.props.pageInView ) {
				classes += ' in-window';
			}
			else {
				classes += ' hidden';
			}

			let src = '';

			Object.keys(this.props.thumb).map((key) => {
				src = this.props.thumb[key]['url'];
			});
			
			return (
				<li className={ classes } >
					<a href="#" onClick={ this.handleClick }>
						<img src={ src } alt={ this.props.swatch } />
						<h3>{ this.props.code }</h3>
					</a>
				</li>
			);
		}
	});

	return BtnSwatchComponent;
}