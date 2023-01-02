import React from "react";
import {
  Col,
  Row,
  ListGroup,
  Tab,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  Area,
  Line,
} from "recharts";

export default class TeamStrength extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ListOfPlayers: [],
      loadingComplete: false,
      LeagueAverage: "",
      TeamAverage: "",
      graphData: "",
      TeamMap: "",
      SelectedPlayer: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  async componentDidMount() {
    //count of winning matchups

    await axios
      .get(global.config.apiEndpoint.production + "/league/overall/average")

      .then((response) => {
        this.setState({ LeagueAverage: response.data });
      });

    await axios
      .get(global.config.apiEndpoint.production + "/league/average")

      .then((response) => {
        this.setState({ TeamAverage: response.data });
      });

    await axios
      .get(global.config.apiEndpoint.production + "/team-map")

      .then((response) => {
        this.setState({ TeamMap: response.data });
      });

    console.log(this.state.TeamInverseMap);

    var PlayerList = Object.keys(this.state.TeamAverage);

    await this.setState({ ListOfPlayers: PlayerList });

    await this.assignPlayer(this.state.ListOfPlayers[0], 0);

    await this.setState({ loadingComplete: true });
  }

  async assignPlayer(player1, i) {
    var teamStats = this.state.TeamAverage[player1];
    await this.setState({ SelectedPlayer: player1 });
    const teamData = [];
    for (var category in teamStats) {
      var dataPoint = {};
      dataPoint.name = category;
      if (category === "FT%" || category === "FG%") {
        dataPoint.value =
          (teamStats[category] - this.state.LeagueAverage[category]) * 1000;
      } else {
        dataPoint.value =
          teamStats[category] - this.state.LeagueAverage[category];
      }

      dataPoint.average = this.state.LeagueAverage[category];

      if (dataPoint.value > 0) {
        dataPoint.color = "#8884d8";
      } else {
        dataPoint.color = "#ff7300";
      }

      dataPoint.value = Math.round(dataPoint.value);

      console.log(this.state.LeagueAverage[category]);

      teamData.push(dataPoint);
    }
    await this.setState({ graphData: teamData });

    console.log(this.state.graphData);
    await this.setState({ player: [player1, i] });
  }

  async handleClose() {
    await this.setState({ show: false });
  }

  async handleOpen(playerName) {
    await this.setState({ show: true });
    await this.setState({ name: playerName });
  }

  render() {
    const colors = ["#8884d8", "#82ca9d"];
    const data = [
      {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        name: "Page D",
        uv: 2780,
        pv: -3908,
        amt: 2000,
      },
      {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ];
    return (
      <div>
        <div>
          {this.state.loadingComplete !== false ? (
            <Tab.Container defaultActiveKey={this.state.ListOfPlayers[0]}>
              <Row>
                <Col sm={3}>
                  <ListGroup>
                    {this.state.ListOfPlayers.map((item, index) => {
                      return (
                        <ListGroup.Item
                          key={item}
                          eventKey={item}
                          onClick={() => this.assignPlayer(item, index)}
                        >
                          <h4>{this.state.TeamMap[item]}</h4>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Col>

                <Col sm={9} lg={9}>
                  <h1>
                    {this.state.TeamMap[this.state.SelectedPlayer]} Strength Per
                    Category
                  </h1>
                  <Tab.Content>
                    <div>
                      <ComposedChart
                        width={830}
                        height={350}
                        data={this.state.graphData}
                      >
                        <XAxis dataKey="name" />
                        <YAxis
                          ticks={[-60, -40, -20, 0, 20, 40, 60]}
                          domain={[-60, 60]}
                        />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid stroke="#f5f5f5" />

                        <Bar dataKey="value" barSize={60} fill="#413ea0" />
                      </ComposedChart>

                      {this.state.SelectedPlayer != "" ? (
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Overall Average</th>
                              <th>Vs. League Average</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(
                              this.state.TeamAverage[this.state.SelectedPlayer]
                            ).map((item, index) => {
                              return (
                                <tr>
                                  <td>{item}</td>
                                  <td>
                                    {
                                      this.state.TeamAverage[
                                        this.state.SelectedPlayer
                                      ][item]
                                    }
                                  </td>
                                  <td>
                                    <Badge>
                                      {Math.round(
                                        this.state.TeamAverage[
                                          this.state.SelectedPlayer
                                        ][item] - this.state.LeagueAverage[item]
                                      )}{" "}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
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
