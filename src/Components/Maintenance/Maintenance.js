
import React from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import "../../styles/PageStyle.css"
import caruso from "../../caruso.jpeg"

export default class Maintenance extends React.Component {
    
    render() {


        return (


            <div>
                
                

                <Container fluid>
                    <Col>
                        <Row>
                            <Col>
                            <h1>Coming soon</h1>
                            </Col>
                        </Row>
                        <Row>

                            <Col >
                                <img src={caruso}/>
                            </Col>

                        </Row>
                    </Col>

                </Container>

            </div>

        );
    };
}

