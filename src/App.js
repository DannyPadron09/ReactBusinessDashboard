import React from 'react'
import { Container, Nav } from './styled-components'
import './App.css';
import config from './config'
import ReactFC from 'react-fusioncharts';


const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`
class App extends React.Component {
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

    let purchaseRate = 0

    for (let i =0; i < arrLen; i++) {
      if (arg === arg[i]["month"]) {
        purchaseRate += parseInt(arr[i].purchase_rate / 3)
      }
    }

    this.setState({
      purchaseRate: purchaseRate
    })

    // kpi's
    // amazon revenue
    let amRevenue = 0

    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        if (arr[i]["source"] === "AM") {
          amRevenue += parseInt(arr[i].revenue)
        }
      }
    }

    // setting state
    this.setState({
      amRevenue: amRevenue
    })
  }

  componentDidMount() {
    fetch(url).then(response => response.json()).then(data => {
      let batchRowValues = data.valueRanges[0].values 

      const rows = []

      for (let i = 1; i < batchRowValues.length; i++) {
        let rowObject = {}

        for (let k = 0; k < batchRowValues.length; k++) {
          rowObject[batchRowValues[0][k]] = batchRowValues[i][k]
        }
        rows.push(rowObject)
      }

      this.setState({ items: rows })
  
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

          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-sm-6">
                <div className="card">
                  <div className="card-heading">
                    <div>
                      Total Revenue
                    </div>
                  </div>
                  <div className="card-value">
                    <span>$</span>
                    {this.state.amRevenue}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-4 col-lg-3">
              {/* <!-- kpi layout as in previous step --> */}
            </div>
            <div className="col-md-8 col-lg-9">
              <div className="card">
                <div className="row">
                  {/* <!-- row to include all mini-charts --> */}
                  <div className="col-sm-4">
                    <div className="chart-container">
                      {/* <!-- chart will come here --> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-container full-height">
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
          </div>


          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="chart-div"></div>
                  {/* <!-- chart will come here --> */}
              </div>
            </div>
          </div>

          {/* bottom of page NavBar */}
          <Nav className="navbar fixed-bottom nav-secondary is-dark is-light-text">
            <Container className="text-medium">Summary</Container>
          </Nav>


      </Container>
    );
  }
}

export default App;
