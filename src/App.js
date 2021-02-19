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
      ordersTrendStore: []
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
    let ordersTrendStore = []
    let selectedValue = null 



    // determines revenue for individual sources
    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        if (arr[i]["source"] === "AM") {
          amRevenue += parseInt(arr[i].revenue)
          ordersTrendStore.push({
            label: "Amazon",
            value: arr[i].orders,
            displayValue: `${arr[i].orders}`,
          })
        } else if (arr[i]["source"] === "EB") {
        ebRevenue += parseInt(arr[i].revenue)
        ordersTrendStore.push({
          label: "Ebay",
          value: arr[i].orders,
          displayValue: `${arr[i].orders}`,
        })
      } else if (arr[i]["source"] === "ET") {
        etRevenue += parseInt(arr[i].revenue)
        ordersTrendStore.push({
          label: "Etsy",
          value: arr[i].orders,
          displayValue: `${arr[i].orders}`
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
        ordersTrendStore: ordersTrendStore,
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

          {/* Store Revenue Boxes */}

          <div className="amazon-box">
            <div className="card">
              <div className="card-heading">
                Revenue from Amazon 
              </div>
              <div className="card-value">
                <span>$ {this.state.amRevenue} </span>
              </div>
            </div>
          </div>

          {/* Amazon Div Box */}
          <div className="purchase-rate-box">
            <div className="card">
              <div className="card-heading">
              </div>
              <div className="card-value">
                <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "400",
                          height: "200",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Purchase Rate",
                              theme: "fusion",
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
              
            </div>
          </div>

          {/* Ebay Div Box */}
          <div className="checkout-rate-box">
            <div className="card">
              <div className="card-heading">
              </div>
              <div className="card-value">
              <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "400",
                          height: "200",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Checkout Rate",
                              theme: "fusion",
                              defaultCenterLabel: `${this.state.checkoutRate}%`,
                              paletteColors: "#3B70C4, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `${this.state.checkoutRate}`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${100 - this.state.checkoutRate}`
                              }
                            ]
                          }
                        }}
                      />
              </div>
            </div>
          </div>

          {/* Etsy Div Box */}
          <div className="etsy-box">
            <div className="card">
              <div className="card-heading">
              </div>
              <div className="card-value">
              <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "400",
                          height: "200",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Abandoned Cart Rate",
                              theme: "fusion",
                              defaultCenterLabel: `${this.state.abandonedRate}%`,
                              paletteColors: "#3B70C4, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `${this.state.abandonedRate}`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${100 - this.state.abandonedRate}`
                              }
                            ]
                          }
                        }}
                      />
              </div>
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
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "fusion",
                          caption: "Orders Trend",
                          subCaption: "By Stores"
                        },
                        data: this.state.ordersTrendStore
                      }
                    }}
                  />
          </div>

      </Container>
    );
  }
}

export default App;
