import React, { Component } from "react";
import icon from "./icon.png";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// importing screens
import LoginScreen from "./pages/LoginScreen";
import AddCampaign from "./pages/AddCampigns";
import VotingScreen from "./pages/VotingScreen";
import ListCampaigns from "./pages/ListCampaigns"
import EETesting from "./pages/EETesting" 
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginScreen} />
          <Route path="/add-campaign" component={AddCampaign} />
          <Route path="/voting-screen" component={VotingScreen} />
          <Route path="/list-campaigns" component={ListCampaigns}/>
          <Route path="/ee-tests" component={EETesting}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
