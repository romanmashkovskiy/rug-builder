RugBuilder.prototype.btnExitComponent = function() {

	const BtnExitComponent = React.createClass({

		render: function() {

			const SRC = templateDirectoryUri + '/rugbuilder/assets/icons/exit.svg';
			const URL = siteUrl + '/start-rugbuilder';
			
			return (
				<a href={ URL } className="progress-menu__exit">
					<img src={ SRC } />
					Exit
				</a>
			);
		}
	});

	return BtnExitComponent;
}