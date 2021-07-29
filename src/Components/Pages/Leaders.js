
import React from 'react'
import { Card, CardGroup, Table } from 'react-bootstrap'
import axios from 'axios'
import "../../styles/PageStyle.css"


export default class Leaders extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            data: this.props.dataParentToChild,
            AllLeader: [],
            Categories: [],
            AllData: this.props.LeaderInformation[1],
            Leaders: []

        };





    }


    async componentDidMount() {
        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))
        await axios.post('/win-calculator', bodyFormData)

            .then((response) => {
                this.setState({ Leaders: JSON.stringify(response.data) })
            })

        var arr = []
        var cat = []
        var leadersJsonObject = JSON.parse(this.state.Leaders)

        for (var i in leadersJsonObject) {
            cat.push(i)
            arr.push(leadersJsonObject[i])
        }

        await this.setState({ AllLeader: arr })
        await this.setState({ Categories: cat })


    }



    render() {


        return (



            <div >




                <h1 style={{ textAlign: 'center' }}>Current Week Category Ranks</h1>
                <div className="tableContent">


                    <Table className="InnerTable" style={{ width: '100%' }}>
                        <CardGroup>
                            {
                                this.state.AllLeader.map((item, i) => {

                                    return (

                                        <Card>
                                            <Table style={{ width: '100%' }}>



                                                <thead>
                                                    <th style={{ fontSize: '1.3rem' }}>

                                                        {this.state.Categories[i]} Standings


                                                    </th>
                                                </thead>
                                                <tbody>

                                                    <tr>
                                                        {item.map((val, x) => {
                                                            return (

                                                                <p>
                                                                    {x === 0 ?
                                                                        <div>
                                                                            <td><strong>{val[0]}</strong></td>
                                                                            <td>
                                                                                <strong>{val[1]}</strong>
                                                                            </td>
                                                                        </div>

                                                                        :
                                                                        <div>
                                                                            <td>{val[0]}</td>
                                                                            <td className="Value">
                                                                                {val[1]}
                                                                            </td>
                                                                        </div>
                                                                    }

                                                                </p>

                                                            )
                                                        })}

                                                    </tr>

                                                </tbody>




                                            </Table>
                                        </Card>


                                    )

                                })}
                        </CardGroup>
                    </Table>



                </div>



            </div>





        );
    };
}

