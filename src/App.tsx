import { useState } from 'react'


function App() {
  // Define the initial state for the columns
  const [columns, setColumns] = useState({
    todo: {
      name: "Todo",
      items: [
        { id: "1", content: "Market reserch" },
        { id: "2", content: "Write Project" }
      ]
    },
    inProgress: {
      name: "In Progress",
      items: [{ id: "3", content: "Design UI mockup" },]
    },
    done: {
      name: "Done",
      items: [{ id: "4", content: "Set up repository" },]
    }
  });

  // Define the state for the new task input and the active column
  const [newTask, setNewTask] = useState("");
  const [activeColumns, setActiveColumns] = useState<"todo" | "inProgress" | "done">("todo");
  const [draggedItem, setDraggedItem] = useState<{
    columnId: "todo" | "inProgress" | "done";
    item: { id: string; content: string };
  } | null>(null);

  // Define the function to handle adding a new task
  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updatedColumns = { ...columns };
    updatedColumns[activeColumns].items.push({
      id: Date.now().toString(),
      content: newTask
    });

    setColumns(updatedColumns);
    setNewTask("");
  };

  // Define the function to handle removing a task
  const removeTask = (columnId: "todo" | "inProgress" | "done", taskId: string) => {
    const updatedColumns = { ...columns };

    updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId);

    setColumns(updatedColumns);
  };

  const handleDragStart = (columnId: "todo" | "inProgress" | "done", item: { id: string; content: string }) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle dropping a task
  const handleDrop = (e: React.DragEvent, columnId: "todo" | "inProgress" | "done") => {
    e.preventDefault();

    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;

    if (sourceColumnId === columnId) return;

    const updatedColumns = { ...columns };
    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter(
      (item) => item.id !== draggedItem.item.id
    );
    updatedColumns[columnId].items.push(draggedItem.item);
    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400"
    },
    inProgress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400"
    },
    done: {
      header: "bg-gradient-to-r from-green-600 to-teal-400",
      border: "border-green-400"
    }
  }

  return (
    <>
      {/* div for whole screen */}
      <div className='p-6 w-full min-h-screen bg-gradient-to-b from-zinc-600 to-zinc-900 flex items-center justify-center'>

        {/* div to contain the logo "React Kanban Board" and input box */}
        <div className='flex items-center justify-center flex-col gap-4 w-full max-w-6xl'>
          {/* Logo */}
          <h1 className='text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300'>React Kanban Board</h1>

          {/*div for input box, selection, add button*/}
          <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">

            {/* input box */}
            <input value={newTask}
              className='flex-grow bg-zinc-500 rounded-md p-3 w-full text-white'
              type="text"
              onChange={(e) => setNewTask(e.target.value)}
              placeholder='Add a new task'

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addNewTask();
                }
              }}
            />

            {/* Select box for choosing column */}
            <select value={activeColumns}
              className='p-3 bg-zinc-500 text-white border-0 border-zinc-600 rounded-md ml-2'
            >

              {Object.keys(columns).map((columnId) => (
                <option key={columnId} value={columnId}>
                  {columns[columnId as keyof typeof columns].name}
                </option>
              ))}

            </select>

            {/* add button */}
            <button className='p-3 ml-2 rounded-md text-white font-medium bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-500 hover:to-amber-500 transition-all duration-500 cursor-pointer'
              onClick={addNewTask}>
              Add Task
            </button>

          </div>
        </div>
      </div>

    </>
  )
}

export default App

//TODO studay <select/> from line 115