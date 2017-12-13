RugBuilder.prototype.summaryComponent = function() {
  const store = ReduxStore.store;
  const SummaryView = rugBuilder.summaryViewComponent();


  class Summary extends React.Component {
    constructor() {
      super();

      console.log('summary component');

      // this.state = {
      //   storeCanvasImages: store.getState().canvasImages
      // }
    }

    render() {
      return <SummaryView />
    }
  }

  return Summary;
}
