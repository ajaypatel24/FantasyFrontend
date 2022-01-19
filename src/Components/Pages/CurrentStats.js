import React from "react";
import { Badge, Table, Row, Container } from "react-bootstrap";
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
      hold: "",
      Streak: ""
    };
  }

  async componentDidMount() {
    await axios
    .get(
      global.config.apiEndpoint.production + "/streak",
    )

    .then((response) => {
      this.setState({ hold: response.data });
    });

    let Teams = Object.keys(this.state.Streak)
    

    await this.setState({Streak: this.state.hold})
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Current Week Stats by Team</h1>

        <Table className="StatTable" responsive>

              
                {Object.keys(this.state.Streak).map((item, index) => {
                  return (
                    
                      <tr>
                      <h1>{item}</h1>
                      {this.state.Streak[item]['W'] > this.state.Streak[item]['L'] ? 
                      
                        <Badge bg="success"><h1>W{this.state.Streak[item]['W']}</h1></Badge>
                        
                      
                        :
                        <Badge bg="danger"><h1>L{this.state.Streak[item]['L']}</h1></Badge>
                        
                      }
                      </tr>
                      
                    
                  )
                })}
              

        </Table>
      </div>
    );
  }
}
