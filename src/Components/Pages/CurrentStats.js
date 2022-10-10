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
    };
  }

  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/streak")

      .then((response) => {
        this.setState({ hold: response.data });
      });

    let Teams = Object.keys(this.state.Streak);

    await this.setState({ Streak: this.state.hold });
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Current Week Stats by Team</h1>

        <ListGroup>
          {Object.keys(this.state.Streak).map((item, index) => {
            return (
              <ListGroup.Item>
                <Row>
                  <h1>{item}</h1>
                </Row>
                <Row>
                  <Col lg="3">
                    <img
                      src={this.state.TeamPhoto[item]}
                      class="img-thumbnail"
                    />
                  </Col>
                  <Col lg="9">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Username</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td colSpan={2}>Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                      </tbody>
                    </Table>
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
