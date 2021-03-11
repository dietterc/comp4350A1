import './App.css';
import React from 'react';
import Collapsible from 'react-collapsible';

const newest = require('./newest.json')
const voted = require('./voted.json')

class Question {
  constructor(title, creationDate, votes, body, answers, comments) {
    this.title = title
    this.creationDate = creationDate
    this.votes = votes
    this.body = body
    this.answers = answers
    this.comments = comments
  }

  getCommentHTML() {
    var list = []
    let lb = (<br/>);
    for(let i=0;i<this.comments.length;i++) {
      var content = this.comments[i].get_content()
      if(content != undefined) {
        list.push(content)
        list.push(lb)
      }
    }
    return list
  }

  getAnswerHTML() {
    var list = []
    let lb = (<br/>);
    for(let i=0;i<this.answers.length;i++) {
      var content = this.answers[i].get_content()
      if(content != undefined) {
        list.push(content)
        list.push(lb)
      }
    }
    return list
  }

  get_html() {
    let defaultView = (
      <div className="question">
        <b>Title:</b> {this.title + ""}
        <br/><b>Score:</b> {this.votes + ""}
        <br/><b>Creation Date:</b> {this.creationDate + ""}
      </div>
    );

    return (
      <Collapsible trigger={defaultView}>
        <div className="q-hidden">
          Body:<br/>
          <div className="q-body" dangerouslySetInnerHTML={{__html: this.body + ""}} />
          <br/>Comments: {this.comments.length}<br/>
            {this.getCommentHTML()}
          <br/>Answers: {this.answers.length}<br/>
            {this.getAnswerHTML()}
        </div>
      </Collapsible>
    );
  }
}

class Subtext {
  constructor(body, creationDate, votes, comments) {
    this.body = body
    this.creationDate = new Date(creationDate * 1000)
    this.votes = votes
    this.comments = comments
  }

  getCommentHTML() {
    var list = []
    let lb = (<br/>);
    for(let i=0;i<this.comments.length;i++) {
      var content = this.comments[i].get_content()
      if(content != undefined) {
        list.push(content)
        list.push(lb)
      }
    }
    return list
  }

  get_content() {
    if(this.comments == null || this.comments.length == 0) {
      return (
        <div className="subtext" >
          <div><b>Score: </b>{this.votes + ""}<div className = "st-date"> <b>Posted at: </b>{this.creationDate + ""}</div> <hr className="st-hr"/> </div>
          <div dangerouslySetInnerHTML={{__html: this.body + ""}}/>
        </div>
      );
    }
    else {
      return (
        <div className="subtext" >
          <div><b>Score: </b>{this.votes + ""}<div className = "st-date"> <b>Posted at: </b>{this.creationDate + ""}</div> <hr className="st-hr"/> </div>
          <div dangerouslySetInnerHTML={{__html: this.body + ""}}/>
          <br/>Comments:<br/>
            {this.getCommentHTML()}
        </div>
      );
    }
  }

}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      data_newest: null,
      data_most_voted: null,
      output: 'Loading results...',
      outputList: [],
      submitted: false,
      fetched: false
    
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      /*
      fetch('https://api.stackexchange.com/2.2/search?order=desc&sort=creation&tagged='+ this.state.tag + '&site=stackoverflow&filter=!*zyy10AUddTdUFFiZ0lV0b0lzlOk4saHXIFT(Uxdl)BfTeL3xarQSC0P2I')
          .then(response => response.json())
          .then(data => this.setState({data_newest: data}));

      fetch('https://api.stackexchange.com/2.2/search?order=desc&sort=votes&tagged='+ this.state.tag + '&site=stackoverflow&filter=!*zyy10AUddTdUFFiZ0lV0b0lzlOk4saHXIFT(Uxdl)BfTeL3xarQSC0P2I')
          .then(response => response.json())
          .then(data => this.setState({data_most_voted: data}));
      */
      //ignoring for now
      console.log(newest)
      console.log(voted)
      this.setState({data_newest: newest})
      this.setState({data_most_voted: voted})

    }
    else {
      if(this.state.data_newest != null && this.state.data_most_voted != null) {
        if(this.state.output == 'Loading results...') {
          //console.log(this.state.data_newest)
          //console.log(this.state.data_most_voted)
          
          let out = ''
          let outList = []

          for(var i=0;i<10 && i<this.state.data_newest.items.length;i++) {
            let question = this.state.data_newest.items[i]
            let title = question.title
            let body = question.body
            let date = new Date(question.creation_date * 1000)
            let votes = question.score
            let answers = []
            let comments = []

            for(let j=0;j<question.answer_count;j++) {
              let answerComments = []

              for(let k=0;k<question.answers[j].comment_count;k++) {
                answerComments.push(new Subtext(question.answers[j].comments[k].body,question.answers[j].comments[k].creation_date,question.answers[j].comments[k].score,null))
              }

              answers.push(new Subtext(question.answers[j].body,question.answers[j].creation_date,question.answers[j].score,answerComments))
            }
            
            for(let j=0;j<question.comment_count;j++) {
              comments.push(new Subtext(question.comments[j].body,question.comments[j].creation_date,question.comments[j].score,null))
            }
            
            outList.push(new Question(title, date, votes, body, answers, comments));
            
          }
          
          for(var i=0;i<10 && i<this.state.data_most_voted.items.length;i++) {
            let question = this.state.data_most_voted.items[i]
            let title = question.title
            let body = question.body
            let date = new Date(question.creation_date * 1000)
            let votes = question.score
            let answers = []
            let comments = []

            for(let j=0;j<question.answer_count;j++) {
              let answerComments = []

              for(let k=0;k<question.answers[j].comment_count;k++) {
                answerComments.push(new Subtext(question.answers[j].comments[k].body,question.answers[j].comments[k].creation_date,question.answers[j].comments[k].score,null))
              }

              answers.push(new Subtext(question.answers[j].body,question.answers[j].creation_date,question.answers[j].score,answerComments))
            }
            

            for(let j=0;j<question.comment_count;j++) {
              comments.push(new Subtext(question.comments[j].body,question.comments[j].creation_date,question.comments[j].score,null))
            }
            
            outList.push(new Question(title, date, votes, body, answers, comments));
            
          }

          //sort the list 
          outList.sort(function(a, b){return b.creationDate.getTime() - a.creationDate.getTime();});

          if(outList.length > 0) {
            out += (this.state.data_newest.items.length + this.state.data_most_voted.items.length) + " results found, displaying the first 20"
          }
          
          if(out == '') {
            this.setState({output: "No results found."});
          }
          else {
            this.setState({output: out});

            //convert the list of objects to a list of html
            let htmlOutput = []
            for(let i=0;i<outList.length;i++) {
              htmlOutput.push(outList[i].get_html())
            }

            this.setState({outputList: htmlOutput});
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
        
          {this.state.output}
          {this.state.outputList}
        
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