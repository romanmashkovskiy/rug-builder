RugBuilder.prototype.AppComponent = function () {
  const Router = window.ReactRouterDOM.BrowserRouter;
  const Route = window.ReactRouterDOM.Route;
  const Switch = window.ReactRouterDOM.Switch;
  const Provider = window.ReactRedux.Provider;

  const R = rugBuilder;
  const RS = ReduxStore;
  const store = RS.store;

  const hospitalityBuilder = R.HospitalityBuilderComponent();
  const summary = R.summaryComponent();


  const App = () => (
    <Router>
      <div>
        <Switch>
          <Route

            path="/crucial-trading/hospitality-builder/"
            component={hospitalityBuilder}
          />

          <Route
            path="/crucial-trading/hospitality-builder/summary"
            component={summary}
          />
        </Switch>
      </div>
    </Router>
  )

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
