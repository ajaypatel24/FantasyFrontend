import { Col, Row, Nav, Alert, Spinner, ListGroup } from "react-bootstrap";
import React from "react";
export default class CategoryWon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.data);
  }

  render() {
    return (
      <Row>
        {this.props.data.map((item, index) => {
          return <p>{item}</p>;
        })}
      </Row>
    );
  }
}
