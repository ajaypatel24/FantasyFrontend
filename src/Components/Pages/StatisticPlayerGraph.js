import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "FG%",
    uv: 4000,
    amt: 2400,
  },
  {
    name: "FT%",
    uv: -3000,

    amt: 2210,
  },
  {
    name: "3PTM",
    uv: -2000,

    amt: 2290,
  },
  {
    name: "PTS",
    uv: 2780,

    amt: 2000,
  },
  {
    name: "REB",
    uv: -1890,

    amt: 2181,
  },
  {
    name: "AST",
    uv: 2390,

    amt: 2500,
  },
  {
    name: "ST",
    uv: 3490,

    amt: 2100,
  },
  {
    name: "BLK",
    uv: 3490,

    amt: 2100,
  },
  {
    name: "TO",
    uv: -3490,

    amt: 2100,
  },
];

export default class Example extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/s/bar-chart-with-positive-negative-i3b8b";

  render() {
    return (
      <div style={{ width: "100%", height: 700 }}>
        <ResponsiveContainer>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
