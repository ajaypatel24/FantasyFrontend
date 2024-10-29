import React from "react";
import { Tab,  Col, Row, Tabs, Table, Figure  } from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";

import TeamNav from "./teamnav";
import LeaderTable from "./leadertable";
import AverageStats from "./AverageStats";
import BarChartStats from "./BarChartStats";
export default class LeadersV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawDataFromResponseV2: null,
      rawPhotoDataV2: null,
      activeKey: 0
    };

    this.setTabKey = this.setTabKey.bind(this)
  }


  async setTabKey(e) {
    console.log(e)
    await this.setState({ activeKey: e });
  }
  

  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/category-leader-v2")
      .then((response) => {
        this.setState({ rawDataFromResponseV2: response.data });
      });

    await axios
    .get(global.config.apiEndpoint.production + "/team-photo-v2")
    .then((response) => {
      this.setState({ rawPhotoDataV2: response.data });
    });
      
      /*
      {Object.keys(this.state.rawDataFromResponseV2).map((item, index) => {
        console.log(item)
        Object.keys(this.state.rawDataFromResponseV2[item]).map((cat, index) => {
          console.log(cat , this.state.rawDataFromResponseV2[item][cat])
        })
      })}
      */
  }

  render() {

    return (
      <Tab.Container defaultActiveKey={this.state.activeKey} >
        {this.state.rawDataFromResponseV2 === null || this.state.rawPhotoDataV2 === null ?
        null
        :
          <div className="tableContent">
            
              <Row>
                <Col lg={3}>
                  {this.state.rawDataFromResponseV2 === null ? null : (
                    <TeamNav
                      data={Object.keys(this.state.rawDataFromResponseV2)}
                      defaultString="Standings"
                    />
                  )}
                </Col>
                <Col lg={3}>
                  <Tab.Content>

                          {Object.keys(this.state.rawDataFromResponseV2).map((item, index) => {
                            return (
                              
                              <LeaderTable photodata={this.state.rawPhotoDataV2} stat={item} dataindex={index} data={this.state.rawDataFromResponseV2[item]}/>
                              
                            )
                          })}
                    </Tab.Content>
                </Col>
                <Col lg={6}>
                <Tab.Content>
                {Object.keys(this.state.rawDataFromResponseV2).map((item, index) => {
                  return (
                  <BarChartStats dataindex={index} data={this.state.rawDataFromResponseV2[item]} item={item} />
                  )
                  })}
                  </Tab.Content>
                </Col>
              </Row>
            
        </div>
  }
      </Tab.Container>
                        
    );
  }
}
