
import React from 'react'
import { Table } from 'react-bootstrap'

import "../../styles/PageStyle.css"


export default class CurrentStats extends React.Component {
    constructor(props) {
        super(props);


        this.state = {


            Categories: this.props.CurrentStatInformation[0],
            dataArray: this.props.CurrentStatInformation[1],
            Players: this.props.CurrentStatInformation[2]


        };



    }


    render() {


        return (

            <div>

                <h1 style={{ textAlign: 'center' }}>Current Week Stats by Team</h1>



                <Table className="StatTable" responsive>
                    {this.state.dataArray.map((item, i) => {
                        return (

                            <Table bordered >
                                <td><strong>{this.state.Players[i]}</strong></td>

                                {this.state.Categories.map((cat, x) =>
                                    <td>
                                        <strong>{cat}</strong>
                                    </td>
                                )}
                                <tbody>

                                    <tr>


                                        <td></td>
                                        {this.state.Categories.map((cat, x) =>



                                            <td>
                                                {item[this.state.Players[i]][cat]}
                                            </td>

                                        )}


                                    </tr>


                                </tbody>
                            </Table>


                        )


                    })
                    }

                </Table>


            </div>


        );
    };
}

