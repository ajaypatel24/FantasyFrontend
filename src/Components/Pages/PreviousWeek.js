
import React from 'react'
import { Col, Row, Badge, ListGroup, Tab, Accordion, Alert, Dropdown, DropdownButton } from 'react-bootstrap'
import axios from 'axios'
import "../../styles/PageStyle.css"
import Leaders from './Leaders'


export default class PreviousWeek extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            ListOfPlayers: [],
            player: [],
            WinningMatchupMap: [],
            AllData: [],
            loadingComplete: false,
            show: false,
            name: "",
            WeekNumber: -1,
            LeaderProp: [],
            weekArray: this.props.WeekInformation[0]

        };

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.getWeekDataByNumber = this.getWeekDataByNumber.bind(this);
        this.handleSelect = this.handleSelect.bind(this)
    }
    
    async getWeekDataByNumber(week) { //get all data needed
        var bodyFormData = new FormData();
        bodyFormData.append("week", week)

        await axios.post(global.config.apiEndpoint.production + '/test', bodyFormData)
            .then((response) => {
                this.setState({AllData: JSON.stringify(response.data)})
            })
       
        var obj = JSON.parse(this.state.AllData)
        

        await this.setState({ AllData: obj["AllData"] })
        await this.setState({ LeaderProp: obj["Leader"]})
        await this.setState({ WeekNumber: obj["WeekNumber"]})

        var winningMatchupArray = [] //usable object that can be mapped
        var PlayerList = Object.keys(obj["WinningMatchup"]) //List of players

        PlayerList.forEach(function (player, index) { //populate 
            var teamWinningMatchupPair = {}
            teamWinningMatchupPair[player] = obj["WinningMatchup"][player]
            winningMatchupArray.push(teamWinningMatchupPair);
        });

        await this.setState({ WinningMatchupMap: winningMatchupArray })
        await this.setState({ ListOfPlayers: PlayerList })

        await this.assignPlayer(this.state.ListOfPlayers[0], 0)

        await this.setState({ loadingComplete: true })

    }

    async assignPlayer(player1, i) {

        await this.setState({ player: [player1, i] })

    }

    async handleClose() {
        await this.setState({ show: false })
    }

    async handleOpen(playerName) {
        await this.setState({ show: true })
        await this.setState({ name: playerName })
    }

    handleSelect(e) {
        this.getWeekDataByNumber(e)
    }

    render() {
        let leaderInformation = [
            this.state.LeaderProp,
            this.state.AllData
        ]

        return (

            <div>

                <div>

                    {this.state.loadingComplete !== false ?
                        <Tab.Container defaultActiveKey={this.state.ListOfPlayers[0]}>
                            <Row>
                                <Col>
                                <h1>Week {this.state.WeekNumber}</h1>
                                </Col>
                                <Col>
                                
                            <DropdownButton
                            title="Select Previous Week"
                            onSelect={this.handleSelect}>
                                

                                
                                    {this.props.WeekInformation[0].map((option) => (
                                        <Dropdown.Item eventKey={option}>Week {option}</Dropdown.Item>
                                    ))}
                                
                            </DropdownButton>
                            
                                </Col>
                            </Row>
                            <Row>
                               <Leaders LeaderInformation={leaderInformation} /> 
                            </Row>

                            <Row>
                                <Col sm={3}>

                                    <ListGroup>

                                        {this.state.WinningMatchupMap.map((item, i) => {
                                            return (

                                                <ListGroup.Item eventKey={this.state.ListOfPlayers[i]} onClick={() => this.assignPlayer(this.state.ListOfPlayers[i], i)}><h4>{this.state.ListOfPlayers[i]}</h4></ListGroup.Item>

                                            )
                                        })}
                                    </ListGroup>
                                </Col>

                                <Col sm={9}>

                                    <Tab.Content>

                                        <div>

                                            

                                                <Row>

                                                    <Col>

                                                        <Row>
                                                            <Col >
                                                                <br />

                                                                <Alert variant="primary">
                                                                    <Alert.Heading>
                                                                        {this.state.WinningMatchupMap[this.state.player[1]][this.state.player[0]].length} Winning Matchups
                                                                    </Alert.Heading>
                                                                </Alert>


                                                                {this.state.WinningMatchupMap[this.state.player[1]][this.state.player[0]].map((WinningMatchup, i) => {

                                                                    return (
                                                                        <Accordion>


                                                                            {[Object.keys(WinningMatchup)].map((teamName, x) => {

                                                                                return (

                                                                                    <Accordion.Item eventKey="q">
                                                                                        <Accordion.Header><h5>{teamName} : {WinningMatchup[teamName].length}</h5></Accordion.Header>
                                                                                        <Accordion.Body>
                                                                                        
                                                                                            {WinningMatchup[teamName].map((categoryWon, c) => {
                                                                                                return (
                                                                                                    
                                                                                                    <Badge bg="info">{categoryWon}</Badge>
                                                                                                    
                                                                                                )
                                                                                            })}
                                                                                        

                                                                                        </Accordion.Body>
                                                                                    </Accordion.Item>

                                                                                )
                                                                            })}


                                                                        </Accordion>
                                                                    )
                                                                })}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                            

                                        </div>

                                    </Tab.Content>

                                </Col>

                            </Row>
                            
                        </Tab.Container>


                        :

                        
                            
                        <div>
                            <DropdownButton
                            title="Select Previous Week"
                            onSelect={this.handleSelect}>
                                

                                
                                    {this.props.WeekInformation[0].map((option) => (
                                        <Dropdown.Item eventKey={option}>Week {option}</Dropdown.Item>
                                    ))}
                                 
                            </DropdownButton>
                            
                        </div>
                        
                        
                    }
                </div>

            </div>

        );
    };
}

