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
      orderTrendStoreAmazon: [{
        amProductViews: null,
        amPurchaseRate: " ",
        amCheckoutRate: " ",
        amAbandonedRate: " "
      }],
      orderTrendStoreEbay: [{
        ebProductViews: null,
        ebPurchaseRate: " ",
        ebCheckoutRate: " ",
        ebAbandonedRate: " "
      }],
      orderTrendStoreEtsy: [{
        etProductViews: null,
        etPurchaseRate: " ",
        etCheckoutRate: " ",
        etAbandonedRate: " "
      }]
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

    // let productViews = 0
    // let purchaseRate= 0
    // let checkoutRate = 0
    // let abandonedRate = 0
    let orderTrendStoreAmazon = [{
      amProductViews: 0,
      amPurchaseRate: 0,
      amCheckoutRate: 0,
      amAbandonedRate: 0
    }]

    let orderTrendStoreEbay = [{
      ebProductViews: 0,
      ebPurchaseRate: 0,
      ebCheckoutRate: 0,
      ebAbandonedRate: 0
    }]

    let orderTrendStoreEtsy = [{
      etProductViews: 0,
      etPurchaseRate: 0,
      etCheckoutRate: 0,
      etAbandonedRate: 0
    }]
    let selectedValue = null 



    // determines revenue for individual sources
    for (let i = 0; i < arrLen; i++) {
      if (arg === arr[i]["month"]) {
        if (arr[i]["source"] === "AM") {
          amRevenue += parseInt(arr[i].revenue)
          orderTrendStoreAmazon.push({
            label: "Amazon",
            value: arr[i].orders,
            displayValue: `${arr[i].orders}`,
            amProductViews: `${arr[i].product_views}`,
            amPurchaseRate: `${arr[i].purchase_rate}`,
            amCheckoutRate: `${arr[i].checkout_rate}`,
            amAbandonedRate: `${arr[i].abandoned_rate}`
          })
        } else if (arr[i]["source"] === "EB") {
        ebRevenue += parseInt(arr[i].revenue)
        orderTrendStoreEbay.push({
          label: "Ebay",
          value: arr[i].orders,
          displayValue: `${arr[i].orders}`,
          ebProductViews: `${arr[i].product_views}`,
          ebPurchaseRate: `${arr[i].purchase_rate}`,
          ebCheckoutRate: `${arr[i].checkout_rate}`,
          ebAbandonedRate: `${arr[i].abandoned_rate}`
        })
      } else if (arr[i]["source"] === "ET") {
        etRevenue += parseInt(arr[i].revenue)
        orderTrendStoreEtsy.push({
          label: "Etsy",
          value: arr[i].orders,
          displayValue: `${arr[i].orders}`
        })
      }
      orderTrendStoreAmazon.amProductViews = arr[i].product_views
      orderTrendStoreAmazon.amPurchaseRate = arr[i].purchase_rate
      orderTrendStoreAmazon.amCheckoutRate = arr[i].checkout_rate
      orderTrendStoreAmazon.amAbandonedRate = arr[i].abandoned_rate
      orderTrendStoreEbay.ebProductViews = arr[i].product_views
      orderTrendStoreEbay.ebPurchaseRate = arr[i].purchase_rate
      orderTrendStoreEbay.ebCheckoutRate = arr[i].checkout_rate
      orderTrendStoreEbay.ebAbandonedRate = arr[i].abandoned_rate
      // productViews += parseInt(arr[i].product_views)
      // purchaseRate += parseInt(arr[i].purchase_rate / 3)
      // checkoutRate += parseInt(arr[i].checkout_rate / 3)
      // abandonedRate += parseInt(arr[i].abandoned_rate / 3)
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
        // productViews: formatNum(productViews),
        // purchaseRate: purchaseRate,
        // checkoutRate: checkoutRate,
        // abandonedRate: abandonedRate,
        orderTrendStoreAmazon: orderTrendStoreAmazon,
        orderTrendStoreEbay: orderTrendStoreEbay,
        orderTrendStoreEtsy: orderTrendStoreEtsy,
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
                Total Revenue
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
                      usePlotGradientColor: "0",
                      showAlternateVGridColor: "0",
                      chartLeftMargin: "5",
                      canvasLeftMargin: "5",
                      divLineAlpha: "10",
                      divLineColor: "#000000",
                      captionFontColor: "#8091ab",
                      valuePadding: "5",
                      plotToolText: "<div>$label<br><b>$value orders</b>",
                      captionAlignment: "left",
                      captionPadding: "20",
                      subCaption: "Purchase Rate",
                      numberPrefix: "$",
                      showLegend: "1",
                      defaultCenterLabel: `${this.state.selectedValue}`,
                      theme: "fusion"
                    },
                    data: [
                      {
                        label: "Product Views",
                        value: `${this.state.orderTrendStoreAmazon.amProductViews}`
                      },
                      {
                        label: "Purchase Rate",
                        value: `${this.state.orderTrendStoreAmazon.amPurchaseRate}`
                      },
                      {
                        label: "Check Out Rate",
                        value: `${this.state.orderTrendStoreAmazon.amCheckoutRate}`
                      },
                      {
                        label: "Abandoned Rate",
                        value: `${this.state.orderTrendStoreAmazon.amAbandonedRate}`
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
                Total Revenue 
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
                      usePlotGradientColor: "0",
                      showAlternateVGridColor: "0",
                      chartLeftMargin: "5",
                      canvasLeftMargin: "5",
                      divLineAlpha: "10",
                      divLineColor: "#000000",
                      captionFontColor: "#8091ab",
                      valuePadding: "5",
                      plotToolText: "<div>$label<br><b>$value orders</b>",
                      captionAlignment: "left",
                      captionPadding: "20",
                      subCaption: "Purchase Rate",
                      numberPrefix: "$",
                      showLegend: "1",
                      defaultCenterLabel: `${this.state.selectedValue}`,
                      theme: "fusion"
                    },
                    data: [
                      {
                        label: "Product Views",
                        value: `${this.state.orderTrendStoreEbay.ebProductViews}`
                      },
                      {
                        label: "Purchase Rate",
                        value: `${this.state.orderTrendStoreEbay.ebPurchaseRate}`
                      },
                      {
                        label: "Check Out Rate",
                        value: `${this.state.orderTrendStoreEbay.ebCheckoutRate}`
                      },
                      {
                        label: "Abandoned Rate",
                        value: `${this.state.orderTrendStoreEbay.ebAbandonedRate}`
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
                Total Revenue 
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
                      usePlotGradientColor: "0",
                      showAlternateVGridColor: "0",
                      chartLeftMargin: "5",
                      canvasLeftMargin: "5",
                      divLineAlpha: "10",
                      divLineColor: "#000000",
                      captionFontColor: "#8091ab",
                      valuePadding: "5",
                      plotToolText: "<div>$label<br><b>$value orders</b>",
                      captionAlignment: "left",
                      captionPadding: "20",
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
