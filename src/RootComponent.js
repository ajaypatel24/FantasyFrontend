
import React from 'react'
import { Image, Spinner, Card, CardGroup, Container, Button, Table, ButtonGroup, Nav, Navbar, Form, FormControl, ToggleButton, Col, Row, Badge, Alert, DropdownButton, Dropdown, Jumbotron, ListGroup, CardDeck, CardColumns, ListGroupItem } from 'react-bootstrap'
import axios from 'axios'
import "./PageStyle.css"
import PlayerData from "./PlayerData.json"
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import { HashRouter, Redirect, Route, Switch, Link } from 'react-router-dom'
import Leaders from "./Components/Leaders"
import Prediction from "./Components/Prediction"
import TeamCompare from "./Components/TeamCompare"
import CurrentStats from "./Components/CurrentStats"


export default class RootComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            p: "",
            player: "",
            TopPlayers: [],
            dataArray: [],
            PlayerName: [],
            Players: [],
            Categories: [],
            AllData: [],
            Leaders: [],
            f: [],
            Prediction: [],
            Winning: [],
            Integer: 1,
            LeaderPlayer: [],
            AccessBoolean: [false, false, false, false],
            LoadingButton: true,
            AllLeader: [],
            keys: [],
            Tester: []

        };

        this.refresh = this.refresh.bind(this)
        this.getPrediction = this.getPrediction.bind(this)

    }




    async componentDidMount() {

        await axios.get('/test')
            .then(response => {
                this.setState({ p: JSON.stringify(response.data) })
            })


        await axios.get('/prediction-fast')
            .then(response => {
                this.setState({ Prediction: JSON.stringify(response.data) })
            })


        var obj2 = JSON.parse(this.state.Prediction)
        await this.setState({ Prediction: obj2 })

        var arr = []
        var obj = JSON.parse(this.state.p)
        var g = Object.keys(obj)

        var catArray = []

        for (var i in g) {
            var w = {}
            w[g[i]] = obj[g[i]]
            arr.push(w)
        }

        this.setState({ AllData: arr })

        for (var x in (arr[0][g[0]])) {
            catArray.push(x)
        }

        console.log(JSON.stringify(this.state.AllData))

        this.setState({ Players: g })
        this.setState({ dataArray: arr })
        this.setState({ Categories: catArray })
        var accessArr = [true, false, false, false]
        await this.setState({
            AccessBoolean: accessArr,
        })

        this.setState({
            LoadingButton: false
        })

    }




    async getPrediction(e) {
        /*
        await axios.get('/predict')
        .then(response => {
            this.setState({ Prediction: JSON.stringify(response.data) })
        })

        console.log(this.state.Prediction)
        var arr = []
        var obj = JSON.parse(this.state.Prediction)
        console.log(obj)
        await this.setState({ Prediction: obj })
        await this.setState({ Tester: this.state.Prediction[0]})
        console.log(this.state.Prediction)
        */
        this.showContent(e)
    }


    refresh() {
        window.location.reload(false)
    }


    render() {
        let currentStatInformation = [
            this.state.Categories,
            this.state.dataArray,
            this.state.Players
        ]

        let leaderInformation = [
            this.state.Categories,
            this.state.AllData,
        ]

        let teamCompareInformation = [
            this.state.AllData
        ]

        return (


            <div>
                <>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Navbar.Brand>Fantasy Stat Track</Navbar.Brand>
                            <Nav className="mr-auto">

                                <Button href="#/" variant="dark" id="0" >Home</Button>
                                <Button href="#/Leaders" variant="dark" id="1" >Leaders</Button>
                                <Button href="#/Compare" variant="dark" id="2" >Team vs Other Teams</Button>
                                <Button href="#/Prediction" variant="dark" id="3" >Predictions</Button>
                            </Nav>

                        </Navbar.Collapse>
                    </Navbar>

                </>
                <br />

                <Container fluid>
                    <Col>
                        <Row>
                            {
                                this.state.dataArray.length !== 0 &&
                                    this.state.Players.length !== 0 &&
                                    this.state.Categories.length !== 0 ?


                                    <HashRouter>
                                        <Switch>
                                            <Route exact path="/Leaders" render={(props) => (
                                                <Leaders {...props} LeaderInformation={leaderInformation} />)}
                                            />

                                            <Route exact path="/Compare" render={(props) => (
                                                <TeamCompare {...props} TeamCompareInformation={teamCompareInformation} />)}
                                            />
                                            <Route exact path="/Prediction" component={Prediction} />
                                            <Route path="/" render={(props) => (
                                                <CurrentStats {...props} CurrentStatInformation={currentStatInformation} />)}
                                            />
                                        </Switch>

                                    </HashRouter>


                                    :

                                    null

                            }


                        </Row>
                    </Col>
                </Container>





            </div>



        );
    };
}

