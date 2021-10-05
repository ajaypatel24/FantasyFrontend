
import React from 'react'
import { Alert, Card, CardGroup, Table, Image, Accordion, Tabs, Tab, Figure, Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap'
import axios from 'axios'
import teamPhoto from '../../PlayerData/TeamPhoto.json'
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
            TeamPhotos: teamPhoto, //cached after pulled once
            Loading: true,
            selectedIndex: 0

        };

    }

    async componentDidMount() {

        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))

        //API call to get leaders of categories
        await axios.post(process.env.REACT_APP_URI_ENDPOINT + '/win-calculator', bodyFormData)

            .then((response) => {
                this.setState({ Leaders: JSON.stringify(response.data) })
            })

        if (this.state.TeamPhotos === null) {

            await axios.get(process.env.REACT_APP_URI_ENDPOINT + '/team-photo')

                .then((response) => {
                    this.setState({ TeamPhotos: JSON.stringify(response.data) })
                })

            var teamPhotosJsonObject = JSON.parse(this.state.TeamPhotos)
            var teamPhotoObject = {}
            for (var team in teamPhotosJsonObject) { //build teamPhotoObject to use as state {TeamName : PhotoURL}


                teamPhotoObject[team] = teamPhotosJsonObject[team]
            }

            await this.setState({ TeamPhotos: teamPhotoObject })

        }
        var teamRankingByCategory = []
        var category = []
        var leadersJsonObject = JSON.parse(this.state.Leaders)



        for (var categoryName in leadersJsonObject) {
            category.push(categoryName)
            teamRankingByCategory.push(leadersJsonObject[categoryName])
        }

        await this.setState({ AllLeader: teamRankingByCategory })
        await this.setState({ Categories: category })
        await this.setState({ Loading: false })


    }

    async assignIndex(i) { //change Category table according to selected tab
        await this.setState({ selectedIndex: i });

    }


    render() {


        return (

            <div >

                {this.state.Loading === false ?
                    <div className="tableContent">


                        <Tab.Container defaultActiveKey={this.state.Categories[0]}>
                            <Row>
                                <Col sm={3}>
                                    <ListGroup justify>

                                        {this.state.Categories.map((category, categoryIndex) => {

                                            return (
                                                <ListGroup.Item eventKey={category} onClick={() => this.assignIndex(categoryIndex)}><h4>{category} Standings</h4> </ListGroup.Item>
                                            )
                                        })}
                                    </ListGroup>
                                </Col>




                                <Col sm={9} >
                                    <Tab.Content>

                                                        return (
                                                            <ListGroup.Item eventKey={this.state.Categories[i]} onClick={() => this.assignIndex(i)}><h4>{this.state.Categories[i]} Standings</h4> </ListGroup.Item>
                                                        )
                                                    })}
                                                </ListGroup>
                                            </Col>


                                        <Table striped bordered hover>
                                            <thead>

                                                <tr >
                                                    <th colSpan="2">
                                                        <h2> {this.state.Categories[this.state.selectedIndex]} Leader </h2>
                                                        <Figure>

                                                            <Figure.Image height='100px'
                                                                width='100px' style={{ alignSelf: 'center' }}
                                                                src={this.state.TeamPhotos[this.state.AllLeader[this.state.selectedIndex][0][0]]}
                                                                thumbnail />


                                                        </Figure>
                                                    </th>
                                                </tr>

                                            </thead>
                                            {
                                                this.state.AllLeader[this.state.selectedIndex].map((teamAndScore, i) => {


                                                    return (

                                                        <tbody>



                                                                {i === 0 ?
                                                                    <td><i><h2><strong>{teamAndScore[0]}</strong></h2> </i></td>
                                                                    :
                                                                    <td><h4>{teamAndScore[0]}</h4></td>
                                                                }
                                                                {i === 0 ?

                                                                    <td><i><h2><strong>{teamAndScore[1]}</strong></h2></i></td>
                                                                    :
                                                                    <td><h4>{teamAndScore[1]}</h4></td>
                                                                }
                                                            </tr>

                                                        </tbody>

                                                    )
                                                })}
                                        </Table>



                                                            




                                                        </tbody>
                                                        
                                                            )
                                                        })}
                                                        </Table>

                                                        </div>
                                                    
                                                </Tab.Content>

                                            </Col>


                                        </Row>
                                    </Tab.Container>

                                


                                    </Tab.Content>


                                </Col>



                            </Row>
                        </Tab.Container>


                    </div>

                    :

                    null

                }

            </div >

        );
    };
}

