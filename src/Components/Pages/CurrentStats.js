import React from "react";
import Card from "react-bootstrap/Card";
import {
  Badge,
  Table,
  Row,
  Container,
  ListGroup,
  Col,
  CardGroup,
  Button,
  Jumbotron,
  Image,
  Spinner,
  Modal,
  Nav,
  Accordion,
  Tabs,
  Tab,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

export default class CurrentStats extends React.Component {
  constructor(props) {
    super(props);

    //Categories being used in league
    //Player team names
    //DataArray: Team statistics for a given team, value of all categories
    this.state = {
      Categories: this.props.CurrentStatInformation[0],
      dataArray: this.props.CurrentStatInformation[1],
      Players: this.props.CurrentStatInformation[2],
      TeamPhoto: this.props.CurrentStatInformation[3],
      hold: "",
      Streak: "",
      injury: "",
      test: "",
      teamTransactions: "",
      show: false,
      selectedTeam: "",
      teamStreak: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  async componentDidMount() {
    let Teams = Object.keys(this.state.Streak);
    await axios
      .get(global.config.apiEndpoint.production + "/v2/transactions")

      .then((response) => {
        this.setState({ teamTransactions: response.data });
      });
    await axios
      .get(global.config.apiEndpoint.production + "/team-injury")

      .then((response) => {
        this.setState({ injury: response.data });
      });

    await axios
      .get(global.config.apiEndpoint.production + "/league/streak")
      .then((response) => {
        this.setState({ teamStreak: response.data });
      });
  }

  async handleShow(e) {
    await this.setState({ show: true });
    await this.setState({ selectedTeam: e.target.id });
  }

  async handleClose() {
    await this.setState({ show: false });
  }

  render() {
    return (
      <Container>
        <h1 style={{ textAlign: "center" }}>Current Week Stats by Team</h1>

        {this.state.Players.map((item, index) => {
          return (
            <Row>
              <Card style={{ width: "30rem" }}>
                <Col>
                  <Card.Img variant="top" src={this.state.TeamPhoto[item]} />
                  <Card.Body>
                    <Card.Title>
                      <strong>{item}</strong>
                    </Card.Title>
                    <Card.Text>
                      <Button
                        variant="primary"
                        id={item}
                        onClick={this.handleShow}
                      >
                        See Transactions
                      </Button>

                      <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>
                            {this.state.selectedTeam} Transactions
                          </Modal.Title>
                        </Modal.Header>
                        {this.state.teamTransactions.length === 0 ||
                        this.state.selectedTeam === "" ? (
                          <Modal.Body>
                            <Spinner animation="grow" variant="dark" />{" "}
                            <strong>Loading Transactions</strong>
                          </Modal.Body>
                        ) : (
                          <Modal.Body>
                            <ListGroup>
                              {Object.keys(
                                this.state.teamTransactions[
                                  this.state.selectedTeam
                                ]
                              ).map((t, s) => {
                                return (
                                  <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                  >
                                    {
                                      this.state.teamTransactions[
                                        this.state.selectedTeam
                                      ][t]["player_name"]
                                    }
                                    {this.state.teamTransactions[
                                      this.state.selectedTeam
                                    ][t]["transaction"] === "add" ? (
                                      <Badge bg="success">
                                        {
                                          this.state.teamTransactions[
                                            this.state.selectedTeam
                                          ][t]["transaction"]
                                        }
                                      </Badge>
                                    ) : (
                                      <Badge bg="danger">
                                        {
                                          this.state.teamTransactions[
                                            this.state.selectedTeam
                                          ][t]["transaction"]
                                        }
                                      </Badge>
                                    )}
                                  </ListGroup.Item>
                                );
                              })}
                            </ListGroup>
                          </Modal.Body>
                        )}
                      </Modal>
                    </Card.Text>
                    <Card.Text>
                      {this.state.teamStreak.length === 0 ? null : (
                        <div>
                          {this.state.teamStreak[item]["streak"] > 0 ? (
                            <Badge bg="success">
                              <h3>W{this.state.teamStreak[item]["streak"]}</h3>
                            </Badge>
                          ) : (
                            <Badge bg="danger">
                              <h3>
                                L{this.state.teamStreak[item]["streak"] * -1}
                              </h3>
                            </Badge>
                          )}
                        </div>
                      )}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Accordion>
                      {this.state.injury.length === 0 ? (
                        <div>
                          <Spinner animation="grow" variant="dark" />{" "}
                          <strong>Loading injuries</strong>
                        </div>
                      ) : (
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>See Injuries</Accordion.Header>
                          {Object.keys(this.state.injury[item]).map((t, s) => {
                            return (
                              <Accordion.Body>
                                <div className="ms-2 me-auto">
                                  <div className="fw-bold">{t}</div>
                                  <Badge bg="danger">
                                    {this.state.injury[item][t]}
                                  </Badge>
                                </div>
                              </Accordion.Body>
                            );
                          })}
                        </Accordion.Item>
                      )}
                    </Accordion>
                  </Card.Footer>
                </Col>
              </Card>
            </Row>
          );
        })}
      </Container>
    );
  }
}
