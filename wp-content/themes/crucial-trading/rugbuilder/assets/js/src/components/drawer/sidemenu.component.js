RugBuilder.prototype.sideMenuComponent = function() {

	const SideMenuComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { chosenMaterial: the material clicked on }
			this.props.onUpdate(this.props.material);

			// If the swatch has the updateContent props, then 
			// the user is currently in the swatches view
			// On click, update the drawer's state to:
			// { content: 'collections' }
			if ( this.props.updateContent ) {
				this.props.updateContent('collections');
			}
		},

		render: function() {
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>{ this.props.material }</a>
				</li>
			);
		}
	});

	return SideMenuComponent;
}