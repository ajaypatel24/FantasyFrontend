import React from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import "../../styles/PageStyle.css";

export default class Prediction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      PredictionResponse: [],
      Prediction: [],
      CurrentWeek: "",
    };
  }

  async componentDidMount() {
    //endpoint to get the prediciton without large calculation
    await axios
      .get(global.config.apiEndpoint.production + "/prediction-fast")
      .then((response) => {
        this.setState({ PredictionResponse: JSON.stringify(response.data) });
      });

    var jsonParsePrediction = JSON.parse(this.state.PredictionResponse);
    await this.setState({ Prediction: jsonParsePrediction });

    await axios
      .get(global.config.apiEndpoint.production + "/week")
      .then((response) => {
        this.setState({ CurrentWeek: JSON.stringify(response.data) });
      });
  }

  render() {
    return (
      <Col>
        <h1 style={{ textAlign: "center" }}>
          Predictions are not working right now
        </h1>
        {/*
        <h1 style={{ textAlign: "center" }}>
          Matchup Predictions Week {this.state.CurrentWeek}
        </h1>
        
        <h6 style={{ textAlign: "center" }}>
          Not enough data yet for this to be close to accurate
        </h6>
      */}

        <h3 style={{ textAlign: "center" }}>
          Coming back soon, working on fix...
        </h3>
        {/*
        {this.state.Prediction.length !== 0 ? (
          <ListGroup>
            <Row>
              {this.state.Prediction.map((item, i) => {
                return (
                  <Col key={i} lg={6}>
                    <ListGroup.Item variant="secondary">
                      <h3 style={{ textAlign: "center" }}>
                        {Object.keys(item)[0]} vs. {Object.keys(item)[1]}{" "}
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <h4 style={{ textAlign: "center" }}>
                        {item[Object.keys(item)[0]][0]} -{" "}
                        {item[Object.keys(item)[1]][0]}
                      </h4>
                    </ListGroup.Item>

                    {Object.keys(item[Object.keys(item)[0]][1]).map(
                      (category, z) => {
                        return (
                          <ListGroup.Item
                            key={z}
                            style={{ textAlign: "center" }}
                          >
                            <Row>
                              { bold categories that are greater on one side }
                              <Col lg={4} md={4} xs={4}>
                                {(item[Object.keys(item)[0]][1][category] >
                                  item[Object.keys(item)[1]][1][category] &&
                                  category !== "TO") ||
                                (item[Object.keys(item)[0]][1][category] <
                                  item[Object.keys(item)[1]][1][category] &&
                                  category === "TO") ? (
                                  <strong>
                                    <i>
                                      {item[Object.keys(item)[0]][1][category]}
                                    </i>
                                  </strong>
                                ) : (
                                  <p>
                                    {item[Object.keys(item)[0]][1][category]}
                                  </p>
                                )}
                              </Col>

                              <Col lg={4} md={4} xs={4}>
                                <h5>
                                  <strong>{category}</strong>
                                </h5>
                              </Col>
                              <Col lg={4} md={4} xs={4}>
                                {(item[Object.keys(item)[0]][1][category] <
                                  item[Object.keys(item)[1]][1][category] &&
                                  category !== "TO") ||
                                (item[Object.keys(item)[0]][1][category] >
                                  item[Object.keys(item)[1]][1][category] &&
                                  category === "TO") ? (
                                  <strong>
                                    <i>
                                      {item[Object.keys(item)[1]][1][category]}
                                    </i>
                                  </strong>
                                ) : (
                                  <p>
                                    {item[Object.keys(item)[1]][1][category]}
                                  </p>
                                )}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        );
                      }
                    )}

                    <br />
                  </Col>
                );
              })}
            </Row>
          </ListGroup>
        ) : null} */}
      </Col>
    );
  }
}
