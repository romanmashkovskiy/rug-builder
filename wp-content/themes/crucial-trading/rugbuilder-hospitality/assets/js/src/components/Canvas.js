RugBuilder.prototype.canvasComponent = function () {
  const store = ReduxStore.store;

  class Canvas extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        storeCanvasImages: store.getState().canvasImages[0],
      }

      store.subscribe(this.handleReduxStoreChange)
    }

    /**
     * listen to changes in the redux store and update state to changes in store
     */
    handleReduxStoreChange = () => {
      this.setState({
        storeCanvasImages: store.getState().canvasImages[0]
      })
    }

    render() {
      return (
        <div
          id="hosp_builder_img-container"
          className={
            "canvas " +
            (this.props.fadeOtherCanvasImages ? 'fade-images' : '')
          }
        >
          {
            this.state.storeCanvasImages.map((image, index) => {
              return <img
                alt={ image.alt }
                src={ image.src }
                key={index}
                className={
                  image.stageIndex === this.state.stageInFocus ?
                    'in-focus' : 'out-focus'
                } />
            })
          }
        </div>
    )}
  }

  return Canvas;
}
