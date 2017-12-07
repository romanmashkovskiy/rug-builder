RugBuilder.prototype.progressMenuViewComponent = function () {
  const R = rugBuilder;

  const BtnExitComponent = R.btnExitComponent();
  const BtnRestartComponent = R.btnRestartComponent();
  const BtnSubmitComponent  = R.btnSubmitComponent();
  const BtnStageComponent   = R.btnStageComponent();


  /**
   *
   */
  const Stages = () => {
    if (!this.state.stages) { return null; }

    return (
      this.state.stages.map((stage, index) => {
        return <BtnStageComponent
          stage={stage}
          key={index}
          index={index} />
      })
    )
  }

  /**
   *
   */
  const ProgressMenuView = () => {
    return (
      <div className="hosp_builder_progress-menu__container">
        <div className="hosp_builder_progress-menu__top">
          <img
            src="https://d105txpzekqrfa.cloudfront.net/uploads/20170110114837/logo-1.png"
            alt="Crucial Trading Rug Builder"
          />

          {this.state.showSubmit &&
            <BtnSubmitComponent />
          }

          <BtnRestartComponent />
          <BtnExitComponent />
        </div>

        <div className="hosp_builder_progress-menu__bottom">
          <ul className="hosp_builder_progress-menu__stages">
            <Stages />
          </ul>
        </div>
      </div>
    )
  }

}
