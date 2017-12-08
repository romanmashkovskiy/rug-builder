RugBuilder.prototype.AppComponent = function () {
  const R = rugBuilder;
  const DrawerV2 = R.drawerV2Component();
  const ProgressMenuV2 = R.progressMenuV2Component();

  class App extends React.Component {
    constructor() {
      super();
    }

    render() {
      return (
        <div id="hospitality-builder">
          <DrawerV2 />

          <div id="mainContainer">
            <ProgressMenuV2 />

            <div id="hosp_builder_img-container"></div>
          </div>
        </div>
    )}
  }

  ReactDOM.render(<App />, document.querySelector('#root'));
}
