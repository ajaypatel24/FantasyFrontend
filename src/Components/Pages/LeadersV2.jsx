import React from "react";
import { Tab,  Col, Row  } from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";

import TeamNav from "./teamnav";
export default class LeadersV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawDataFromResponseV2: null,
    };
  }

  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/category-leader-v2")
      .then((response) => {
        this.setState({ rawDataFromResponseV2: response.data });
      });
  }

  render() {

    return (
      <div>
          <div className="tableContent">
            <Tab.Container defaultActiveKey={0}>
              <Row>
                <Col sm={3}>
                  {this.state.rawDataFromResponseV2 === null ? null : (
                    <TeamNav
                      data={Object.keys(this.state.rawDataFromResponseV2)}
                    />
                  )}
                </Col>
                <Col sm={9}>
                  <p>content</p>
                </Col>
              </Row>
            </Tab.Container>
        </div>
      </div>
    );
  }
}
