import React from 'react';
import './App.css';
import quit from './quit.png'
import logo from './logo.png'
import cat from './Octocat.png'
import refresh from './refresh.svg';

function SearchBar(props) {
    if(props.isLoading == false) {
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
    } else {
      return (
        <div className="SearchBarContainer">
          <div className="LogoContainer">
          <h1>TODO</h1>
          <img className="Logo" src={logo}></img>
          </div>
          <LoadingBar />
    
        </div>
        );
    }
    
};


function LoadingBar(props) {
  return <div className="LoadingContainer">
    <img src={refresh} className="LoadingIcon">
            </img>
  </div>
}



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
      <li onClick={() => props.handleItemCheckOff(props.task["taskId"], props.task["completed"])}>
      {props.task["taskText"]}
      </li>

    );
  } else {

    return(
      <li className="CompletedTask" onClick={() => props.handleItemCheckOff(props.task["taskId"], props.task["completed"])}>
      {props.task["taskText"]}
      <img className="DeleteButton" src={quit} onClick={() => props.handleItemDeletion(props.task["taskId"])}>
      </img>

      </li>
    );

  }

}

// delete button
//<img className="DeleteButton" src={quit} />


function TaskList(props) {
  const listTasks = props.tasks.map((task, index) => {
    return <Task task={task} key={index} id={index} handleItemCheckOff={props.handleItemCheckOff} handleItemDeletion={props.handleItemDeletion}/>
  }
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
      isLoading: false,
      tasks: []
    }

    // bind function
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleItemCheckOff = this.handleItemCheckOff.bind(this);
    this.handleItemDeletion = this.handleItemDeletion.bind(this);

  }

  handleItemCheckOff(id, completed) {
    if(completed == false) {


      var t = !completed;
  
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'completed': t})
      };
      fetch('https://test-backend-eb284.firebaseio.com/tasks/' + id + '.json', requestOptions)
        .then(response => {
          // update tasks list
          this.getTasksAsync().then(data => {
            this.setState({
              tasks: data
            });
          });
  
        }
        ).catch(error => console.log("error"));

    }

  }

  handleItemDeletion(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('https://test-backend-eb284.firebaseio.com/tasks/' + id + '.json', requestOptions)
      .then(response => response.json()).catch( error => console.log(error));

    // update tasks list
    this.getTasksAsync().then(data => {
      this.setState({
        tasks: data
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
          body: JSON.stringify({ taskText: this.state.userInput, completed: false })
        };
        fetch('https://test-backend-eb284.firebaseio.com/tasks.json', requestOptions)
          .then(response => response.json()).catch( error => console.log(error));

        // update tasks list


        this.getTasksAsync().then(data => {
          // console.log((fetchedTasks));
          this.setState({
            tasks: data,
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
    this.setState({
      isLoading: true,
    });

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    var response = await fetch('https://test-backend-eb284.firebaseio.com/tasks.json', requestOptions).catch( error => console.log(error));
    var data = await response.json();
    if(data != null) {
      var fetchedTasks = [];
      Object.keys(data).forEach( (key) => {
        fetchedTasks.push({
          'taskId': key,
          'taskText': data[key]['taskText'],
          'completed': data[key]['completed']
        });
      });
      this.setState({
        isLoading: false,
      });
      return fetchedTasks;

    } else {
      this.setState({
        isLoading: false,
      });
      return [];
    }
    
  }

  // fetch all tasks on startup
  componentDidMount() {
    this.getTasksAsync().then(data => {
      this.setState({
        tasks: data,
      });
      
    });
  }

  render() {

    return (
      <div className="App">
        
        <SearchBar isLoading={this.state.isLoading}  userInput={this.state.userInput} handleChange={this.handleChange} handleKeyPress={this.handleKeyPress}/>
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
