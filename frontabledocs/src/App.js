import './App.css';
import {Home, Login, Editor, AdminHome} from "./views"

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './views/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/editor' element={<Editor/>}/>
        <Route path='/admin' element={<AdminHome/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;