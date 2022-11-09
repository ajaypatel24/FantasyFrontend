import React from "react";
import {
  Container,
  Button,
  Nav,
  Navbar,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "./styles/PageStyle.css";
import "./styles/App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import Leaders from "./Components/Pages/Leaders";
import Prediction from "./Components/Pages/Prediction";
import TeamCompare from "./Components/Pages/TeamCompare";
import CurrentStats from "./Components/Pages/CurrentStats";
import PreviousWeek from "./Components/Pages/PreviousWeek";
import PlayerZScore from "./Components/Pages/PlayerZScore";

export default class RootComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rawDataFromResponse: "",
      dataArray: [],
      Players: [],
      Categories: [],
      AllData: [],
      LoadingButton: true,
      weekArray: [],
      photoData: [],
      teamInjury: "",
      teamTransactions: "",
    };

    this.refresh = this.refresh.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/full-team-data")
      .then((response) => {
        this.setState({ rawDataFromResponse: JSON.stringify(response.data) });
      });

    var arr = [];
    var obj = JSON.parse(this.state.rawDataFromResponse);
    var dataKeySet = Object.keys(obj["team_data"]);
    this.processPhotoData(obj["team_photo"]);
    obj = obj["team_data"];

    var catArray = [];

    for (var key in dataKeySet) {
      var w = {};
      w[dataKeySet[key]] = obj[dataKeySet[key]];
      arr.push(w);
    }

    await this.setState({ AllData: arr });

    for (var x in arr[0][dataKeySet[0]]) {
      catArray.push(x);
    }

    await this.setState({ Players: dataKeySet });
    await this.setState({ dataArray: arr });
    await this.setState({ Categories: catArray });

    this.setState({
      LoadingButton: false,
    });

    var allWeekArray = [];
    var totalWeek = -1;
    await axios
      .get(global.config.apiEndpoint.production + "/week")
      .then((response) => {
        totalWeek = response.data;
      });

    for (var i = 1; i <= totalWeek - 1; i++) {
      allWeekArray.push(i);
    }

    await this.setState({ weekArray: allWeekArray });
  }

  async processPhotoData(teamPhotosJsonObject) {
    var teamPhotoObject = {};
    for (var team in teamPhotosJsonObject) {
      //build teamPhotoObject to use as state {TeamName : PhotoURL}

      teamPhotoObject[team] = teamPhotosJsonObject[team];
    }

    await this.setState({ photoData: teamPhotoObject });
  }

  refresh() {
    window.location.reload(false);
  }

  render() {
    let currentStatInformation = [
      this.state.Categories,
      this.state.dataArray,
      this.state.Players,
      this.state.photoData,
    ];

    let leaderInformation = [
      this.state.Categories,
      this.state.AllData,
      this.state.photoData,
    ];

    let teamCompareInformation = [this.state.AllData];

    let previousWeekInformation = [this.state.weekArray, this.state.photoData];

    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Navbar.Brand>Fantasy Stat Track</Navbar.Brand>
              <Nav className="mr-auto">
                <Button href="#/" variant="dark" id="0">
                  Home
                </Button>
                <Button href="#/PreviousWeek" variant="dark" id="1">
                  Previous Weeks
                </Button>
                <Button href="#/Leaders" variant="dark" id="2">
                  Leaders
                </Button>
                <Button href="#/Compare" variant="dark" id="3">
                  Team vs Other Teams
                </Button>
                <Button href="#/Prediction" variant="dark" id="4">
                  Predictions
                </Button>
                <Button href="#/PlayerRating" variant="dark" id="5">
                  Player Rating
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <br />

        <Container fluid>
          <Col>
            <Row>
              {this.state.LoadingButton === false ? (
                <HashRouter>
                  <Switch>
                    <Route
                      exact
                      path="/PreviousWeek"
                      render={(props) => (
                        <PreviousWeek
                          {...props}
                          WeekInformation={previousWeekInformation}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/Leaders"
                      render={(props) => (
                        <Leaders
                          {...props}
                          LeaderInformation={leaderInformation}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/Compare"
                      render={(props) => (
                        <TeamCompare
                          {...props}
                          TeamCompareInformation={teamCompareInformation}
                        />
                      )}
                    />
                    <Route exact path="/Prediction" component={Prediction} />

                    <Route
                      exact
                      path="/PlayerRating"
                      component={PlayerZScore}
                    />

                    <Route
                      path="/"
                      render={(props) => (
                        <CurrentStats
                          {...props}
                          CurrentStatInformation={currentStatInformation}
                        />
                      )}
                    />
                  </Switch>
                </HashRouter>
              ) : (
                <Container fluid>
                  <Spinner animation="border"> </Spinner>
                </Container>
              )}
            </Row>
          </Col>
        </Container>
      </div>
    );
  }
}
