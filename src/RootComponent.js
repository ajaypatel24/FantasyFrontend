
import React from 'react'
import { Container, Button, Nav, Navbar, Col, Row, Spinner } from 'react-bootstrap'
import axios from 'axios'
import "./styles/PageStyle.css"
import "./styles/App.css"
import { HashRouter, Route, Switch } from 'react-router-dom'
import Leaders from "./Components/Pages/Leaders"
import Prediction from "./Components/Pages/Prediction"
import TeamCompare from "./Components/Pages/TeamCompare"
import CurrentStats from "./Components/Pages/CurrentStats"


export default class RootComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            rawDataFromResponse: "",
            dataArray: [],
            Players: [],
            Categories: [],
            AllData: [],
            LoadingButton: true,

        };

        this.refresh = this.refresh.bind(this)
        this.getPrediction = this.getPrediction.bind(this)

    }




    async componentDidMount() {

        await axios.get('https://react-flask-fantasy.herokuapp.com/test')
            .then(response => {
                this.setState({ rawDataFromResponse: JSON.stringify(response.data) })
            })

        var arr = []
        var obj = JSON.parse(this.state.rawDataFromResponse)
        var dataKeySet = Object.keys(obj)

        var catArray = []

        for (var key in dataKeySet) {
            var w = {}
            w[dataKeySet[key]] = obj[dataKeySet[key]]
            arr.push(w)
        }

        await this.setState({ AllData: arr })

        for (var x in (arr[0][dataKeySet[0]])) {
            catArray.push(x)
        }

        await this.setState({ Players: dataKeySet })
        await this.setState({ dataArray: arr })
        await this.setState({ Categories: catArray })


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
                
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Container fluid>
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
                        </Container>
                    </Navbar>

                
                <br />

                <Container fluid>
                    <Col>
                        <Row>
                            {
                                this.state.LoadingButton === false ?


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

                                    <Container fluid>
                                    <Spinner animation="border">  </Spinner>
                                    </Container>

                            }


                        </Row>
                    </Col>
                </Container>





            </div>



        );
    };
}

