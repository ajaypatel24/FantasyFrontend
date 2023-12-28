import {
  Col,
  Row,
  Nav,
  Alert,
  Spinner,
  ListGroup,
  Figure,
  Container,
  Toast,
} from "react-bootstrap";
import React from "react";

export default class TableData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedCategoryData: null,
    };
  }

  componentDidMount() {
    this.setState({ sortedCategoryData: this.sortCategoryLeader() });
  }

  sortCategoryLeader() {
    let f = this.props.data;
    let sortable = [];

    for (var team in f) {
      sortable.push([team, f[team]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    let objSorted = {};

    sortable.forEach(function (item) {
      objSorted[item[0]] = item[1];
    });

    return objSorted;
  }

  render() {
    return this.state.sortedCategoryData === null ? null : (
      <tbody>
        {Object.keys(this.state.sortedCategoryData).map((item, index) => {
          return (
            <tr>
              {/*
              <td>
                <Figure>
                  <Figure.Image
                    height="100px"
                    width="100px"
                    style={{ alignSelf: "center" }}
                    src={this.props.photodata[item]}
                    alt=""
                    thumbnail
                  />
                </Figure>
              </td>
              <td>
                <h4>{item}</h4>
              </td>
              <td>
                <h4>{this.props.data[item]}</h4>
              </td>
          */}
              <td>
                <Toast>
                  <Toast.Header closeButton={false}>
                    <h4 className="me-auto">{item}</h4>

                    <Figure>
                      <Figure.Image
                        height="50px"
                        width="50px"
                        src={this.props.photodata[item]}
                        alt=""
                        thumbnail
                      />
                    </Figure>
                  </Toast.Header>
                  <Toast.Body>
                    <h4>{this.props.data[item]}</h4>
                  </Toast.Body>
                </Toast>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}
