import React from 'react'
import { Container, Nav } from './styled-components'
import './App.css';
import config from './config'


const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      items: []
    }
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
      </Container>
    );
  }
}

export default App;
