import { useState } from 'react'

function Todo() {
  const [Task, setTask] = useState([]);
  const [inputTask, setInputTask] = useState("");
const Add = (e) =>{
const newTask =  {
   id: Date.now(),
  text : inputTask
}
setTask([...Task , newTask])
console.log("click")
}

const deleteTask = (id) =>{
setTask(Task.filter(t => t.id !== id))
}

return<>
<h1>To Dos Tasks </h1>
<div className="toDos">
<input type="text" onChange={(e) => setInputTask(e.target.value)} /> 
<button className="add" onClick={Add}>Add</button>
</div>
<div className="displayTask">

   {Task.map((t) => (
          <div key={t.id} className="taskItem">
            <h1>{t.text}</h1>
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </div>
        ))}
</div>

</>
 
}

export default Todo
