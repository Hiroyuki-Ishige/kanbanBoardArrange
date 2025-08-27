import { Routes, Route } from 'react-router-dom';
// import KanbanBoard from './KanbanBoard';
import Auth from './Auth';
import KanbanBoard from './KanbanBoard';



function App() {
  

  return (
    <Routes>
      {/* <Route path="/" element={<KanbanBoard />} /> */}
      <Route path="/" element={<Auth />} />
      <Route path="/kanbanboard" element={<KanbanBoard />} />
    </Routes>
  );
}

export default App

