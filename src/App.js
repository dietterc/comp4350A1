import './App.css';
import React from 'react';
import Collapsible from 'react-collapsible';

class Question {
  constructor(title, creationDate, votes, body, answers, comments) {
    this.title = title
    this.creationDate = creationDate
    this.votes = votes
    this.body = body
    this.answers = answers
    this.comments = comments
  }
}

class Answer {
  constructor(body, creationDate) {
    this.body = body
    this.creationDate = creationDate
  }
}

const questionStyle = {
  border: '2px solid white',
  color: 'White',
  padding: '10px 25px',
  fontSize: '14px',
  margin: '4px 2px',
  transition: '0.1s'
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      data_newest: null,
      data_most_voted: null,
      output: 'Loading results...',
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
      //set everything back to default
      this.setState({fetched: false});
      this.setState({data_newest: null});
      this.setState({data_most_voted: null});
      this.setState({output: 'Loading results...'});
    }
    event.preventDefault();
  }

  output(event) {
    if(this.state.fetched == false) {
      this.setState({fetched: true});
      //pull data from api here
      fetch('https://api.stackexchange.com/2.2/search?order=desc&sort=creation&tagged='+ this.state.tag + '&site=stackoverflow&filter=!*zyy10AUddTdUFFiZ0lV0b0lzlOk4saHXIFT(Uxdl)BfTeL3xarQSC0P2I')
          .then(response => response.json())
          .then(data => this.setState({data_newest: data}));

      fetch('https://api.stackexchange.com/2.2/search?order=desc&sort=votes&tagged='+ this.state.tag + '&site=stackoverflow&filter=!*zyy10AUddTdUFFiZ0lV0b0lzlOk4saHXIFT(Uxdl)BfTeL3xarQSC0P2I')
          .then(response => response.json())
          .then(data => this.setState({data_most_voted: data}));

      
    }
    else {
      if(this.state.data_newest != null && this.state.data_most_voted != null) {
        if(this.state.output == 'Loading results...') {
          console.log(this.state.data_newest)
          //console.log(this.state.data_most_voted)
          
          let out = ''
          let outList = []

          for(var i=0;i<10 && i<this.state.data_newest.items.length;i++) {
            let question = this.state.data_newest.items[i]
            let title = question.title
            let body = question.body_markdown
            let date = new Date(question.creation_date * 1000)
            let votes = question.score
            let answers = []
            let comments = []

            for(let j=0;j<question.answer_count;j++) {
              answers.push(new Answer(question.answers[j].body,question.answers[j].creation_date))
            }
            for(let j=0;j<question.comment_count;j++) {
              answers.push(new Answer(question.comments[j].body,question.comments[j].creation_date))
            }
            
            outList.push(new Question(title, date, votes, body, answers, comments));
            
          }

          for(var i=0;i<10 && i<this.state.data_most_voted.items.length;i++) {
            let question = this.state.data_most_voted.items[i]
            let title = question.title
            let body = question.body_markdown
            let date = new Date(question.creation_date * 1000)
            let votes = question.score
            let answers = []
            let comments = []

            for(let j=0;j<question.answer_count;j++) {
              answers.push(new Answer(question.answers[j].body,question.answers[j].creation_date))
            }
            for(let j=0;j<question.comment_count;j++) {
              answers.push(new Answer(question.comments[j].body,question.comments[j].creation_date))
            }
            
            outList.push(new Question(title, date, votes, body, answers, comments));
            
          }

          //sort the list 
          outList.sort(function(a, b){return b.creationDate.getTime() - a.creationDate.getTime();});

          //add question stlying, has to be here because its a string
          out += `
          <style>
          .question {
            text-align: left; 
            border: 2px solid white; 
            border-radius: 10px; 
            color: White; 
            padding: 5px 5px; 
            font-size: 14px; 
            margin: 10px 2px;
          }
          .question:hover {
            background-color: #21242a;
          }
          .content {
            padding: 0 18px;
            display: none;
            overflow: hidden;
            
          }


          </style>
          `
          
          for(var i=0;i<outList.length;i++) {

            //out += newestList[i].title
            //console.log(newestList[i].title)
            out += "<Collapsible trigger='Start here'>"
            out += "<div type='button' class='question'>"
            out += "<b>Title:</b> " + outList[i].title
            out += "<br/><b>Score:</b> " + outList[i].votes 
            out += "<br/><b>Creation Date:</b> " + outList[i].creationDate 

            out += '</div>' 
            out += "</Collapsible >"
          }
          
          if(out == '') {
            this.setState({output: "No results found."});
          }
          else {
            this.setState({output: out});
          }

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
          Results for tag: {this.state.tag}
          <br/>
          <br/>
          {this.output()}
          <div
            dangerouslySetInnerHTML={{
            __html: this.state.output}} >
          </div>

          <br/>
          <br/>
          <input type="submit" value="Return to search" className="s-button"/>
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