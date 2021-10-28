import React, { PureComponent } from 'react';
import { BarChart, Bar, LabelList, Cell, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios'
import "../../styles/PageStyle.css"
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default class AverageStats extends PureComponent {
  
  constructor(props) {
    super(props);


    //Categories being used in league
    //Player team names
    //DataArray: Team statistics for a given team, value of all categories
    this.state = {


        Average: [],
        player: "",
        AllData: this.props.TeamCompareInformation[0],
        graphData: [],
        category: [],
        hold: [],
        AverageData: [],
        selectedCategory: this.props.TeamCompareInformation[1]


    };

    this.getChartDataForCategory = this.getChartDataForCategory.bind(this);
    this.handleSelect = this.handleSelect.bind(this)

}

async componentWillReceiveProps(newProps) {
    await this.setState({selectedCategory : newProps["TeamCompareInformation"][1]})
    this.getChartDataForCategory()

}
async componentDidMount() { //get all data needed
    
    var bodyFormData = new FormData();
    bodyFormData.append("data", JSON.stringify(this.state.AllData))

    await axios.get(global.config.apiEndpoint.production + "/category")
      .then((response) => {
        this.setState({hold : JSON.stringify(response.data)})
      })

    var cat = JSON.parse(this.state.hold)
    
    var dict = []
    for (var x in cat) {
      dict.push(cat[x])
    }
    
    await this.setState({category : dict})

    //count of winning matchups
    await axios.post(global.config.apiEndpoint.production + '/average', bodyFormData)

        .then((response) => {
            this.setState({ WinningHolder: JSON.stringify(response.data) })
        })


    
    var obj = JSON.parse(this.state.WinningHolder) //{Team : Array of WinningMatchupMap Matchups}

    await this.setState({AverageData : obj})

    this.getChartDataForCategory("3PTM")
    
}

async getChartDataForCategory() {
  var categorySelected = this.state.selectedCategory
  await this.setState({selectedCategory : categorySelected})
  var dataArray = []
    for (var key in this.state.AllData) {
        for (var team in this.state.AllData[key]) {
            
            var newDict = {}
            newDict["name"] = team
            newDict["value"] = parseFloat(this.state.AllData[key][team][categorySelected])
            
            dataArray.push(newDict)
        }
        
    }

    
    await this.setState({graphData : dataArray})
    await this.setState({Average : this.state.AverageData[categorySelected]})
    
}

async assignPlayer(player1, i) {

    await this.setState({ player: [player1, i] })
    await this.topPerformers(this.state.player[0])

}

async handleSelect(e) {
  
  this.getChartDataForCategory(e)
}
  render() {

   
    return (
      <div>
        
        <div style={{ width: '100%', height: 700 }}>
        {this.state.graphData.length === 0 && this.state.category.length === 0 ? 


            null
            :
            <div style={{ width: '100%', height: 700 }}>
              
            
              <h1>Average for {this.state.selectedCategory} : {this.state.Average}</h1>
            <ResponsiveContainer>
        <BarChart
        width={700}
        height={700}
        data={this.state.graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
          
        <YAxis label={{value: 'Category Value', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        
        <ReferenceLine y={this.state.Average} label="Average" stroke="red" />
        <Bar dataKey="value" fill="#82ca9d">
          <LabelList dataKeu="value" position="top" />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
      </div>
  }
      </div>

      </div>
    );
  }
}
