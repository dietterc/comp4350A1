import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      data_newest: null,
      data_most_voted: null,
      output: '',
      submitted: false,
      fetched: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.output = this.output.bind(this);
  }

  handleChange(event) {
    this.setState({tag: event.target.value});
  }

  handleSubmit(event) {
    this.setState({submitted: !this.state.submitted});
    if(this.state.submitted == false) {
      this.setState({fetched: false});
      this.setState({data_newest: null});
      this.setState({data_most_voted: null});
    }
    event.preventDefault();
  }

  output(event) {
    if(this.state.fetched == false) {
      this.setState({fetched: true});
      //pull data from api here
      fetch('https://api.stackexchange.com/2.2/search?order=desc&sort=creation&tagged=java&site=stackoverflow')
          .then(response => response.json())
          .then(data => this.setState({data_newest: data}));
      fetch('https://api.stackexchange.com/2.2/search?order=desc&sort=votes&tagged=java&site=stackoverflow')
          .then(response => response.json())
          .then(data => this.setState({data_most_voted: data}));
      
    }
    else {
      if(this.state.data_newest != null && this.state.data_most_voted != null) {
        if(this.state.output == '') {
          console.log(this.state.data_newest)
          console.log(this.state.data_most_voted)
          let out = ''
          let newestList = []
          let votedList = []

          for(var i=0;i<10;i++) {
            newestList.push(this.state.data_newest[i]);
            votedList.push(this.state.data_most_voted[i]);
          }
          
          for(var i=0;i<votedList.length;i++) {

            out += votedList["title"]
            
            if(i != votedList.length - 1) {
              out += "\n"
            }
          }

          out = out.split('\n').map(str => <div >{str}</div>) //test
        
          this.setState({output: out});
        }
      }
    }
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
          Results for tag: {this.state.tag},
          <br/>
          <br/>
          {this.output()}
          {this.state.output}
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