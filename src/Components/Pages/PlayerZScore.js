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
  Toast,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";
import AverageStats from "./AverageStats";
import PlayerData from "../../PlayerData/PlayerData.json";
import Select from "react-select";
import StatisticPlayerGraph from "./StatisticPlayerGraph";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

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
      leagueAverage: [],
      GraphData: [],
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/player_zscore")

      .then((response) => {
        this.setState({ PlayerZScoreData: response.data });
      });

    await this.setState({
      leagueAverage: this.state.PlayerZScoreData["league_average"],
    });

    console.log(this.state.PlayerZScoreData);

    console.log(this.state.leagueAverage);

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

        this.state.PlayerZScoreData[x]["Player"] = this.state.PlayerZScoreData[
          x
        ]["Player"]
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
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

    console.log(this.state.PlayerZScoreData[this.state.selectedPlayer]);

    let keyArray = Object.keys(
      this.state.PlayerZScoreData[this.state.selectedPlayer]
    );

    console.log(keyArray);
    let graphData = [];
    for (let i = 0; i < keyArray.length; i++) {
      const graphElement = {};
      if (
        typeof this.state.PlayerZScoreData[this.state.selectedPlayer][
          keyArray[i]
        ] != "string"
      ) {
        graphElement["value"] =
          this.state.PlayerZScoreData[this.state.selectedPlayer][keyArray[i]];
        graphElement["name"] = keyArray[i];
        graphData.push(graphElement);
      }
    }

    console.log(graphData);
    await this.setState({ GraphData: graphData });

    console.log(this.state.leagueAverage);
    console.log(Object.keys(this.state.leagueAverage).length);
  }
  render() {
    return (
      <div>
        {this.state.PlayerZScoreData.length === 0 ? (
          <p></p>
        ) : (
          <Col>
            {/*
            <Row>
              {Object.keys(this.state.leagueAverage).length != 0 ? (
                <div>
                  {Object.keys(this.state.leagueAverage).map((stat) => {
                    return (
                      <p>
                        {stat}: {this.state.leagueAverage[stat]}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p></p>
              )}
            </Row>
              */}
            <Row>
              <Col lg="8">
                <Select
                  options={this.state.options}
                  onChange={this.handleSelect}
                />
              </Col>
            </Row>
            <br />
            <Row>
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
                  <div style={{ width: "100%", height: 700 }}>
                    <h1>{this.state.selectedPlayer.split("-")[0]} ZScore</h1>
                    <ResponsiveContainer>
                      <BarChart
                        width={500}
                        height={300}
                        data={this.state.GraphData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 
                  {this.state.selectedPlayerStats.map((stat) => (
                    <Row>
                      <Row>
                        <div>
                          {(() => {
                            if (stat == "TOV") {
                              if (
                                this.state.PlayerZScoreData[
                                  this.state.selectedPlayer
                                ][stat] < 0.0
                              ) {
                                return (
                                  <Badge bg="success">
                                    {stat}{" "}
                                    {
                                      this.state.PlayerZScoreData[
                                        this.state.selectedPlayer
                                      ][stat]
                                    }
                                  </Badge>
                                );
                              } else if (
                                this.state.PlayerZScoreData[
                                  this.state.selectedPlayer
                                ][stat] > 0.0
                              ) {
                                return (
                                  <Badge bg="danger">
                                    {stat}{" "}
                                    {
                                      this.state.PlayerZScoreData[
                                        this.state.selectedPlayer
                                      ][stat]
                                    }
                                  </Badge>
                                );
                              } else if (
                                this.state.PlayerZScoreData[
                                  this.state.selectedPlayer
                                ][stat] === 0.0
                              ) {
                                return (
                                  <Badge bg="secondary">
                                    {stat}{" "}
                                    {
                                      this.state.PlayerZScoreData[
                                        this.state.selectedPlayer
                                      ][stat]
                                    }
                                  </Badge>
                                );
                              }
                            }
                            if (
                              this.state.PlayerZScoreData[
                                this.state.selectedPlayer
                              ][stat] > 0.0
                            ) {
                              return (
                                <Badge bg="success">
                                  {stat}{" "}
                                  {
                                    this.state.PlayerZScoreData[
                                      this.state.selectedPlayer
                                    ][stat]
                                  }
                                </Badge>
                              );
                            } else if (
                              this.state.PlayerZScoreData[
                                this.state.selectedPlayer
                              ][stat] < 0.0
                            ) {
                              return (
                                <Badge bg="danger">
                                  {stat}{" "}
                                  {
                                    this.state.PlayerZScoreData[
                                      this.state.selectedPlayer
                                    ][stat]
                                  }
                                </Badge>
                              );
                            } else if (
                              this.state.PlayerZScoreData[
                                this.state.selectedPlayer
                              ][stat] === 0.0
                            ) {
                              return (
                                <Badge bg="secondary">
                                  {stat}{" "}
                                  {
                                    this.state.PlayerZScoreData[
                                      this.state.selectedPlayer
                                    ][stat]
                                  }
                                </Badge>
                              );
                            } else {
                              return null;
                            }
                          })()}
                        </div>

                        {}
                      </Row>
                    </Row>
                  ))}

                        */}
                </div>
              ) : null}
            </Row>
          </Col>
        )}
      </div>
    );
  }
}
