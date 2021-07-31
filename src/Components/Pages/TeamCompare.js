
import React from 'react'
import { Image, Col, Row, Badge, ListGroup, Tab, Accordion, Figure, Alert } from 'react-bootstrap'
import axios from 'axios'
import "../../styles/PageStyle.css"
import PlayerData from "../../PlayerData/PlayerData.json"


export default class TeamCompare extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            LeaderPlayer: [],
            player: [],
            TopPlayers: [],
            TopCategories: [],
            PlayerName: [],
            Winning: [],
            AllData: this.props.TeamCompareInformation[0],
            WinningHolder: [],
            loadingComplete: false

        };

    }

    async componentDidMount() { //get all data needed
        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))

        await axios.post('/winning-matchups', bodyFormData)

            .then((response) => {
                this.setState({ WinningHolder: JSON.stringify(response.data) })
            })

        await axios.post('/win-calculator', bodyFormData)

            .then((response) => {
                this.setState({ Leaders: JSON.stringify(response.data) })
            })


        var arr = [] //usable object that can be mapped
        var obj = JSON.parse(this.state.WinningHolder)
        var PlayerList = Object.keys(obj)


        for (var i in PlayerList) {
            var x = {}
            x[PlayerList[i]] = obj[PlayerList[i]]
            arr.push(x)
        }


        await this.setState({ Winning: arr })
        await this.setState({ LeaderPlayer: PlayerList })

        arr = []
        var leaderKeys = JSON.parse(this.state.Leaders)
        var categoryArray = []


        for (var i in leaderKeys) {
            categoryArray.push(i)
            arr.push(leaderKeys[i])
        }

        await this.setState({ AllLeader: arr })
        await this.setState({ Categories: categoryArray })


        await this.setState({ WinningHolder: [] })
        var tempArray = []
        this.state.Winning.map((item, i) => {
            tempArray.push(item[this.state.LeaderPlayer[i]].length)
        })

        await this.setState({ WinningHolder: tempArray })

        await this.assignPlayer(this.state.LeaderPlayer[0], 0)
        await this.setState({ loadingComplete: true })


    }



    async topPerformers(team) {
        var bodyFormData = new FormData();

        bodyFormData.append("team", JSON.stringify(team))

        await axios.post('/TopPerformers', bodyFormData)
            .then(response => {
                this.setState({ TopPlayers: JSON.stringify(response.data) })
            })

        var obj = JSON.parse(this.state.TopPlayers)
        var ranking = {}
        for (var i = 0; i < this.state.AllLeader.length - 1; i++) {
            if (this.state.Categories[i].valueOf() === new String("FG%").valueOf() || this.state.Categories[i].valueOf() === new String("FT%").valueOf()) {
                continue;
            }

            for (var j = 0; j < this.state.AllLeader.length - 1; j++) {
                if (this.state.AllLeader[i][j][0] === team) {
                    ranking[this.state.Categories[i]] = j + 1
                }
            }

        }

        ranking = Object.entries(ranking).sort((a, b) => a[1] - b[1]).map(el => el[0])

        var topThreePlayers = []
        var topThreeCategories = []

        for (var x = 0; x < 3; x++) {
            topThreePlayers.push(obj[ranking[x]])
            topThreeCategories.push(ranking[x])
        }

        var ImgString = []
        var PlayerNameArray = []
        var playerId = []
        for (var t = 0; t < topThreePlayers.length; t++) { //find all player images
            for (var i = 0; i < PlayerData["league"]["standard"].length; i++) {
                if (PlayerData["league"]["standard"][i]["firstName"] === topThreePlayers[t]["PlayerFirst"]
                    && PlayerData["league"]["standard"][i]["lastName"] === topThreePlayers[t]["PlayerLast"]) {
                    playerId.push(PlayerData["league"]["standard"][i]["personId"])
                    break
                }
            }
        }

        for (var y = 0; y < topThreePlayers.length; y++) { //build image src strings
            let val = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" + playerId[y] + ".png"
            ImgString.push(val)
            PlayerNameArray.push(topThreePlayers[y]["PlayerFirst"] + " " + topThreePlayers[y]["PlayerLast"])
        }

        await this.setState({ TopPlayers: ImgString })
        await this.setState({ PlayerName: PlayerNameArray })
        await this.setState({ TopCategories: topThreeCategories })

    }

    async assignPlayer(player1, i) {

        await this.setState({ player: [player1, i] })
        await this.topPerformers(this.state.player[0])

    }



    render() {


        return (

            <div>

                <div>

                    {this.state.loadingComplete === true ?
                        <Tab.Container defaultActiveKey={this.state.LeaderPlayer[0]}>
                            <Row>
                                <Col sm={3}>

                                    <ListGroup>

                                        {this.state.Winning.map((item, i) => {
                                            return (

                                                <ListGroup.Item eventKey={this.state.LeaderPlayer[i]} onClick={() => this.assignPlayer(this.state.LeaderPlayer[i], i)}><h4>{this.state.LeaderPlayer[i]}</h4></ListGroup.Item>

                                            )
                                        })}
                                    </ListGroup>
                                </Col>

                                <Col sm={9}>

                                    <Tab.Content>

                                        <div>

                                            {this.state.TopPlayers.length !== 0 ?

                                                <Row>

                                                    <Col>

                                                        <Row>

                                                        </Row>
                                                        <Row>
                                                            <h4>Top Performers</h4>

                                                        </Row>
                                                        <br />
                                                        <Row className="align-items-center">
                                                            {[0, 1, 2].map((index, i) => {
                                                                return (
                                                                    <Col>

                                                                        <Col>
                                                                            <Badge style={{ fontSize: '1.2rem' }} bg="secondary">{this.state.TopCategories[i]}</Badge>
                                                                        </Col>
                                                                        <Row>
                                                                            <Figure>
                                                                                <Figure.Image height='80%'
                                                                                    width='80%' style={{ alignSelf: 'center' }} src={this.state.TopPlayers[i]} />
                                                                                <figcaption style={{ fontSize: '1rem' }}><strong>{this.state.PlayerName[i]}</strong></figcaption>
                                                                            </Figure>
                                                                        </Row>

                                                                    </Col>
                                                                )
                                                            })}

                                                        </Row>

                                                        <Row>
                                                            <Col >
                                                                <br />
                                                                
                                                                <Alert variant="primary">
                                                                    <Alert.Heading>
                                                                    {this.state.Winning[this.state.player[1]][this.state.player[0]].length} Winning Matchups 
                                                                    </Alert.Heading>
                                                                </Alert>
                                                                
                                                                
                                                                {this.state.Winning[this.state.player[1]][this.state.player[0]].map((item, i) => {

                                                                    return (
                                                                        <Accordion>


                                                                            {[Object.keys(item)].map((q, x) => {

                                                                                return (

                                                                                    <Accordion.Item eventKey="q">
                                                                                        <Accordion.Header><h5>{q} : {item[q].length}</h5></Accordion.Header>
                                                                                        <Accordion.Body>





                                                                                            {item[q].map((r, c) => {
                                                                                                return (
                                                                                                    <p>{r}</p>
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

                                                :

                                                null

                                            }

                                        </div>

                                    </Tab.Content>

                                </Col>

                            </Row>
                        </Tab.Container>


                        :

                        null
                    }
                </div>

            </div>

        );
    };
}

