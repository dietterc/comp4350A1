import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({tag: event.target.value});
  }

  handleSubmit(event) {
    
    //pull data from api here

    this.setState({submitted: !this.state.submitted});
    event.preventDefault();
  }

  handleState() {
    if(this.state.submitted == false) {
      return (
        <form onSubmit={this.handleSubmit} >
          <label >
            Enter tag to search: <br/><br/>
            <input type="text" value={this.state.tag} onChange={this.handleChange} className="input-box"/>
          </label>
          <br/><br/>
          <input type="submit" value="Submit" className="s-button"/>
        </form>
      );
    }
    else { //state for displaying results
      return (
        <form onSubmit={this.handleSubmit} >
          {this.state.tag}
          <br/>
          <br/>
          <input type="submit" value="Return to search" className="r-button"/>
        </form>
      );
    }
  }

  render() {
      return (
        <div className="App">
          <header className="App-header">
            {this.handleState()}
          </header>
          <footer className="App-footer">
            <p>Site Made by Colton Dietterle for COMP4350 Assignment 1</p>
          </footer>
        </div>
      );
  }
}

export default App;