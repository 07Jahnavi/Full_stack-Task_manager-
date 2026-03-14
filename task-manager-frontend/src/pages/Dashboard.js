import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {

const [tasks, setTasks] = useState([]);
const [title,setTitle] = useState("");
const [description,setDescription] = useState("");

const [search,setSearch] = useState("");
const [status,setStatus] = useState("");
const [page,setPage] = useState(1);

const fetchTasks = async () => {


const res = await API.get(
  `/tasks?page=${page}&limit=5&status=${status}&search=${search}`
);

setTasks(res.data.tasks);


};

useEffect(()=>{
fetchTasks();
},[page,status,search]);

const createTask = async(e)=>{
e.preventDefault();


await API.post("/tasks",{
  title,
  description,
  status:"pending"
});

setTitle("");
setDescription("");

fetchTasks();


};

const deleteTask = async(id)=>{
await API.delete(`/tasks/${id}`);
fetchTasks();
};

const completeTask = async(id)=>{
await API.put(`/tasks/${id}`,{
status:"completed"
});


fetchTasks();


};

return (


<div className="dashboard">

  <h1>Task Manager</h1>


  {/* SEARCH + FILTER */}

  <div className="task-controls">

    <input
      placeholder="Search tasks..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
    />

    <select
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
    >
      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>

  </div>



  {/* CREATE TASK */}

  <form className="task-form" onSubmit={createTask}>

    <input
      placeholder="Task title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
    />

    <input
      placeholder="Task description"
      value={description}
      onChange={(e)=>setDescription(e.target.value)}
    />

    <button>Add Task</button>

  </form>



  {/* TASK LIST */}<div className="task-list">
  {tasks.length === 0 ? (
    <p className="no-tasks">No tasks found. Try page 1 or add a new task.</p>
  ) : (
    tasks.map(task => (
      <div className="task-card" key={task._id}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>

        <span className={task.status}>{task.status}</span>

        <div className="task-buttons">
          <button
            className="complete"
            onClick={() => completeTask(task._id)}
          >
            Complete
          </button>

          <button
            className="delete"
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>


  {/* PAGINATION */}

<div className="pagination">

<button
onClick={()=>setPage(page-1)}
disabled={page===1}
>
Prev
</button>

<span>Page {page}</span>

{tasks.length === 5 && (
<button
onClick={()=>setPage(page+1)}
>
Next
</button>
)}

</div>

</div>


);
}

export default Dashboard;
