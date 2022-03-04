import React from "react";
import {
  Table,
  Tabs,
  Tab,
  Figure,
  Col,
  Row,
  ListGroup,
  Dropdown,
  DropdownButton,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";
import AverageStats from "./AverageStats";
import PlayerData from "../../PlayerData/PlayerData.json";
import Select from "react-select";

export default class Leaders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      PlayerZScoreData: [],
      PlayerArray: [],
      selectedPlayer: "",
      selectedPlayerStats: [],
      selectedPlayerPhoto: "",
      options: [],
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/player_zscore")

      .then((response) => {
        this.setState({ PlayerZScoreData: response.data });
      });

    console.log(this.state.PlayerZScoreData);

    await this.setState({
      PlayerArray: Object.values(this.state.PlayerZScoreData),
    });

    console.log(this.state.PlayerArray);

    let optionArray = [];
    for (const element of this.state.PlayerArray) {
      let option = { value: element["Player"], label: element["Player"] };
      optionArray.push(option);
    }

    await this.setState({ options: optionArray });
  }

  async handleSelect(e) {
    console.log("trigger");
    console.log(e);
    for (const x of Object.keys(this.state.PlayerZScoreData)) {
      if (x.includes(e["value"])) {
        console.log(x);
        await this.setState({ selectedPlayer: x });
        await this.setState({
          selectedPlayerStats: Object.keys(this.state.PlayerZScoreData[x]),
        });

        let playerNameArray =
          this.state.PlayerZScoreData[x]["Player"].split(" ");

        for (var z = 0; z < PlayerData["league"]["standard"].length; z++) {
          if (
            PlayerData["league"]["standard"][z]["firstName"] ===
              playerNameArray[0] &&
            PlayerData["league"]["standard"][z]["lastName"] ===
              playerNameArray[1]
          ) {
            let val =
              "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
              PlayerData["league"]["standard"][z]["personId"] +
              ".png";

            await this.setState({ selectedPlayerPhoto: val });
            break;
          }
        }
      }
    }
  }
  render() {
    return (
      <div>
        {this.state.PlayerZScoreData.length === 0 ? (
          <p></p>
        ) : (
          <Row>
            <Col>
              <Select
                options={this.state.options}
                onChange={this.handleSelect}
              />
            </Col>
            <Col>
              <Row>{this.state.selectedPlayer}</Row>
              {this.state.selectedPlayerStats.length != 0 &&
              this.state.selectedPlayerPhoto != "" ? (
                <div>
                  <Figure>
                    <Figure.Image
                      width={171}
                      height={180}
                      alt="171x180"
                      src={this.state.selectedPlayerPhoto}
                    />
                  </Figure>
                  {this.state.selectedPlayerStats.map((stat) => (
                    <Row>
                      <div>
                        {(() => {
                          if (stat == "TOV") {
                            if (
                              this.state.PlayerZScoreData[
                                this.state.selectedPlayer
                              ][stat] < 0.0
                            ) {
                              return <Badge bg="success">{stat}</Badge>;
                            } else if (
                              this.state.PlayerZScoreData[
                                this.state.selectedPlayer
                              ][stat] > 0.0
                            ) {
                              return <Badge bg="danger">{stat}</Badge>;
                            } else if (
                              this.state.PlayerZScoreData[
                                this.state.selectedPlayer
                              ][stat] === 0.0
                            ) {
                              return <Badge bg="secondary">{stat}</Badge>;
                            }
                          }
                          if (
                            this.state.PlayerZScoreData[
                              this.state.selectedPlayer
                            ][stat] > 0.0
                          ) {
                            return <Badge bg="success">{stat}</Badge>;
                          } else if (
                            this.state.PlayerZScoreData[
                              this.state.selectedPlayer
                            ][stat] < 0.0
                          ) {
                            return <Badge bg="danger">{stat}</Badge>;
                          } else if (
                            this.state.PlayerZScoreData[
                              this.state.selectedPlayer
                            ][stat] === 0.0
                          ) {
                            return <Badge bg="secondary">{stat}</Badge>;
                          } else {
                            return null;
                          }
                        })()}
                      </div>

                      {
                        this.state.PlayerZScoreData[this.state.selectedPlayer][
                          stat
                        ]
                      }
                    </Row>
                  ))}
                </div>
              ) : null}
            </Col>
          </Row>
        )}
      </div>
    );
  }
}
