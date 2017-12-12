RugBuilder.prototype.AppComponent = function () {
  const Router = window.ReactRouterDOM.BrowserRouter;
  const Route = window.ReactRouterDOM.Route;
  const Switch = window.ReactRouterDOM.Switch;
  const Provider = window.ReactRedux.Provider;

  const R = rugBuilder;
  const RS = ReduxStore;

  const hospitalityBuilder = R.HospitalityBuilderComponent();
  const store = RS.store;


  const App = () => (
    <Router>
      <div>
        <Switch>
          <Route path="/" component={hospitalityBuilder} />
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
