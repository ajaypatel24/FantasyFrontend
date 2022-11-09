import React from "react";
import {
  Badge,
  Table,
  Row,
  Container,
  ListGroup,
  Col,
  Card,
  Button,
  Jumbotron,
  Image,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";

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
    console.log(this.state.teamTransactions);
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
      <div>
        <h1 style={{ textAlign: "center" }}>Current Week Stats by Team</h1>

        <ListGroup>
          {this.state.Players.map((item, index) => {
            return (
              <ListGroup.Item>
                <Row>
                  <h1>{item}</h1>
                </Row>

                <Row>
                  <Col lg="3" md="3" sm="12" xs="12">
                    <img
                      width="70%"
                      height="70%"
                      src={this.state.TeamPhoto[item]}
                      class="img-thumbnail"
                    />
                  </Col>
                  <Col lg="3" md="3" sm="12" xs="12">
                    <ListGroup as="ol" numbered>
                      {this.state.injury.length === 0 ? (
                        <div>
                          <Spinner animation="grow" variant="dark" />{" "}
                          <strong>Loading injuries</strong>
                        </div>
                      ) : (
                        <div>
                          {Object.keys(this.state.injury[item]).map((t, s) => {
                            return (
                              <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                              >
                                <div className="ms-2 me-auto">
                                  <div className="fw-bold">{t}</div>
                                  <Badge bg="danger">
                                    {this.state.injury[item][t]}
                                  </Badge>
                                </div>
                              </ListGroup.Item>
                            );
                          })}
                        </div>
                      )}
                    </ListGroup>
                  </Col>
                  <Col lg="3" md="3" sm="12" xs="12">
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
                                      }{" "}
                                    </Badge>
                                  ) : (
                                    <Badge bg="danger">
                                      {
                                        this.state.teamTransactions[
                                          this.state.selectedTeam
                                        ][t]["transaction"]
                                      }{" "}
                                    </Badge>
                                  )}
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>
                        </Modal.Body>
                      )}
                    </Modal>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}
