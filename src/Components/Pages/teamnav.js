import { Col, Row, Nav, Alert, Spinner, ListGroup } from "react-bootstrap";
import React from "react";
export default class TeamNav extends React.Component {
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
          return (
            <ListGroup variant="pills" className="flex-column">
              <ListGroup.Item eventKey={index}>
                <h4>{item}</h4>
              </ListGroup.Item>
            </ListGroup>
          );
        })}
      </Row>
    );
  }
}
