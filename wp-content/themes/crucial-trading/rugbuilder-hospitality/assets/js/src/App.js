RugBuilder.prototype.AppComponent = function () {
  const Router = window.ReactRouterDOM.BrowserRouter;
  const Route = window.ReactRouterDOM.Route;
  const Switch = window.ReactRouterDOM.Switch;
  const Provider = window.ReactRedux.Provider;
  // const Joyride = window.Reactjoyride;;

  const R = rugBuilder;
  const RS = ReduxStore;
  const store = RS.store;

  try {
    var hospitalityBuilder = R.HospitalityBuilderComponent();
  } catch(err) {
    console.log(err)
  }

  let baseName = '';

  if (window.location.hostname === 'localhost') {
    baseName = '/crucial-trading/hospitality-builder/'
  } else if (window.location.hostname === 'vps.89hosting.co.uk') {
    baseName = '/~crucialtrading/hospitality-builder/'
  } else {
    baseName = '/hospitality-builder/'
  }

  class App extends React.Component {
    constructor() {
      super();
    }


    render() {
      return (
        <Router basename={baseName}>
          <div>
            <Switch>
              <Route
                path="/"
                component={hospitalityBuilder}
              />
            </Switch>
          </div>
        </Router>
    )}
  }

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
