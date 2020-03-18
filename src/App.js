import React from 'react';
import './App.css';


function SearchBar(props) {
    return (

    <div className="SearchBarContainer">
      <h1>TODO</h1>
      <form >
        <input className="SearchBar" type="text" value={props.UserInput} onChange={props.handleChange} onKeyPress={props.handleKeyPress} />
      </form>

    </div>
    );
};


function TaskList(props) {

  const listTasks = props.tasks.map((task) =>
    <li>{task}</li>

  );

  return(
    <div className="TaskBoard">
      <ul>{listTasks}</ul>

    </div>
  );

}


class App extends React.Component {
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

      if(this.state.userInput != "") {
        var list = this.state.tasks.slice();
        list.push(this.state.userInput);
        this.setState({
          userInput: "",
          tasks: list
        });
        event.target.value = "";
      }
      // alert( " \"" + this.state.userInput + " \" - added to list" );

      event.preventDefault();
    }
  }



  render() {

    return (
      <div className="App">
        <SearchBar userInput={this.state.userInput} handleChange={this.handleChange} handleKeyPress={this.handleKeyPress}/>
        <TaskList tasks={this.state.tasks}/>
      </div>
    );

  }

};

export default App;
