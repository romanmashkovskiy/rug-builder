RugBuilder.prototype.progressMenuViewComponent = function () {
  const Link = window.ReactRouterDOM.Link;

  const R = rugBuilder;
  const BtnExitComponent = R.btnExitComponent();
  const BtnRestartComponent = R.btnRestartComponent();
  // const BtnSubmitComponent  = R.btnSubmitComponent();
  const BtnStageComponent   = R.btnStageComponent();


  /**
   * Stages JSX (A list of all stages for selected structure)
   */
  const Stages = ({props}) => {
    if (!props.stages) { return null; }

    return (
      <ul className="progress-menu__stages">
        {
          props.stages.map((stage, index) => {
          return <BtnStageComponent
            stage={stage}
            key={index}
            index={index}
            currentStage={props.currentStage}
            handleCurrentStage={props.handleCurrentStage}
            selectedCanvasImages={props.selectedCanvasImages}
            highlightCanvasImageOnHover={props.highlightCanvasImageOnHover}
            removeHighlightOnCanvasImage={props.removeHighlightOnCanvasImage}
            disableLinkHover={props.disableLinkHover} />
          })
        }
      </ul>
  )}

  /***
   * submit choices made to build canvas (redirect user to summary view)
   */
  const SubmitLink = ({props}) => {
    if (!props.showSubmit) { return null; }

    return (
      <Link
        to={`summary`}
        className="hosp_builder_progress-menu__submit nav-upper-link"
      >
        <img src="https://d105txpzekqrfa.cloudfront.net/uploads/20170110133914/restart.svg" />
        Submit
      </Link>
  )}

  /**
   * Progress Menu JSX
   */
  const ProgressMenuView = (props) => {
    return (
      <div className="hosp_builder_progress-menu__container progress-menu">
        <div className="progress-menu__left-side">
          <div className="progress-menu__left-side__logo">
            <img src="https://d105txpzekqrfa.cloudfront.net/uploads/hosp-builder-logo.png" />
          </div>

          <div className="progress-menu__left-side__structure-header">
            <h3>{ props.headerText }</h3>
            <div className="spacer"></div>
            <div className="grey-line"> </div>
          </div>
        </div>

        <div className="progress-menu__right-side">
          <div className="hosp_builder_progress-menu__top progress-menu__top">
            <ul>
              <li><SubmitLink props={props} /></li>
              <li><BtnRestartComponent /></li>
              <li><BtnExitComponent /></li>
            </ul>
          </div>

          <div className="hosp_builder_progress-menu__bottom progress-menu__lower">
            <Stages props={props} />
          </div>
        </div>
      </div>
  )}

  return ProgressMenuView;
}
