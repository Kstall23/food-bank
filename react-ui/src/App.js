import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from './Main';
import Auth from './modules/Auth';
import Tabs from './components/Tabs';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from './modules/Auth';


// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true,
      authenticated: false,
      adminStatus: false,
      errors: {},
      userFormObj: {
        email: '',
        password: ''
      },
      user: null
    };
    this.toggleUser = this.toggleUser.bind(this);
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  toggleUser(newUser) {
    if(!newUser) {
      this.setState({ user: null })
    } else {
      fetch('/api/dashboard', {
        METHOD : "GET",
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          Authorization: `bearer ${Auth.getToken()}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
          return response.json();
        })
        .then(json => {
          let currState = this.state;
          currState.message = json.message;
          currState.fetching = false;
          currState.user = json.user;
          this.setState(currState);
        }).catch(e => {
          console.log(`API call failed: ${e}`);
          this.setState({
            fetching: false
          });
        })
    }
  }

  componentWillMount() {
    this.toggleAuthenticateStatus()
  }

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      adminStatus: false,
      user: {}
    };
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }

  componentDidMount() {
    this.toggleAuthenticateStatus() // looking for local token and returns true if it's there

    fetch('/api/dashboard', {
      METHOD : "GET",
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        Authorization: `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        let currState = this.state;
        currState.user = json.user;
        if (json.user.role === 'admin') {
          currState.adminStatus = true;
        }
        this.setState(currState);
      }).catch(e => {
        console.log(`API call failed: ${e}`);
      })
      console.log("after fetch on app", this.state);
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  render() {
    console.log("app adminStatus", this.state.adminStatus);
    return (
    <div>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router>
           <div>
             <Tabs
               user = {this.state.user}
               authenticated= {this.state.authenticated}
               toggleAuthenticateStatus={() => this.toggleAuthenticateStatus}
               toggleUser={this.toggleUser}
             />
             <Main
               toggleAuthenticateStatus={() => this.toggleAuthenticateStatus}
               toggleUser={this.toggleUser}
               errors={this.state.errors}
               userFormObj={this.state.userFormObj}
               changeUser={this.changeUser}

             />
          </div>
        </Router>
      </MuiThemeProvider>
    </div>

    );
  }
}
