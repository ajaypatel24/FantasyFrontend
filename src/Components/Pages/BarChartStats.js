import React from "react";
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Tab, Col, Row, Tabs, Table, Figure } from "react-bootstrap";
import "../../styles/PageStyle.css";

export default class BarChartStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category_won: [],
      graphData: null,
      average: 0.0,
    };
  }

  componentDidMount() {
    console.log(this.props);
    var graphDataArray = [];
    var sum = 0;
    for (var x in this.props.data) {
      console.log(x, this.props.data[x]);
      var graphDataObj = {};
      graphDataObj["name"] = x;
      graphDataObj["value"] = this.props.data[x];
      sum += this.props.data[x];
      graphDataArray.push(graphDataObj);
    }

    this.setState({ average: (sum / graphDataArray.length).toFixed(3) });
    this.setState({ graphData: graphDataArray });
    console.log(graphDataArray);
  }

  render() {
    return (
      <Tab.Pane eventKey={this.props.dataindex}>
        {this.state.graphData === null ? null : (
          <div style={{ width: "100%", height: 700 }}>
            <h2>
              {this.props.item} Average: {this.state.average}
            </h2>
            <ResponsiveContainer>
              <BarChart
                width={700}
                height={700}
                data={this.state.graphData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />

                <YAxis
                  label={{
                    value: "Category Value",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />

                <ReferenceLine
                  y={this.state.average}
                  label="Average"
                  stroke="red"
                />
                <Bar dataKey="value" fill="#82ca9d">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Tab.Pane>
    );
  }
}
