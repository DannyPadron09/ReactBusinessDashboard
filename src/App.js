import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Container, Nav } from './styled-components'
import config from './config'
import Dropdown from "react-dropdown";
import FusionCharts from 'fusioncharts/core'
import Column2D from 'fusioncharts/viz/column2d'
import Doughnut2D from 'fusioncharts/viz/doughnut2d'
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'
import ReactFC from 'react-fusioncharts'
import formatNum from "./format-number"



ReactFC.fcRoot(FusionCharts, Column2D, Doughnut2D, FusionTheme)



const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`
class App extends Component {
  constructor() {
    super()
    this.state = {
      items: [],
      selectedValue: null,
      amRevenue: null,
      ebRevenue: null,
      etRevenue: null,
      totalRevenue: null,
      productViews: null,
      purchaseRate: " ",
      checkoutRate: " ",
      abandonedRate: " ",
      orderTrendStore: []
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

    let productViews = 0
    let purchaseRate= 0
    let checkoutRate = 0
    let abandonedRate = 0
    let orderTrendStore = []
    let selectedValue = null 



    // determines revenue for individual sources
    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        if (arr[i]["source"] === "AM") {
          amRevenue += parseInt(arr[i].revenue)
          orderTrendStore.push({
            label: "Amazon",
            value: arr[i].orders,
            displayValue: `${arr[i].orders} orders`
          })
        } else if (arr[i]["source"] === "EB") {
        ebRevenue += parseInt(arr[i].revenue)
        orderTrendStore.push({
          label: "Ebay",
          value: arr[i].orders,
          displayValue: `${arr[i].orders} orders`
        })
      } else if (arr[i]["source"] === "ET") {
        etRevenue += parseInt(arr[i].revenue)
        orderTrendStore.push({
          label: "Etsy",
          value: arr[i].orders,
          displayValue: `${arr[i].orders} orders`
        })
      }
      productViews += parseInt(arr[i].product_views)
      purchaseRate += parseInt(arr[i].purchase_rate / 3)
      checkoutRate += parseInt(arr[i].checkout_rate / 3)
      abandonedRate += parseInt(arr[i].abandoned_rate / 3)
    }
  }

      totalRevenue = amRevenue + ebRevenue + etRevenue

      selectedValue = arg 

         // setting state
      this.setState({
        amRevenue: formatNum(amRevenue),
        ebRevenue: formatNum(ebRevenue),
        etRevenue: formatNum(etRevenue),
        totalRevenue: formatNum(totalRevenue),
        productViews: formatNum(productViews),
        purchaseRate: purchaseRate,
        checkoutRate: checkoutRate,
        abandonedRate: abandonedRate,
        orderTrendStore: orderTrendStore,
        selectedValue: selectedValue
      })
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
            selectedValue: `${this.state.selectedValue}`
          },
          () => this.getData(`${this.state.selectedValue}`)
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

          {/* Dropdown month selection*/}
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

          {/* Total Revenue display div box*/}
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
                    {this.state.totalRevenue}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*Individual Online Store Div Boxes */}

          {/* Amazon Div Box */}
          <div className="amazon-box">
            <div className="card">
              <div className="card-heading">
                Amazon 
              </div>
              <div className="card-value">
                <span>$ </span>
                {this.state.amRevenue}
              </div>
              <ReactFC
                {...{
                  type: "doughnut2d",
                  width: "400",
                  height: "200",
                  dataFormat: "json",
                  dataSource: {
                    chart: {
                      caption: "Amazon",
                      subCaption: "Purchase Rate",
                      numberPrefix: "$",
                      showLegend: "1",
                      defaultCenterLabel: `${this.state.selectedValue}`,
                      theme: "fusion"
                    },
                    data: [
                      {
                        label: "Product Views",
                        value: `${this.state.productViews}`
                      },
                      {
                        label: "Purchase Rate",
                        value: `${this.state.purchaseRate}`
                      },
                      {
                        label: "Check Out Rate",
                        value: `${this.state.checkoutRate}`
                      },
                      {
                        label: "Abandoned Rate",
                        value: `${this.state.abandonedRate}`
                      }
                    ]
                  }
                }} />
            </div>
          </div>

          {/* Ebay Div Box */}
          <div className="ebay-box">
            <div className="card">
              <div className="card-heading">
                Ebay 
              </div>
              <div className="card-value">
                <span>$ </span>
                {this.state.ebRevenue}
              </div>
              <ReactFC
                {...{
                  type: "doughnut2d",
                  width: "400",
                  height: "200",
                  dataFormat: "json",
                  dataSource: {
                    chart: {
                      caption: "Ebay",
                      subCaption: "Purchase Rate",
                      numberPrefix: "$",
                      showLegend: "1",
                      defaultCenterLabel: `${this.state.selectedValue}`,
                      theme: "fusion"
                    },
                    data: [
                      {
                        label: "Product Views",
                        value: `${this.state.productViews}`
                      },
                      {
                        label: "Purchase Rate",
                        value: `${this.state.purchaseRate}`
                      },
                      {
                        label: "Check Out Rate",
                        value: `${this.state.checkoutRate}`
                      },
                      {
                        label: "Abandoned Rate",
                        value: `${this.state.abandonedRate}`
                      }
                    ]
                  }
                }} />
            </div>
          </div>

          {/* Etsy Div Box */}
          <div className="etsy-box">
            <div className="card">
              <div className="card-heading">
                Etsy 
              </div>
              <div className="card-value">
                <span>$ </span>
                {this.state.etRevenue}
              </div>
              <ReactFC
                {...{
                  type: "doughnut2d",
                  width: "400",
                  height: "200",
                  dataFormat: "json",
                  dataSource: {
                    chart: {
                      caption: "Etsy",
                      subCaption: "Purchase Rate",
                      numberPrefix: "$",
                      showLegend: "1",
                      defaultCenterLabel: `${this.state.selectedValue}`,
                      theme: "fusion"
                    },
                    data: [
                      {
                        label: "Product Views",
                        value: `${this.state.productViews}`
                      },
                      {
                        label: "Purchase Rate",
                        value: `${this.state.purchaseRate}`
                      },
                      {
                        label: "Check Out Rate",
                        value: `${this.state.checkoutRate}`
                      },
                      {
                        label: "Abandoned Rate",
                        value: `${this.state.abandonedRate}`
                      }
                    ]
                  }
                }} />
            </div>
          </div>

          {/* Total Revenue Chart Display */}
          <div className="chart-container full-height">
            <ReactFC
              {...{
                type: "column2d",
                width: "700",
                height: "400",
                dataFormat: "json",
                dataSource: {
                  chart: {
                    caption: "Total Revenue",
                    theme: "fusion",
                    defaultCenterLabel: `${this.state.selectedValue}`,
                  },
                data: [
                  {
                    label: "Amazon",
                    value: `${this.state.amRevenue}`
                  },
                  {
                    label: "Ebay",
                    value: `${this.state.ebRevenue}`
                  },
                  {
                    label: "Etsy",
                    value: `${this.state.etRevenue}`
                  },
                  
                ]
              }
            }}
            />
          </div>



          

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
