RugBuilder.prototype.hospBuilderSummaryViewComponent = function () {
  const Link = window.ReactRouterDOM.Link;

  const R = rugBuilder;
  const ProgressMenuV2 = R.progressMenuV2Component();
  const EmailModal = R.EmailModalComponent();
  const Canvas = R.canvasComponent();


  /**
   * Canvas JSX - Left Side
   */
  const CanvasContainer = ({props}) => {
    const editLink = !props.disableButtons ? `` : `summary`

    return (
      <div id="canvas" className="canvas-summary summary__left-side">
        <p className="header"> Your Chosen Design </p>

        <div className="grey-line"></div>

        <Canvas
          fadeOtherCanvasImages={props.fadeOtherCanvasImages}
          stageInFocus={props.stageInFocus}
        />

        <Link to={editLink}
        >
          <p className="edit summary-view-edit" id="summaryViewEdit">
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
            EDIT
          </p>
        </Link>

        <div className="summary__left-side__button-container">
          <button
            className="default fixed-width"
            onClick={(e) =>props.print()}
          >
            PRINT
          </button>

          <div className="spacer"></div>

          <button
            className="default fixed-width"
            onClick={(e) => props.toggleEmailVisible(e)}
          >
            EMAIL
          </button>
        </div>
      </div>
  )}

  /**
   * Choices Table JSX - Right Side
   */
  const ChoicesTable = ({props}) => {
    return (
      <div className="summary__right-side">
        <div className="summary-table__structure">
          <p>STRUCTURE:</p>
          <p>
            {props.storeCanvasImages[0].alt}
            <img src={props.storeCanvasImages[0].img} />
          </p>
        </div>

        <div className="summary-table__colors">
          <div className="summary-table__colors-header">
            COLOURS
          </div>

          {
            props.storeCanvasImages.map((image, index) => {
              if (!image.selected) { return null; }

              if (index === 0) {
                return (
                  <div key={index}>

                    <div className="summary-table__colors-line-item mobile structure">
                      <div className="colors-line-item__left-side">
                        <p> <img src={image.src} /> </p>
                      </div>

                      <div className="colors-line-item__right-side">
                        <p>STRUCTURE</p>
                        <p> {image.alt} </p>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={index}>
                  <div className="summary-table__colors-line-item">
                    <p>Colour {image.stageIndex} </p>
                    <p> {image.alt} <img src={image.src} /> </p>
                  </div>

                  <div className="summary-table__colors-line-item mobile">
                    <div className="colors-line-item__left-side">
                      <p> <img src={image.src} /> </p>
                    </div>

                    <div className="colors-line-item__right-side">
                      <p>COLOUR {image.stageIndex}</p>
                      <p> {image.alt} </p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className="summary__right-side__button-container" id="summaryButtons">
          <button
            className="default fixed-width-195"
            onClick={(e) =>props.print()}
          >
            PRINT
          </button>

          <div className="spacer"></div>

          <button
            className="default fixed-width-195"
            onClick={(e) => props.toggleEmailVisible(e)}
          >
            EMAIL
          </button>
        </div>
      </div>
  )}

  /**
   * mobile buttons container
   */
  const MobileButtons = ({props}) => {
    return (
      <div className="summary-view__mobile-buttons-container">
        <button
          className="default fixed-width"
          onClick={(e) =>props.print()}
        >
          PRINT
        </button>



        <button
          className="default fixed-width"
          onClick={(e) => props.toggleEmailVisible(e)}
        >
          EMAIL
        </button>
      </div>
  )}

  /**
   *
   */
  const SummaryView = (props) => {
    var x = document.getElementsByTagName("BODY")[0];
    x.className = 'summary-view';

    return (
      <div>
        <div id="hospitality-builder" className="hospitality-builder summary-view">
          <ProgressMenuV2
            changeStage={props.changeStage}
            selectedCanvasImages={props.canvasImages}
            highlightCanvasImageOnHover={props.highlightCanvasImageOnHover}
            removeHighlightOnCanvasImage={props.removeHighlightOnCanvasImage}
            headerText="YOUR PREVIEW"
            disableLinkHover={true}
          />

            <div id="mainContainer" className="summary-view">
              {/* Canvas - Left Side */}
              <CanvasContainer props={props} />

              <div className="summary__spacer"></div>

              {/* Table - Right Side */}
              <ChoicesTable props={props} />
            </div>
          </div>

          <MobileButtons props={props} />

          {props.showEmailModal &&
            <EmailModal
              toggleEmailVisible={props.toggleEmailVisible}
            />
          }
        </div>
  )}

  return SummaryView
}
