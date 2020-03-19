import React from 'react';
import './App.css';
import quit from './quit.png'

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



function Task(props) {
  return(
    <li onClick={() => props.handleItemDel(props.id)}>{props.taskText}
    <img className="DeleteButton" src={quit} />

    </li>

  );

}

function TaskList(props) {
  const listTasks = props.tasks.map((task, index) =>
  <Task taskText={task} key={index} id={index} handleItemDel={props.handleItemDel}/>
  );

  return(
    <div className="TaskBoard">
      {props.tasks.length < 1 &&
        <p> no tasks...</p>
      }
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
    this.handleItemDel = this.handleItemDel.bind(this);
  }

  handleItemDel(id) {
    var list = this.state.tasks.slice();
    list.splice(id,1);
    this.setState({
      tasks: list
    });



  }

  handleChange(event) {
    this.setState({userInput: event.target.value});
  }



  handleKeyPress(event) {
    if( event.key === "Enter" ) {

      if(this.state.userInput !== "") {
        var list = this.state.tasks.slice();
        list.unshift(this.state.userInput);
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
        <TaskList tasks={this.state.tasks} handleItemDel={this.handleItemDel}/>
      </div>
    );

  }

};

export default App;
