RugBuilder.prototype.btnExitComponent = function() {

	const BtnExitComponent = React.createClass({

		render: function() {

			const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133952/exit.svg';
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
