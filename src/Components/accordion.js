import React from "react";
import {
  Col,
  Row,
  Badge,
  ListGroup,
  Tab,
  Accordion,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";
import PlayerData from "../../PlayerData/PlayerData.json";

export default class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ListOfPlayers: [],
      player: [],
      TopPlayers: [],
      TopCategories: [],
      PlayerName: [],
      WinningMatchupMap: [],
      AllData: this.props.TeamCompareInformation[0],
      WinningHolder: [],
      loadingComplete: false,
      show: false,
      name: "",
      CategoryLeaderboard: [],
      get_time_to_update: 0,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  async componentDidMount() {
    //get all data needed
    var bodyFormData = new FormData();
    bodyFormData.append("data", JSON.stringify(this.state.AllData));

    //count of winning matchups
    await axios
      .post(
        global.config.apiEndpoint.production + "/winning-matchups",
        bodyFormData
      )

      .then((response) => {
        this.setState({ WinningHolder: JSON.stringify(response.data) });
      });

    //Count of wins against other teams
    await axios
      .post(
        global.config.apiEndpoint.production + "/category-leader",
        bodyFormData
      )

      .then((response) => {
        this.setState({ CategoryLeaderboard: JSON.stringify(response.data) });
      });

    var winningMatchupArray = []; //usable object that can be mapped
    var obj = JSON.parse(this.state.WinningHolder); //{Team : Array of WinningMatchupMap Matchups}
    var PlayerList = Object.keys(obj); //List of players

    PlayerList.forEach(function (item, index) {
      //populate
      var key = index;
      var teamWinningMatchupPair = {};
      teamWinningMatchupPair[item] = obj[item];
      winningMatchupArray.push(teamWinningMatchupPair);
    });

    await this.setState({ WinningMatchupMap: winningMatchupArray });
    await this.setState({ ListOfPlayers: PlayerList });

    var CategoryRankingArray = [];
    var categoryLeaderboardArray = JSON.parse(this.state.CategoryLeaderboard); //category rankings
    var categoryArray = [];

    for (var i in categoryLeaderboardArray) {
      //iterate over categories and leaderboards
      categoryArray.push(i);
      CategoryRankingArray.push(categoryLeaderboardArray[i]);
    }

    await this.setState({ CategoryRanking: CategoryRankingArray });
    await this.setState({ Categories: categoryArray });

    await this.setState({ WinningHolder: [] });

    var numberOfWinningMatchupsByTeam = [];
    this.state.WinningMatchupMap.map((item, i) => {
      numberOfWinningMatchupsByTeam.push(
        item[this.state.ListOfPlayers[i]].length
      );
    });

    await this.setState({ WinningHolder: numberOfWinningMatchupsByTeam });

    await this.assignPlayer(this.state.ListOfPlayers[0], 0);

    await this.setState({ loadingComplete: true });
  }

  async topPerformers(team) {
    var bodyFormData = new FormData();

    bodyFormData.append("team", JSON.stringify(team));

    var ranking = {};
    for (var i = 0; i < this.state.CategoryRanking.length - 1; i++) {
      for (var j = 0; j < this.state.CategoryRanking[0].length; j++) {
        if (this.state.CategoryRanking[i][j][0] === team) {
          ranking[this.state.Categories[i]] = j + 1;
        }
      }
    }

    ranking = { "FG%": 1, ST: 2, "FT%": 1, PTS: 4 };

    ranking = Object.entries(ranking)
      .sort((a, b) => a[1] - b[1])
      .map((el) => el[0]);
    bodyFormData.append("categoryRanking", JSON.stringify(ranking.slice(0, 3)));

    /*
    await axios
      .post(
        global.config.apiEndpoint.production + "/top-performers",
        bodyFormData
      )
      .then((response) => {
        this.setState({ TopPlayers: JSON.stringify(response.data) });
      });

    var obj = JSON.parse(this.state.TopPlayers);

    var topThreePlayers = [];
    var topThreeCategories = [];

    for (var x = 0; x < 3; x++) {
      topThreePlayers.push(obj[ranking[x]]);
      topThreeCategories.push(ranking[x]);
    }

    var ImgString = [];
    var PlayerNameArray = [];
    var playerId = [];

    for (var t = 0; t < topThreePlayers.length; t++) {
      //find all player images
      for (var z = 0; z < PlayerData["league"]["standard"].length; z++) {
        if (
          PlayerData["league"]["standard"][z]["firstName"] ===
            topThreePlayers[t]["PlayerFirst"] &&
          PlayerData["league"]["standard"][z]["lastName"] ===
            topThreePlayers[t]["PlayerLast"]
        ) {
          playerId.push(PlayerData["league"]["standard"][z]["personId"]);
          break;
        }
      }
    }

    for (var y = 0; y < topThreePlayers.length; y++) {
      //build image src strings
      let val =
        "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
        playerId[y] +
        ".png";
      ImgString.push(val);
      PlayerNameArray.push(
        topThreePlayers[y]["PlayerFirst"] +
          " " +
          topThreePlayers[y]["PlayerLast"]
      );
    }

    await this.setState({ TopPlayers: ImgString });
    await this.setState({ PlayerName: PlayerNameArray });
    await this.setState({ TopCategories: topThreeCategories });

    await axios
      .get(global.config.apiEndpoint.production + "/time-to-update")
      .then((response) => {
        this.setState({ get_time_to_update: response.data });
      });

    */
  }

  async assignPlayer(player1, i) {
    await this.setState({ player: [player1, i] });
    await this.topPerformers(this.state.player[0]);
  }

  async handleClose() {
    await this.setState({ show: false });
  }

  async handleOpen(playerName) {
    await this.setState({ show: true });
    await this.setState({ name: playerName });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.loadingComplete !== false ? (
            <Tab.Container defaultActiveKey={this.state.ListOfPlayers[0]}>
              <Row>
                <Col sm={3}>
                  <ListGroup>
                    {this.state.WinningMatchupMap.map((item, index) => {
                      return (
                        <ListGroup.Item
                          key={item}
                          eventKey={this.state.ListOfPlayers[index]}
                          onClick={() =>
                            this.assignPlayer(
                              this.state.ListOfPlayers[index],
                              index
                            )
                          }
                        >
                          <h4>{this.state.ListOfPlayers[index]}</h4>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Col>

                <Col sm={9}>
                  <Tab.Content>
                    <div>
                      {/* this.state.TopPlayers.length !== 0 ? */}
                      {this.state.WinningMatchupMap.length !== 0 ? (
                        <Row>
                          <Col>
                            <Row></Row>
                            {/* 
                                                        <Row>
                                                            <h4>Top Performers</h4>
                                                            <caption>Time to Next Update {this.state.get_time_to_update} mins</caption>
                                                            

                                                        </Row>
                                                        <br />
                                                        <Row className="align-items-center">
                                                            {[0, 1, 2].map((index, i) => {
                                                                return (
                                                                    <Col>

                                                                        <Col>
                                                                            <Badge style={{ fontSize: '1.2rem' }} bg="secondary">{this.state.TopCategories[i]}</Badge>
                                                                        </Col>
                                                                        <Row>
                                                                            <Figure>
                                                                                <Figure.Image height='80%'
                                                                                    width='80%' style={{ alignSelf: 'center' }} src={this.state.TopPlayers[i]} />
                                                                                <figcaption style={{ fontSize: '1rem' }}><Button onClick={() => this.handleOpen(this.state.PlayerName[i])}>{this.state.PlayerName[i]}</Button></figcaption>
                                                                            </Figure>
                                                                        </Row>


                                                                        <Modal show={this.state.show} onHide={this.handleClose}>
                                                                            <Modal.Header closeButton>
                                                                                <Modal.Title>{this.state.name}</Modal.Title>
                                                                            </Modal.Header>
                                                                            <Modal.Body>Player stats coming soon</Modal.Body>
                                                                            <Modal.Footer>
                                                                                <Button variant="secondary" onClick={this.handleClose}>
                                                                                    Close
                                                                                </Button>
                                                                            </Modal.Footer>
                                                                        </Modal>
                                                                    </Col>
                                                                )
                                                            })}

                                                        </Row>
                                                        */}

                            <Row>
                              <Col>
                                <br />

                                <Alert variant="primary">
                                  <Alert.Heading>
                                    {
                                      this.state.WinningMatchupMap[
                                        this.state.player[1]
                                      ][this.state.player[0]].length
                                    }{" "}
                                    Winning Matchups
                                  </Alert.Heading>
                                </Alert>

                                {this.state.WinningMatchupMap[
                                  this.state.player[1]
                                ][this.state.player[0]].map(
                                  (WinningMatchup, accordionKey) => {
                                    return (
                                      <Accordion key={accordionKey}>
                                        {[Object.keys(WinningMatchup)].map(
                                          (teamName, x) => {
                                            return (
                                              <Accordion.Item
                                                key={x}
                                                eventKey="q"
                                              >
                                                <Accordion.Header>
                                                  <h5>
                                                    {teamName} :{" "}
                                                    {
                                                      WinningMatchup[teamName]
                                                        .length
                                                    }
                                                  </h5>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                  {WinningMatchup[teamName].map(
                                                    (categoryWon, c) => {
                                                      return (
                                                        <Badge
                                                          key={c}
                                                          bg="info"
                                                        >
                                                          {categoryWon}
                                                        </Badge>
                                                      );
                                                    }
                                                  )}
                                                </Accordion.Body>
                                              </Accordion.Item>
                                            );
                                          }
                                        )}
                                      </Accordion>
                                    );
                                  }
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      ) : null}
                    </div>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          ) : (
            <Row>
              <div>
                <Spinner animation="grow" />
              </div>
              <Row>
                <h4>Updating Roster Stats</h4>
              </Row>
              <Row>
                <p>This may a few minutes</p>
              </Row>
            </Row>
          )}
        </div>
      </div>
    );
  }
}
