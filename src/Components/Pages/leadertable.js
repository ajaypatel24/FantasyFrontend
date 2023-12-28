import {
  Col,
  Row,
  Nav,
  Alert,
  Spinner,
  ListGroup,
  Table,
  Figure,
  Tab,
} from "react-bootstrap";
import React from "react";
import TableData from "./tabledata";
export default class LeaderTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <Tab.Pane eventKey={this.props.dataindex}>
        <Table striped="columns">
          <thead>
            <tr>
              <th colSpan="2">
                <h2> {this.props.stat} Leader </h2>
              </th>
            </tr>
          </thead>
          <TableData
            photodata={this.props.photodata}
            data={this.props.data}
          ></TableData>
        </Table>
      </Tab.Pane>
    );
  }
}
