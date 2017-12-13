// RugBuilder.prototype.btnSubmitComponent = function() {
//
// 	const R = rugBuilder;
//
// 	class SubmitChoices extends React.Component {
// 		constructor(props) {
// 			super(props);
// 		}
// 		submit (e) {
// 			e.preventDefault();
//
// 			PubSub.publish('submit', true);
// 			R.submitScreenComponent();
//
// 			this.props.history.push('/summary');
// 		}
//
// 		render: function() {
// 			if ( !R.showSubmit ) {
// 				return <span></span>;
// 			} else {
//
// 				const SRC = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110133914/restart.svg';
//
// 				return (
// 					<a href="#" className="hosp_builder_progress-menu__submit nav-upper-link" onClick={ this.submit }>
// 						<img src={ SRC } />
// 						Submit
// 					</a>
// 				);
// 			}
// 		}
// 	}
//
// 	return SubmitChoices;
// }
