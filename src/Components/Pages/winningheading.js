import {
  Col,
  Row,
  Nav,
  Alert,
  Container,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import React from "react";
export default class WinningHeading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Alert variant="primary">
        <Alert.Heading>
          Winning Matchups: {this.props.winningdata}
        </Alert.Heading>
      </Alert>
    );
  }
}
