// src/App.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './router';

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;