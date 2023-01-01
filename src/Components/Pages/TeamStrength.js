import React from "react";
import { Col, Row, ListGroup, Tab, Spinner } from "react-bootstrap";
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
      .get(global.config.apiEndpoint.production + "team-map")

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

      if (dataPoint.value > 0) {
        dataPoint.color = "#8884d8";
      } else {
        dataPoint.color = "#ff7300";
      }

      dataPoint.value = dataPoint.value.toFixed(2);
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
        subject: "Math",
        A: 120,
        B: 110,
        fullMark: 150,
      },
      {
        subject: "Chinese",
        A: 98,
        B: 130,
        fullMark: 150,
      },
      {
        subject: "English",
        A: 86,
        B: 130,
        fullMark: 150,
      },
      {
        subject: "Geography",
        A: 99,
        B: 100,
        fullMark: 150,
      },
      {
        subject: "Physics",
        A: 85,
        B: 90,
        fullMark: 150,
      },
      {
        subject: "History",
        A: 65,
        B: 85,
        fullMark: 150,
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
                  <Tab.Content>
                    <ComposedChart
                      layout="vertical"
                      width={600}
                      height={600}
                      data={this.state.graphData}
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="value" scale="band" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" barSize={20} fill="#413ea0">
                        {this.state.graphData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </ComposedChart>
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
