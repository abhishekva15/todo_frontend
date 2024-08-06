
import { Navigate, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Signup from './component/Signup';
import Home from './component/Home';
import Login from './component/Login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to="/login"/>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/home' element={<Home></Home>}></Route>
      </Routes>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default App;
