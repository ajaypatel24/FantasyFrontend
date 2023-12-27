import React from "react";
import {
  Col,
  Row,
  Badge,
  ListGroup,
  Tab,
  Accordion,
  Alert,
  Spinner,
  Container,
} from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";
import PlayerData from "../../PlayerData/PlayerData.json";
import CategoryWon from "./categorywon";
import WinningHeading from "./winningheading";

export default class AccordionComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category_won: [],
    };
  }

  componentDidMount() {
    console.log(this.props.data.length);
    {
      this.props.data.map((index, item) => {
        //console.log(index["category_won"]);
        console.log(index["team_name"]);
        console.log(index["category_won"]);
      });
    }
  }

  render() {
    return (
      <Tab.Pane eventKey={this.props.dataindex}>
        <Container>
          <WinningHeading winningdata={this.props.matchupswon} />
        </Container>
        <Accordion>
          {this.props.data.map((index, item) => {
            return (
              <Container>
                <Accordion.Item key={item} eventKey={item}>
                  <Accordion.Header>
                    <p>{index["team_name"]}</p>
                  </Accordion.Header>
                  <Accordion.Body>
                    <CategoryWon data={index["category_won"]} />
                  </Accordion.Body>
                </Accordion.Item>
              </Container>
            );
          })}
        </Accordion>
      </Tab.Pane>
    );
  }
}
