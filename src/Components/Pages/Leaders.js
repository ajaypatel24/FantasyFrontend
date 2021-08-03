
import React from 'react'
import { Alert, Card, CardGroup, Table, Image, Accordion, Tabs, Tab, Figure, Col } from 'react-bootstrap'
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
            Leaders: [],
            TeamPhotos: {}

        };

    }

    async componentDidMount() {
        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))
        await axios.post('https://react-flask-fantasy.herokuapp.com/win-calculator', bodyFormData)

            .then((response) => {
                this.setState({ Leaders: JSON.stringify(response.data) })
            })

        await axios.get('https://react-flask-fantasy.herokuapp.com/team-photo')

            .then((response) => {
                this.setState({ TeamPhotos: JSON.stringify(response.data) })
            })

        var arr = []
        var cat = []
        var leadersJsonObject = JSON.parse(this.state.Leaders)
        var teamPhotosJsonObject = JSON.parse(this.state.TeamPhotos)


        for (var i in leadersJsonObject) {
            cat.push(i)
            arr.push(leadersJsonObject[i])
        }

        await this.setState({ AllLeader: arr })
        await this.setState({ Categories: cat })

        var holder = {}
        for (var y in teamPhotosJsonObject) {

            holder[y] = teamPhotosJsonObject[y]
        }

        await this.setState({ TeamPhotos: holder })

    }


    render() {


        return (

            <div >

                <h1 style={{ textAlign: 'center' }}>Current Week Category Ranks</h1>
                <div className="tableContent">

                    <Tabs justify>




                        {
                            this.state.AllLeader.map((item, i) => {

                                return (
                                    <Tab eventKey={i} title={<h6>{this.state.Categories[i]} Standings</h6>} >



                                        
                                            <Col lg={12} xs={12}>
                                            <Table >

                                                <thead>
                                                    <tr>
                                                        <th style={{ fontSize: '1.3rem' }}>

                                                            <Figure>
                                                                <Figure.Image height='80%'
                                                                    width='80%' style={{ alignSelf: 'center' }} src={this.state.TeamPhotos[item[0][0]]} thumbnail />
                                                                <figcaption> Current {this.state.Categories[i]} Leader <strong><i>{item[0][0]}</i></strong></figcaption>
                                                            </Figure>

                                                        </th>
                                                        
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            Team
                                                        </th>
                                                        <th>
                                                            Count
                                                        </th>
                                                    </tr>
                                                </thead>


                                                <tbody>


                                                    {item.map((val, x) => {
                                                        return (

                                                            <tr>

                                                                {x === 0 ?
                                                                    <td><strong><i>{val[0]} </i></strong></td>
                                                                    :
                                                                    <td>{val[0]}</td>
                                                                }
                                                                {x === 0 ?

                                                                    <td><strong><i>{val[1]}</i></strong></td>
                                                                    :
                                                                    <td>{val[1]}</td>
                                                                }
                                                            </tr>




                                                        )
                                                    })}




                                                </tbody>
                                            </Table>
                                       
                                       </Col>


                                    </Tab>

                                )

                            })}


                    </Tabs>

                </div>

            </div >

        );
    };
}

