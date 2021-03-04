import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit} >
            <label >
              Enter tag to search: <br/><br/>
              <input type="text" value={this.state.value} onChange={this.handleChange} className="input-box"/>
            </label>
            <br/><br/>
            <input type="submit" value="Submit" className="s-button"/>
          </form>
        </header>
        <footer className="App-footer">
          <p>Site Made by Colton Dietterle for COMP4350 Assignment 1</p>
        </footer>
      </div>
    );
  }
}

export default App;