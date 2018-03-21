RugBuilder.prototype.ToolTipsComponent = function () {
  const ToolTipsView = rugBuilder.ToolTipsViewComponent();

  class ToolTips extends React.Component {
    constructor() {
      super();

      this.state = {
        currentStepIndex: 0,

        steps: [
          {
            index: 'stepOne',
            header: 'STRUCTURES',
            text: 'USE THIS PANEL TO CHOOSE YOUR STRUCTURE'
          },
          {
            index: 'stepTwo',
            header: 'PROGRESS BAR',
            text: 'USE THE PROGRESS BAR TO BUILD YOUR DESIGN'
          },
          {
            index: 'stepThree',
            header: 'COLOURS',
            text: 'CLICK A COLOUR TO CHANGE YOUR DESIGN'
          }
        ]
      }
    }

    /**
     *
     */
    nextStep = () => {
      this.setState({currentStepIndex: this.state.currentStepIndex + 1})
    }

    /**
     *
     */
    prevStep = () => {
      this.setState({currentStepIndex: this.state.currentStepIndex - 1})
    }

    render() {
      const stepIndex = this.state.currentStepIndex
      const currentStep = this.state.steps[stepIndex]


      return (
        <ToolTipsView
          state={this.state}
          currentStep={currentStep}
          nextStep={this.nextStep}
          prevStep={this.prevStep}
        />
      )
    }
  }

  return ToolTips;
}
