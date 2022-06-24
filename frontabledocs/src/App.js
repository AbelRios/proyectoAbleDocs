import './App.css';
import jwt_decode from "jwt-decode";

import Layout from "./components/Layout";
import AdminPanel from "./views/AdminPanel";
import Editor from "./views/Editor";
import Login from "./views/Login";
import Logout from "./views/Logout";
import UserPanel from "./views/UserPanel";
import Home from "./views/Home";

import { LAYOUT, HOME, LOGIN, EDITOR, ADMIN_PANEL, USER_PANEL, LOGOUT } from './config/routes/paths';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={LAYOUT} element={<Layout />}>
          <Route path={LOGIN} element={<Login />} />
          <Route path={HOME} element={<Home />} />
          <Route path={EDITOR} element={<Editor />} />
          <Route path={ADMIN_PANEL} element={<AdminPanel />} />
          <Route path={USER_PANEL} element={<UserPanel />} />
          <Route path={LOGOUT} element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;