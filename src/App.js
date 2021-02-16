import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Container, Nav } from './styled-components'
import './App.css';
import config from './config'
import Dropdown from "react-dropdown";
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import ReactFC from 'react-fusioncharts'
import "./charts-theme.js"
import formatNum from "./format-number"



ReactFC.fcRoot(FusionCharts, Charts)

const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`
class App extends Component {
  constructor() {
    super()
    this.state = {
      items: []
    }
  }

  getData = arg => {
    // google sheet data
    const arr = this.state.items
    const arrLen = arr.length

    // kpi's
    // amazon revenue
    let amRevenue = 0
    // ebay revenue
    let ebRevenue = 0
    // etsy Revenue
    let etRevenue = 0

    let totalRevenue = 0


    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        if (arr[i]["source"] === "AM") {
          amRevenue += parseInt(arr[i].revenue)
        }
      } else if (arr[i]["source"] === "EB") {
        ebRevenue += parseInt(arr[i].revenue)
      } else if (arr[i]["source"] === "ET") {
        etRevenue += parseInt(arr[i].revenue)
      }

         // setting state
      this.setState({
        amRevenue: formatNum(amRevenue)
      })

    }
  }

  updateDashboard = event => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  }

  componentDidMount() {
    fetch(url)
    .then(response => response.json())
    .then(data => {
      let batchRowValues = data.valueRanges[0].values 

      const rows = []

      for (let i = 1; i < batchRowValues.length; i++) {
        let rowObject = {}

        for (let k = 0; k < batchRowValues.length; k++) {
          rowObject[batchRowValues[0][k]] = batchRowValues[i][k]
        }
        rows.push(rowObject)
      }

      let dropdownOptions = []

        for (let i = 0; i < rows.length; i++) {
          dropdownOptions.push(rows[i].month)
        }

        dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();

        this.setState(
          {
            items: rows,
            dropdownOptions: dropdownOptions,
            selectedValue: "Jan 2019"
          },
          () => this.getData("Jan 2019")
        )
  
    })
  }

  render () {
    

    return (
      <Container>
      
          {/* top of page NavBar */}
          <Nav className="nvabar navbar-expand-lg fixed-top is-white is-dark-text">
            <div className="navbar-brand h1 mb-0 text-large font-medium">
              Sales Dashboard 
            </div>
            <div className="navbar-nav ml-auto">
            
            <div className="user-detail-section">
              <span className="pr-2">Hi, Danny</span>
            </div>
            </div>
          </Nav>

          <Nav className="navbar nav-secondary">
            <Container className="text-medium">Summary
            <Dropdown
              className="pr-2 custom-dropdown"
              options={this.state.dropdownOptions}
              onChange={this.updateDashboard}
              value={this.state.selectedValue}
              placeholder="Select an option"
            />
            </Container>
          </Nav>

          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-sm-6">
                <div className="card">
                  <div className="card-heading">
                    <div class='chartFont'>
                      Total Revenue
                    </div>
                  </div>
                  <div className="card-value">
                    <span>$ </span>
                    {this.state.amRevenue}
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* <div className="row">
            <div className="col-md-4 col-lg-3">
              <!-- kpi layout as in previous step -->
            </div>
            <div className="col-md-8 col-lg-9">
              <div className="card">
                <div className="row">
                  <!-- row to include all mini-charts -->
                  <div className="col-sm-4">
                    <div className="chart-container">
                      <!-- chart will come here -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="chart-container full-height">
            <ReactFC
              {...{
                type: "doughnut2d",
                width: "100%",
                height: "100%",
                dataFormat: "json",
                dataSource: {
                  chart: {
                    caption: "Purchase Rate",
                    theme: "ecommerce",
                    defaultCenterLabel: `${this.state.purchaseRate}%`,
                    paletteColors: "#3B70C4, #000000"
                  },
                data: [
                {
                  label: "active",
                  value: `${this.state.purchaseRate}`
                },
                {
                  label: "inactive",
                  alpha: 5,
                  value: `${100 - this.state.purchaseRate}`
                }
                ]
              }
            }}
            />
          </div> */}


          {/* <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="chart-div"></div>
                  <!-- chart will come here -->
              </div>
            </div>
          </div> */}
          


      </Container>
    );
  }
}

export default App;
