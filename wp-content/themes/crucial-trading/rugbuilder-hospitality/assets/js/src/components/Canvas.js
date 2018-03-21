RugBuilder.prototype.canvasComponent = function () {
  const store = ReduxStore.store;

  class Canvas extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        storeCanvasImages: store.getState().canvasImages[0],
        selectedChoiceCount: 0
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

    /**
     * All canvas images JSX
     */
    CanvasImagesJsx = () => {
      if (!this.state.storeCanvasImages) { return null }

      return (
        this.state.storeCanvasImages.map((image, index) => {
          if (!image.selected && (
              !this.props.fadeOtherCanvasImages ||
              image.stageIndex !== this.props.stageInFocus
          )) {
            return null
          }

          return <img
            alt={image.alt}
            src={image.src}
            key={index}
            className={
              image.stageIndex === this.props.stageInFocus ?
                'in-focus' : 'out-focus'
            } />
        })
    )}

    render() {
      // if (!this.state.storeCanvasImages) { return null; }

      return (
        <div
          id="hosp_builder_img-container"
          className={
            "canvas " +
            (this.props.fadeOtherCanvasImages ? 'fade-images' : '')
          }
        >
          {this.CanvasImagesJsx()}
        </div>
    )}
  }

  return Canvas;
}
