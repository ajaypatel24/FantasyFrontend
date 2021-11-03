import React from "react";
import { Table, Tabs, Tab, Figure, Col, Row, ListGroup } from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";
import AverageStats from "./AverageStats";

export default class Leaders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      StatLeaderInformation: [],
      Categories: [],
      AllData: this.props.LeaderInformation[1],
      Source: this.props.LeaderInformation[3],
      Leaders: [],
      TeamPhotos: this.props.LeaderInformation[2], //cached after pulled once
      Loading: true,
      selectedIndex: 0,
      WincalculationOld: this.props.LeaderInformation[0],
      activeKey: "Ranking",
    };

    this.setTabKey = this.setTabKey.bind(this);
    this.updateComponentData = this.updateComponentData.bind(this);
  }

  async updateComponentData() {
    if (this.state.Source === "Previous") {
      //coming from PreviousWeek Component
      await this.setState({
        Leaders: JSON.stringify(this.state.WincalculationOld),
      });
    }

    var teamRankingByCategory = [];

    var leadersJsonObject = JSON.parse(this.state.Leaders);
    var category = Object.keys(leadersJsonObject);

    for (var i = 0; i < category.length; i++) {
      //sorting algorithm, python cant sort dict properly

      var sortable = [];
      for (var team in leadersJsonObject[category[i]]) {
        sortable.push([team, leadersJsonObject[category[i]][team]]);
      }
      sortable.sort(function (a, b) {
        if (category[i] === "TO") {
          return a[1] - b[1];
        }
        return b[1] - a[1];
      });
      var objSorted = {};
      sortable.forEach(function (item) {
        objSorted[item[0]] = item[1];
      });

      teamRankingByCategory.push(objSorted);
    }

    await this.setState({ StatLeaderInformation: teamRankingByCategory });
    await this.setState({ Categories: category });
    await this.setState({ Loading: false });
  }

  async componentWillReceiveProps(prevProps) {
    //update on props change

    await this.setState({
      WincalculationOld: this.props.LeaderInformation[0],
      AllData: this.props.LeaderInformation[1],
    });
    await this.updateComponentData();
  }
  async componentDidMount() {
    var bodyFormData = new FormData();
    bodyFormData.append("data", JSON.stringify(this.state.AllData));

    //API call to get leaders of categories
    if (!this.state.WincalculationOld.hasOwnProperty("3PTM")) {
      await axios
        .post(
          global.config.apiEndpoint.production + "/category-leader",
          bodyFormData
        )

        .then((response) => {
          this.setState({ Leaders: JSON.stringify(response.data) });
        });
    } else {
      await this.setState({
        Leaders: JSON.stringify(this.state.WincalculationOld),
      });
    }

    this.updateComponentData();
  }

  async assignIndex(i) {
    //change Category table according to selected tab
    await this.setState({ selectedIndex: i });
  }

  async setTabKey(e) {
    await this.setState({ activeKey: e });
  }

  render() {
    let leaderInformation = [
      this.state.AllData,
      this.state.Categories[this.state.selectedIndex],
    ];

    return (
      <div>
        {this.state.Loading === false ? (
          <div className="tableContent">
            <Tab.Container defaultActiveKey={this.state.Categories[0]}>
              <Row>
                <Col sm={3}>
                  <ListGroup justify>
                    {this.state.Categories.map((category, categoryIndex) => {
                      return (
                        <ListGroup.Item
                          eventKey={category}
                          onClick={() => this.assignIndex(categoryIndex)}
                        >
                          <h4>{category} Standings</h4>{" "}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Col>

                <Col sm={9}>
                  <Tab.Content>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={this.state.activeKey}
                      onSelect={this.setTabKey}
                      className="mb-3"
                    >
                      <Tab eventKey="Ranking" title="Ranking">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th colSpan="2">
                                <h2>
                                  {" "}
                                  {
                                    this.state.Categories[
                                      this.state.selectedIndex
                                    ]
                                  }{" "}
                                  Leader{" "}
                                </h2>
                                <Figure>
                                  <Figure.Image
                                    height="100px"
                                    width="100px"
                                    style={{ alignSelf: "center" }}
                                    src={
                                      this.state.TeamPhotos[
                                        Object.keys(
                                          this.state.StatLeaderInformation[
                                            this.state.selectedIndex
                                          ]
                                        )[0]
                                      ]
                                    }
                                    alt=""
                                    thumbnail
                                  />
                                </Figure>
                              </th>
                            </tr>
                          </thead>
                          {Object.keys(
                            this.state.StatLeaderInformation[
                              this.state.selectedIndex
                            ]
                          ).map((team, i) => {
                            return (
                              <tbody>
                                <tr>
                                  {i === 0 ? (
                                    <td>
                                      <i>
                                        <h2>
                                          <strong>{team}</strong>
                                        </h2>{" "}
                                      </i>
                                    </td>
                                  ) : (
                                    <td>
                                      <h4>{team}</h4>
                                    </td>
                                  )}
                                  {i === 0 ? (
                                    <td>
                                      <i>
                                        <h2>
                                          <strong>
                                            {
                                              this.state.StatLeaderInformation[
                                                this.state.selectedIndex
                                              ][team]
                                            }
                                          </strong>
                                        </h2>
                                      </i>
                                    </td>
                                  ) : (
                                    <td>
                                      <h4>
                                        {
                                          this.state.StatLeaderInformation[
                                            this.state.selectedIndex
                                          ][team]
                                        }
                                      </h4>
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            );
                          })}
                        </Table>
                      </Tab>

                      {this.state.Source !== "Previous" ? (
                        <Tab eventKey="Graph" title="Graph">
                          <AverageStats
                            TeamCompareInformation={leaderInformation}
                          ></AverageStats>
                        </Tab>
                      ) : null}
                    </Tabs>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        ) : null}
      </div>
    );
  }
}
