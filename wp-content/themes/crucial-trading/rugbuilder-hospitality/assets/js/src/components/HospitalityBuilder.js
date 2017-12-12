RugBuilder.prototype.HospitalityBuilderComponent = function () {
  const Connect = window.ReactRedux.connect;

  const R = rugBuilder;
  const store = ReduxStore.store;

  const DrawerV2 = R.drawerV2Component();
  const ProgressMenuV2 = R.progressMenuV2Component();
  const ImageChoice = R.imageChoiceComponent();
  const SubmitScreen = R.submitScreenComponent();


  class HospitalityBuilder extends React.Component {
    constructor() {
      super();

      this.state = {
        canvasImages: [],
        fadeOtherCanvasImages: false,
        submitted: false,
        stageInFocus: 0,
        selectedStructure: {},
        storeCanvasImages: []
      }

      this.currentStage = 0;
      store.subscribe(this.handleReduxStoreChange)
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('component did update');
      console.log(this.state);
    }

    /**
     * listen to changes in the redux store and update state to changes in store
     */
    handleReduxStoreChange = () => {
      console.log('store changed !!!')
      console.log(store.getState());

      this.setState({
        storeCanvasImages: store.getState().canvasImages,
        selectedStructure: store.getState().selectedStructure[0]
      })
    }

    /**
     * when user select a new stage update 'current stage' used for canvas images
     */
    changeStage = (stage) => {
      this.currentStage = stage;

    }

    /**
     * select new Image that will be displayed in the Canvas which makes up the
     * custom material built.
     * If already selected stage then update array-> else push
     */
    selectNewImage = (newImage) => {
      newImage.stageIndex = this.currentStage;
      var newImages = this.state.canvasImages;

      const x = newImages.findIndex((image) => {
        return image.stageIndex === this.currentStage
      })

      /* update previous stage canvas image */
      if (x !== -1) {
        if (this.currentStage === 0) {
          newImages = [];
          newImages.push(newImage);
        } else {
          newImages.splice(x, 1, newImage);
        }
      }

      /* add new canvas image */
      else {
        newImages.push(newImage);
      }

      this.setState({canvasImages: newImages });
    }

    /**
     * when a stage is being hovered over in the progress menu reduce the opacity
     * of all the images apart from the one in focus
     */
    highlightCanvasImageOnHover = (stage) => {
      this.setState({
        fadeOtherCanvasImages: true,
        stageInFocus: stage
      })
    }

    removeHighlightOnCanvasImage = () => {
      this.setState({fadeOtherCanvasImages: false})
    }


    render() {
      return (
        <div id="hospitality-builder">
          <DrawerV2
            selectNewImage={this.selectNewImage}
          />

          <div id="mainContainer">
            <ProgressMenuV2
              changeStage={this.changeStage}
              selectedCanvasImages={this.state.canvasImages}
              highlightCanvasImageOnHover={this.highlightCanvasImageOnHover}
              removeHighlightOnCanvasImage={this.removeHighlightOnCanvasImage}
            />

            <div id="canvas">
              {/* Canvas */}
              <div
                id="hosp_builder_img-container"
                className={
                  "canvas " +
                  (this.state.fadeOtherCanvasImages ? 'fade-images' : '')
                }
              >
                {
                  this.state.canvasImages.map((image, index) => {
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

              {/* Structure/Color choices (thumbnails) */}
              <div id="hosp_builder_choices">
                {
                  this.state.canvasImages.map((canvasImage, index) => {
                    return <ImageChoice
                      src={canvasImage.img}
                      alt={canvasImage.alt}
                      stage={canvasImage.stageIndex}
                      key={index} />
                  })
                }
              </div>
            </div>
          </div>

          {this.state.submitted &&
            <SubmitScreen />
          }
        </div>
    )}
  }

  //
  // const mapStateToProps = (state) => ({
  //   selectedStructure: RS.store.getState().selectedStructure
  // });
  //
  // HospitalityBuilder = Connect(mapStateToProps)(HospitalityBuilder);

  return HospitalityBuilder;
}
