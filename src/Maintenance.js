
import React from 'react'
import { Container, Button, Nav, Navbar, Col, Row, Image, Badge } from 'react-bootstrap'
import "./PageStyle.css"
import mickey from './lemickey.jpeg'
import KAT from './KAT.png'

export default class Maintainance extends React.Component {
    
    render() {


        return (


            <div>
                <>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Navbar.Brand>Fantasy Stat Track</Navbar.Brand>
                        </Navbar.Collapse>
                    </Navbar>

                </>
                <br />

                <Container fluid>
                    <Col>

                        <Row>

                            <Col lg={{ span: 6, offset: 3 }}>
                                <Image src={mickey} width="100%" fluid />
                            </Col>

                        </Row>
                    </Col>

                </Container>

            </div>

        );
    };
}

