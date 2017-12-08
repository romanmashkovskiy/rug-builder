RugBuilder.prototype.progressMenuViewComponent = function () {
  const R = rugBuilder;

  const BtnExitComponent = R.btnExitComponent();
  const BtnRestartComponent = R.btnRestartComponent();
  const BtnSubmitComponent  = R.btnSubmitComponent();
  const BtnStageComponent   = R.btnStageComponent();


  /**
   *
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
            handleCurrentStage={props.handleCurrentStage} />
          })
        }
      </ul>
  )}


  /**
   *
   */
  const ProgressMenuView = (props) => {
    return (
      <div className="hosp_builder_progress-menu__container progress-menu">
        <div className="hosp_builder_progress-menu__top progress-menu__top">
          { props.showSubmit &&
            <BtnSubmitComponent />
          }

          <BtnRestartComponent />
          <BtnExitComponent />
        </div>

        <div className="hosp_builder_progress-menu__bottom progress-menu__lower">
          <Stages props={props} />
        </div>
      </div>
  )}

  return ProgressMenuView;
}
