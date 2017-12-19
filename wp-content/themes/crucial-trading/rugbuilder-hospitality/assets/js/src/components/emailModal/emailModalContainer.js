RugBuilder.prototype.EmailModalComponent = function (choices) {
  const axios = window.axios;

  const R = rugBuilder;
  const store = ReduxStore.store;

  class EmailModal extends React.Component {
    constructor() {
      super();

      this.state = {
        structure : R.choices.structure,
        colour1   : R.choices.color1,
        colour2   : R.choices.color2,
        colour3   : R.choices.color3,
        colour4   : R.choices.color4,
        colour5   : R.choices.color5,
        colour6   : R.choices.color6,
        colour7   : R.choices.color7,
        colour8   : R.choices.color8,
        colour9   : R.choices.color9,

        name: '',
        company: '',
        address: '',
        town: '',
        postcode: '',
        email: '',
        emailResponse: '',

        emailSent: false,
        emailResponded: false,
        validationMessage: '',

        storeCanvasImages: store.getState().canvasImages[0]
      }
    }

    /**
     * HANDLERS
     */
    handleNameChange = (event) => {
      this.setState({name: event.target.value});
    }

    handleCompanyChange = (event) => {
      this.setState({company: event.target.value});
    }

    handleAddressChange = (event) => {
      this.setState({address: event.target.value});
    }

    handleTownChange = (event) => {
      this.setState({town: event.target.value});
    }

    handlePostcodeChange = (event) => {
      this.setState({postcode: event.target.value});
    }

    handleEmailChange = (event) => {
      console.log('handle email change');

      this.setState({email: event.target.value});
    }


    /**
     *
     */
    sendEmail = () => {
      console.log('send email !!');
      if (!this.validateInputs()) {
        return
      }

      this.setState({emailSent: true});

      const selectedCanvasImages =
        this.state.storeCanvasImages.filter(function (x) {
          return x.selected;
        });

      axios.post(this.getPostUrl(), {
        selectedCanvasImages: JSON.stringify(selectedCanvasImages),
        email: this.state.email,
        name: this.state.name,
        company: this.state.company,
        address: this.state.address,
        town: this.state.town,
        postcode: this.state.postcode
      })
      .then(res => {
        console.log('email axios res ---->')
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }

    /**
     *
     */
    emailCallback = (response) => {
      let res = response.srcElement.responseText
      let msg = ''

      switch ( res ) {
        case 'invalid email' :
          msg = 'Sorry, your email is invalid. Please ensure you have typed ' +
            'it correctly and try again.'
          break;

        case 'success' :
          msg  = 'YOUR EMAIL WAS SENT SUCCESSFULLY';
          break;

        default :
          msg = 'Sorry, an error has occured. Please try again.';
      }

      this.setState({
        emailResponded: true,
        emailResponse: msg
      });
    }

    /**
     * validation
     */
    validateInputs = () => {
      console.log('validate inputs')

      this.setState({validationMessage: ''})

      if (!this.state.name) {
        this.setState({validationMessage: 'Please enter your name'});
        console.log('no name');
        return false
      }

      if (!this.state.company) {
        this.setState({validationMessage: 'Please enter your company'})
        return false
      }

      if (!this.state.address) {
        this.setState({validationMessage: 'Please enter your address'});
        return false
      }

      if (!this.state.town) {
        this.setState({validationMessage: 'Please enter your town'});
        return false
      }

      if (!this.state.postcode) {
        this.setState({validationMessage: 'Please enter your postcode'});
        return false
      }

      if (!this.state.email) {
        this.setState({validationMessage: 'Please enter your email address'});
        return false
      }

      return true
    }

    /**
     *
     */
    getPostUrl = () => {
      let apiUrl = '';

      if (window.location.hostname === 'localhost') {
				apiUrl = 'http://localhost:8888/crucial-trading/';
			} else if (window.location.hostname == 'vps.89hosting.co.uk') {
				apiUrl = 'http://vps.89hosting.co.uk/~crucialtrading/';
			} else {
				apiUrl = 'http://www.crucial-trading.com/';
			}

      apiUrl += 'wp-json/api/v1/';
			return `${apiUrl}email-hospitality-rug-choices`;
    }

    /**
     *
     */
    emailResponseJsx = () => {
      if (!this.state.emailResponded) { return null; }

      return (
        <div className="email-response-container">
          <p className="email-response">
            {this.state.emailResponse}
          </p>

          <div className="grey-line"></div>

          <button
            className="default"
            onClick={(event) => this.props.toggleEmailVisible(event)}
          >
            RETURN TO SUMMARY
          </button>
        </div>
    )}

    /**
     *
     */
    formJsx = () => {
      if (this.state.emailResponded) { return null; }

      return (
        <div>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name*"
              onChange={this.handleNameChange}
            />
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Company*"
              onChange={this.handleCompanyChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Address Line 1*"
              onChange={this.handleAddressChange}
            />
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Address Line 2"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Town*"
              onChange={this.handleTownChange}
            />
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Postcode*"
              onChange={this.handlePostcodeChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address*"
              onChange={this.handleEmailChange}
            />
          </div>

          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Additional Email Address"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Additional Email Address"
            />
          </div>

          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Additional Email Address"
            />
          </div>
        </div>
        </div>
    )}


    render() {
      return (
        <div className="email-modal">
          <div className="email-modal__background"></div>

          <div className="email-modal__email-form">
            <div
              className="close"
              onClick={(event) => this.props.toggleEmailVisible(event)}
            >
              close x
            </div>

            {!this.state.emailResponded &&
              <p className="header-text">EMAIL YOUR DESIGN</p>
            }

            {!this.state.emailResponded &&
              <div className="grey-line"> </div>
            }

            { this.formJsx() }
            { this.emailResponseJsx() }

            {!this.state.emailSent && !this.state.emailResponded &&
              <button
                className="default fixed-width"
                onClick={(event) => this.sendEmail(event)}
              >
                SEND EMAIL
              </button>
            }

            <p className="error">{ this.state.validationMessage }</p>

          </div>
        </div>
    )}
  }

  return EmailModal;
}
