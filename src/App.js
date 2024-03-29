import React, {useRef, useEffect, useState} from "react"
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";


// const FILTER_MAP = {
//   ALL: () => true,
//   Active: task => !task.completed,
//   completed: task => task.completed
// };
const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};
// const FILTER_NAMES = Object.keys(FILTER_MAP);
const FILTER_NAMES = Object.keys(FILTER_MAP);


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {
  // const taskList = props.tasks?.map(task => task.name);
  // const taskList = props.tasks.map(task => <Todo />);
  // const taskList = props.tasks.map(task => (
  //   <Todo id={task.id} name={task.name} completed={task.completed} />
  // ));
  // const [filter, setFilter] = useState("All");
  const [filter, setFilter] = useState('All');

  const [tasks, setTasks] = useState(props.tasks);
  const listHeadingRef = useRef(null);

  const taskList = tasks.filter(FILTER_MAP[filter])
  .map(task => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}

      />
    )
  );

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter}/>
  ));

  
  function addTask(name) {
    // alert(name);
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      if(id === task.id) {
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
      if (id === task.id) {
        return {
          ...task, name: newName
        }
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="App">
      <div className="todoapp stack-large">
        <h1>TodoMatic</h1>

        <Form addTask={addTask}
         />
        <div className="filters btn-group stack-exception">
          {filterList}
        </div>
        <h2 id="list-heading" ref={listHeadingRef}>
          {headingText}
        </h2>
        <ul
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading"
        >
          {taskList}
        </ul>
      </div>
    </div>
  );
  

}

export default App;
