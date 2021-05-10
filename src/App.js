
import './App.css';
import React from 'react'
import StatTable from './StatTable.js'
import Maintenance from './Maintenance.js'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  state = {
    isLoading: true
  }


  render() {
    const {Categories, isLoading} = this.state;

    return (
      <div id="Container">
        {/*
            <StatTable></StatTable>
        */}
            <Maintenance></Maintenance>
            
      </div>
    )
  }

}

export default App;