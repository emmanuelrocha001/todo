import React from 'react';
import logo from './logo.svg';
import './App.css';



class TaskBoard extends React.Component {

};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      tasks: []
    }

    // bind function
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

  }


  handleChange(event) {

    this.setState({userInput: event.target.value});

  }



  handleKeyPress(event) {
    if( event.key === "Enter" ) {
      alert( " \"" + this.state.userInput + " \"" );
      event.preventDefault();
    } else {
    }
  }


  render() {

    return (
    <form >
      <input onKeyDown={this.handleKeyPress} className="SearchBar" type="text" value={this.state.UserInput} onChange={this.handleChange} />



    <h1>{this.state.userInput}</h1>
    </form>
    );

  }
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      tasks: []
    }
  }



  render() {

    return (
      <div className="App">
        <SearchBar />
      </div>
    );

  }

};

export default App;
