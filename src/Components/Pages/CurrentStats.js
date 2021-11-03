import React from "react";
import { Table } from "react-bootstrap";

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
    };
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Current Week Stats by Team</h1>

        <Table className="StatTable" responsive>
          {this.state.dataArray.map((item, i) => {
            return (
              <tbody>
                <tr>
                  <td>
                    <strong>{this.state.Players[i]}</strong>
                  </td>

                  {this.state.Categories.map((category, x) => (
                    <td>
                      <strong key={x}>{category}</strong>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td></td>
                  {this.state.Categories.map((category, x) => (
                    <td key={x}>{item[this.state.Players[i]][category]}</td>
                  ))}
                </tr>
              </tbody>
            );
          })}
        </Table>
      </div>
    );
  }
}
