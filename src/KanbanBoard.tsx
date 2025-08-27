import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';
import Auth from './Auth';
import type { User } from '@supabase/supabase-js';

function KanbanBoard() {
  // Control user authentication
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

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

  const handleDragOver = (e: React.DragEvent, columnId: "todo" | "inProgress" | "done") => {
    e.preventDefault();
    console.log(`Dragging over ${columnId}`);
  };

  // Handle dropping a task
  const handleDrop = (e: React.DragEvent, columnId: "todo" | "inProgress" | "done") => {
    e.preventDefault();

    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;

    // To solve error that "item" is declared but never used.
    console.log(item)

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
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400"
    },
    done: {
      header: "bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400"
    }
  }

  return (
    <>
      {/* div for whole screen */}
      <div className='p-6 w-full min-h-screen bg-gradient-to-b from-zinc-600 to-zinc-900 flex items-center justify-center'>

        {/* div to contain the logo "React Kanban Board", input box, list of tasks */}
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
              onChange={(e) => setActiveColumns(e.target.value as "todo" | "inProgress" | "done")}
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
              Add
            </button>
          </div>

          {/* List of tasks: To do, In progress, Done */}
          <div className='flex gap-6 overflow-x-auto pb-6 w-full'>
            {Object.keys(columns).map((columnId) => (
              <div key={columnId}
                className={`flex-shrink-0 w-80 bg-zinc-800 rounded-lg shadow-x1 border-t-4 ${columnStyles[columnId as keyof typeof columnStyles].header ?? ""}`}
                onDragOver={(e) => handleDragOver(e, columnId as "todo" | "inProgress" | "done")}
                onDrop={(e) => handleDrop(e, columnId as "todo" | "inProgress" | "done")}
              >
                <div className={`p-4 text-white font-bold text-x1 rounded-t-md 
                  ${columnStyles[columnId as keyof typeof columnStyles].header}
                  `}>
                  {columns[columnId as keyof typeof columns].name}
                  <span className='ml-2 px-2 py-1 bg-zinc-700 bg-opacity-50 rounded-full text-sm'>{columns[columnId as keyof typeof columns].items.length}</span>
                </div>

                {/* List of tasks */}
                <div className='p-3 min-h-64'>
                  {columns[columnId as keyof typeof columns].items.length === 0 ? (
                    <div className='text-center py-10 text-white italic text-lg'>Drop tasks here</div>
                  ) : (
                    columns[columnId as keyof typeof columns].items.map((item) => (
                      <div key={item.id} className='p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-lg '
                        draggable={true}
                        onDragStart={() => handleDragStart(columnId as keyof typeof columns, item)}>
                        <span className='mr-2'>{item.content}</span>

                        {/* delete button */}
                        <button onClick={() => removeTask(columnId as keyof typeof columns, item.id)}
                          className='text-zinc-500 hover:text-red-400 transition-colors duration-300 w-6 h-6 flex items-center justify-center round-full hover:bg-zinc-600 '>
                          <span className='text-lg cursor-pointer'>X</span>

                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

    </>
  )
}

export default KanbanBoard

