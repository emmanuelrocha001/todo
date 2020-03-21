import React from 'react';
import './App.css';
import quit from './quit.png'
import logo from './logo.png'
import cat from './Octocat.png'

function SearchBar(props) {
    return (

    <div className="SearchBarContainer">
      <div className="LogoContainer">
      <h1>TODO</h1>
      <img className="Logo" src={logo}></img>
      </div>
      <form >
        <input className="SearchBar" type="text" value={props.UserInput} onChange={props.handleChange} onKeyPress={props.handleKeyPress} />
      </form>

    </div>
    );
};


function handleTaskExpansion() {
  // alert("taxk expanded");
}

function handleTaskSimplify(id) {
  // alert("task minimized" + id);
}

function Task(props) {
  // fetch task info


  //{props.task["taskText"]}
  if( props.task["completed"] !== true){

    return(

      <li onMouseLeave={() => handleTaskSimplify(props.id)} onMouseEnter={handleTaskExpansion} onClick={() => props.handleItemCheckOff(props.task["_id"], props.task["completed"])}>
      {props.task["taskText"]}
      </li>

    );
  } else {

    return(
      <li className="CompletedTask" onMouseLeave={() => handleTaskSimplify(props.id)} onMouseEnter={handleTaskExpansion} onClick={() => props.handleItemCheckOff(props.task["_id"], props.task["completed"])}>
      {props.task["taskText"]}
      <img className="DeleteButton" src={quit} onClick={() => props.handleItemDeletion(props.task["_id"])}>
      </img>

      </li>
    );

  }

}

// delete button
//<img className="DeleteButton" src={quit} />


function TaskList(props) {
  const listTasks = props.tasks.map((task, index) =>
  <Task task={task} key={index} id={index} handleItemCheckOff={props.handleItemCheckOff} handleItemDeletion={props.handleItemDeletion}/>
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
    this.handleItemCheckOff = this.handleItemCheckOff.bind(this);
    this.handleItemDeletion = this.handleItemDeletion.bind(this);

  }

  handleItemCheckOff(id, completed) {
    var t = "true";
    if(completed){
      t = "false";
    }
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{"propName":"completed", "value": t}])
    };
    fetch('https://event-maps-api.herokuapp.com/tasks/' + id, requestOptions)
      .then(response => {
        // update tasks list
        this.getTasksAsync().then(data => {
          this.setState({
            tasks: data["tasks"]
          });
        });

      }
      ).catch(error => console.log("error"));

  }

  handleItemDeletion(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('https://event-maps-api.herokuapp.com/tasks/' + id, requestOptions)
      .then(response => response.json()).catch( error => console.log(error));

    // update tasks list
    this.getTasksAsync().then(data => {
      this.setState({
        tasks: data["tasks"]
      });
    });

  }

  handleChange(event) {
    this.setState({userInput: event.target.value});
  }


  // aka adding task to the list
  handleKeyPress(event) {
    if( event.key === "Enter" ) {

      if(this.state.userInput !== "") {
       // add task to database
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskText: this.state.userInput })
        };
        fetch('https://event-maps-api.herokuapp.com/tasks/', requestOptions)
          .then(response => response.json()).catch( error => console.log(error));

        // update tasks list
        this.getTasksAsync().then(data => {
          this.setState({
            tasks: data["tasks"],
            userInput: ""
          });
        });
      }
      event.target.value = "";
      event.preventDefault();
    }
  }

  // get updated task list
  async getTasksAsync()
  {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    var response = await fetch('https://event-maps-api.herokuapp.com/tasks/', requestOptions).catch( error => console.log(error));
    var data = await response.json();
    return data;
  }

  // fetch all tasks on startup
  componentDidMount() {
    this.getTasksAsync().then(data => {
      this.setState({
        tasks: data["tasks"]
      });
    });
  }

  render() {

    return (
      <div className="App">
        <SearchBar userInput={this.state.userInput} handleChange={this.handleChange} handleKeyPress={this.handleKeyPress}/>
        <TaskList tasks={this.state.tasks} handleItemCheckOff={this.handleItemCheckOff} handleItemDeletion={this.handleItemDeletion}/>
        <div className="RepoContainer">
        <a href="https://github.com/emmanuelrocha001/todo">
          <img className="RepoLogo" src={cat}></img>
        </a>
        </div>
      </div>
    );

  }

};

export default App;
