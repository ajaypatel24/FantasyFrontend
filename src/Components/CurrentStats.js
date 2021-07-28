
import React from 'react'
import { Image, Spinner, Card, CardGroup, Container, Button, Table, ButtonGroup, Nav, Navbar, Form, FormControl, ToggleButton, Col, Row, Badge, Alert, DropdownButton, Dropdown, Jumbotron, ListGroup, CardDeck, CardColumns, ListGroupItem } from 'react-bootstrap'
import axios from 'axios'
import "../PageStyle.css"
import PlayerData from "../PlayerData.json"
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';

export default class CurrentStats extends React.Component {
    constructor(props) {
        super(props);


        this.state = {


            Categories: this.props.CurrentStatInformation[0],
            dataArray: this.props.CurrentStatInformation[1],
            Players: this.props.CurrentStatInformation[2]


        };



    }


    async componentDidMount() {
        console.log(this.state.Categories)
        console.log(this.state.dataArray)
        console.log(this.state.Players)
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

