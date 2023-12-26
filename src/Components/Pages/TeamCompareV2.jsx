import React from "react";
import axios from "axios";
import {
    Container,
    Accordion,
    TabContainer,
    Row,
    Col,
    Tab,
    Nav,
    TabContent
  } from "react-bootstrap";
export default class TeamCompareV2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        rawDataFromResponseV2: null
    };
  }



  async componentDidMount() {
    await axios
      .get(global.config.apiEndpoint.production + "/winning-matchups-v2")
      .then((response) => {
        this.setState({ rawDataFromResponseV2: response.data });
      });

    console.log(this.state.rawDataFromResponseV2)

    Object.keys(this.state.rawDataFromResponseV2).map((item, index) => {
        this.state.rawDataFromResponseV2[item]["winning_matchup"].map((data, index) => {
            console.log(data["team_name"])
            data["category_won"].map((category, index) => {
                console.log(category)
            })
        })
        //console.log(this.state.rawDataFromResponseV2[item]["winning_matchup"])
    })
  }

  render() {
    return (
        <Tab.Container id="left-tabs-example">
            {this.state.rawDataFromResponseV2 === null ?
            null
            :
            <Container>
            
        {Object.keys(this.state.rawDataFromResponseV2).map((item, index) => {
            return (
                <Row>
                <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey={index}>{item}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
          <Tab.Content>
          <Tab.Pane eventKey={index}>
          <Accordion defaultActiveKey="0">
            {this.state.rawDataFromResponseV2[item]["winning_matchup"].map((item,index) => {
                
                return (
                    
                    <Accordion.Item eventKey={index}>
                <Accordion.Header>{item["team_name"]} {item["category_won"].length}</Accordion.Header>
                
                <Accordion.Body>
                {item["category_won"].map((category, index) => {
                    return (
                        <div>
                        {category}
                        </div>
                    )
                })}
                </Accordion.Body>
                </Accordion.Item>
                
                )
                
            })}
            </Accordion>
            </Tab.Pane>
            </Tab.Content>
            </Col>
            </Row>
            )
        })}

        
    
</Container>
  }
    </Tab.Container>
    )
  }
}
