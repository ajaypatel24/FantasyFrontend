
import React from 'react'
import { Image, Spinner, Card, CardGroup, Container, Button, Table, ButtonGroup, Nav, Navbar, Form, FormControl, ToggleButton, Col, Row, Badge, Alert, DropdownButton, Dropdown, Jumbotron, ListGroup, CardDeck, CardColumns, ListGroupItem } from 'react-bootstrap'
import axios from 'axios'
import "../PageStyle.css"
import PlayerData from "../PlayerData.json"
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';

export default class TeamCompare extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            LeaderPlayer: [],
            player: [],
            TopPlayers: [],
            PlayerName: [],
            Winning: [],
            AllData: this.props.TeamCompareInformation[0],
            WinningHolder: []
            //LeaderPlayer
            //player
            //TopPlayers
            //PlayerName

        };



    }

    async componentDidMount() {
        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))

        await axios.post('/winning-matchups', bodyFormData)

            .then((response) => {

                this.setState({ WinningHolder: JSON.stringify(response.data) })
            })




        var arr = []
        var obj = JSON.parse(this.state.WinningHolder)
        var PlayerList = Object.keys(obj)


        for (var i in PlayerList) {
            var x = {}

            x[PlayerList[i]] = obj[PlayerList[i]]
            arr.push(x)
        }

        await this.setState({ Winning: arr })
        await this.setState({ LeaderPlayer: PlayerList })

        console.log(this.state.Winning)
        console.log(this.state.LeaderPlayer)

        var bodyFormData = new FormData();
        bodyFormData.append("data", JSON.stringify(this.state.AllData))
        await axios.post('/win-calculator', bodyFormData)

            .then((response) => {
                this.setState({ Leaders: JSON.stringify(response.data) })
            })

        var arr = []
        var cat = []
        var obj = JSON.parse(this.state.Leaders)

        for (var i in obj) {
            cat.push(i)
            arr.push(obj[i])
        }

        await this.setState({ AllLeader: arr })
        await this.setState({ Categories: cat })

        console.log(this.state.AllLeader)
        console.log(this.state.Categories)

    }

    async topPerformers(team) {
        var bodyFormData = new FormData();
        console.log(team)
        bodyFormData.append("team", JSON.stringify(team))

        await axios.post('/TopPerformers', bodyFormData)
            .then(response => {
                this.setState({ TopPlayers: JSON.stringify(response.data) })
            })

        console.log(this.state.TopPlayers)
        var obj = JSON.parse(this.state.TopPlayers)
        console.log(obj)

        console.log(this.state.AllLeader)
        //console.log(this.state.Categories)
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

        console.log(ranking)

        ranking = Object.entries(ranking).sort((a, b) => a[1] - b[1]).map(el => el[0])

        console.log(ranking)

        var topThreePlayers = []
        for (var x = 0; x < 3; x++) {
            topThreePlayers.push(obj[ranking[x]])

            obj[ranking[x]]["Category"] = ranking[x]
        }


        console.log(topThreePlayers)

        console.log(obj)



        var ImgString = []
        var PlayerNameArray = []
        var playerId = []
        for (var t = 0; t < topThreePlayers.length; t++) {
            for (var i = 0; i < PlayerData["league"]["standard"].length; i++) {
                if (PlayerData["league"]["standard"][i]["firstName"] === topThreePlayers[t]["PlayerFirst"]) {
                    playerId.push(PlayerData["league"]["standard"][i]["personId"])
                    break
                }
            }
        }



        for (var y = 0; y < topThreePlayers.length; y++) {
            let val = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" + playerId[y] + ".png"
            ImgString.push(val)
            PlayerNameArray.push(topThreePlayers[y]["PlayerFirst"] + " " + topThreePlayers[y]["PlayerLast"])
        }

        console.log(typeof (ImgString))

        await this.setState({ TopPlayers: ImgString })
        await this.setState({ PlayerName: PlayerNameArray })

        console.log(typeof (this.state.TopPlayers))

        console.log(PlayerData["league"]["standard"][0]["firstName"])



    }

    async assignPlayer(player1, i) {
        await this.setState({ player: [player1, i] })
        console.log(this.state.Winning[this.state.player[1]][this.state.player[0]])
        console.log(this.state.player[0])
        await this.topPerformers(this.state.player[0])

        console.log(this.state.TopPlayers)
    }



    render() {


        return (



            <div>
                <h1 style={{ textAlign: 'center' }}>Is your Team Bad?</h1>
                <div>




                    <DropdownButton title="Select Team">
                        {this.state.Winning.map((item, i) => {
                            return (
                                <Dropdown.Item eventKey={this.state.LeaderPlayer[i]} onClick={() => this.assignPlayer(this.state.LeaderPlayer[i], i)}>{this.state.LeaderPlayer[i]}</Dropdown.Item>
                            )
                        })}
                    </DropdownButton>


                    {this.state.player != "" ?

                        <div>


                            <Badge className="OtherTeam" variant="secondary" style={{ fontSize: '1.2rem' }}>{this.state.player[0]} : {this.state.player[1]} Teams</Badge>


                            <div>

                                {this.state.TopPlayers.length !== 0 ?

                                    <Row>
                                        <Col>
                                            <Row>
                                                <Col lg={4} xs={6} md={4}>

                                                    <Image src={this.state.TopPlayers[0]} fluid />
                                                    <figcaption>{this.state.PlayerName[0]}</figcaption>
                                                </Col>
                                                <Col lg={4} xs={6} md={4}>
                                                    <Image src={this.state.TopPlayers[1]} fluid />
                                                    <figcaption>{this.state.PlayerName[1]}</figcaption>
                                                </Col>
                                                <Col lg={4} xs={6} md={4}>
                                                    <Image src={this.state.TopPlayers[2]} fluid />
                                                    <figcaption>{this.state.PlayerName[2]}</figcaption>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <ListGroup horizontal>







                                                    {this.state.Winning[this.state.player[1]][this.state.player[0]].map((item, i) => {

                                                        return (
                                                            <CardGroup class="col d-flex justify-content-center">

                                                                {[Object.keys(item)].map((q, x) => {

                                                                    return (
                                                                        <Card style={{ width: '18rem' }}>
                                                                            <Card.Header>{q}</Card.Header>

                                                                            <Card.Body>

                                                                                {item[q].map((r, c) => {
                                                                                    return (
                                                                                        <p>{r}</p>
                                                                                    )
                                                                                })}

                                                                            </Card.Body>

                                                                        </Card>

                                                                    )
                                                                })}

                                                            </CardGroup>
                                                        )
                                                    })}
                                                </ListGroup>
                                            </Row>
                                        </Col>
                                    </Row>

                                    :

                                    <p></p>


                                }



                            </div>





                        </div>


                        :

                        <span></span>

                    }



                </div>
            </div>



        );
    };
}

