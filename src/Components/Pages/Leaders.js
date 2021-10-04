
import React from 'react'
import { Alert, Card, CardGroup, Table, Image, Accordion, Tabs, Tab, Figure, Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap'
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
            TeamPhotos: {"David's Team": "https://s.yimg.com/cv/apiv2/default/nba/nba_6_d.png",
            "Donutcic": "https://s.yimg.com/cv/apiv2/default/nba/nba_4_a.png",
            "EMVBiid": "https://yahoofantasysports-res.cloudinary.com/image/upload/t_s192sq/fantasy-logos/d34dc6574f3f5e5f6469f030604b1fe2b77bf77a608a811d50da25330dfc6552.jpg",
            "Feng's Unreal Team": "https://s.yimg.com/cv/apiv2/default/nba/nba_8_f.png",
            "I stan curry uwu": "https://s.yimg.com/cv/apiv2/default/nba/nba_10_e.png",
            "Joseph Ingles": "https://yahoofantasysports-res.cloudinary.com/image/upload/t_s192sq/fantasy-logos/643ae38a63b04c39c5a4e1d003db7f1ac88d7c7da4d6207c2c67d839053cc937.png",
            "Kentuckyy": "https://s.yimg.com/cv/apiv2/default/nba/nba_6_k.png",
            "Sufyan's Super Team": "https://s.yimg.com/cv/apiv2/default/nba/nba_2_s.png"
            },
            Loading: true,
            selectedIndex: 0

        };

    }

    async componentDidMount() {
        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))
        await axios.post('https://react-flask-fantasy.herokuapp.com/win-calculator', bodyFormData)

            .then((response) => {
                this.setState({ Leaders: JSON.stringify(response.data) })
            })

        if (this.state.TeamPhotos === null) {
        await axios.get('https://react-flask-fantasy.herokuapp.com/team-photo')

            .then((response) => {
                this.setState({ TeamPhotos: JSON.stringify(response.data) })
            })

        var teamPhotosJsonObject = JSON.parse(this.state.TeamPhotos)
        var holder = {}
        for (var y in teamPhotosJsonObject) {

            holder[y] = teamPhotosJsonObject[y]
        }

        await this.setState({ TeamPhotos: holder })

        }
        var arr = []
        var cat = []
        var leadersJsonObject = JSON.parse(this.state.Leaders)
        


        for (var i in leadersJsonObject) {
            cat.push(i)
            arr.push(leadersJsonObject[i])
        }

        await this.setState({ AllLeader: arr })
        await this.setState({ Categories: cat })

        console.log(this.state.AllLeader);
        

        console.log(this.state.TeamPhotos)
        await this.setState({ Loading: false })

    }

    async assignIndex(i) {
        await this.setState({selectedIndex : i});
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

                                                    {this.state.AllLeader.map((item, i) => {

                                                        return (
                                                            <ListGroup.Item eventKey={this.state.Categories[i]} onClick={() => this.assignIndex(i)}><h4>{this.state.Categories[i]} Standings</h4> </ListGroup.Item>
                                                        )
                                                    })}
                                                </ListGroup>
                                            </Col>



                                            <Col  sm={9} >
                                                <Tab.Content>
                                                    
                                                    <div>
                                                    <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                                
                                                            </tr>
                                                            <tr >
                                                                <th colSpan="2">
                                                                <h2> {this.state.Categories[this.state.selectedIndex]} Leader </h2>
                                                                    <Figure>

                                                                        <Figure.Image height='100px'
                                                                            width='100px' style={{ alignSelf: 'center' }} src={this.state.TeamPhotos[this.state.AllLeader[this.state.selectedIndex][0][0]]} thumbnail />
                                                                        

                                                                    </Figure>
                                                                </th>
                                                            </tr>
                                                           
                                                        </thead>
                                                    {
                                                        this.state.AllLeader[this.state.selectedIndex].map((item, i) => {

                                                            return (
                                                            


                                                        <tbody>


                                                         

                                                                    <tr>

                                                                        {i === 0 ?
                                                                            <td><i><h2><strong>{item[0]}</strong></h2> </i></td>
                                                                            :
                                                                            <td><h4>{item[0]}</h4></td>
                                                                        }
                                                                        {i === 0 ?

                                                                            <td><i><h2><strong>{item[1]}</strong></h2></i></td>
                                                                            :
                                                                            <td><h4>{item[1]}</h4></td>
                                                                        }
                                                                    </tr>




                                                            




                                                        </tbody>
                                                        
                                                            )
                                                        })}
                                                        </Table>

                                                        </div>
                                                    
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

