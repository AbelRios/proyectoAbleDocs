import './App.css';
import "@popperjs/core/dist/umd/popper.js"
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./css/main.min.css";

//import {ADMIN, USER} from "../src/const/roles";

import AuthContextProvider from './contexts/AuthContext';

import Layout from "./components/Layout";
import RequireAuth from './components/RequireAuth';

import AdminPanel from "./views/AdminPanel";
import UserPanel from "./views/UserPanel";
import Profile from './views/Profile';
import Editor from "./views/Editor";
import Login from "./views/Login";
import Logout from "./views/Logout";
import Register from "./views/Register";
import Missing from './views/Missing';
import TestLinks from './views/TestLinks';
import Unauthorized from './views/Unauthorized';
import { LAYOUT, LOGIN, REGISTER, PROFILE, MISSING, UNAUTHORIZED, EDITOR, ADMIN_PANEL, USER_PANEL, LOGOUT, TEST_LINKS } from './config/routes/paths';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ADMIN, USER } from './const/roles';
import UsersListContextProvider from './contexts/UsersContext';

function App() {
  return (
    <AuthContextProvider>
      <UsersListContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={LAYOUT} element={<Layout />}>

              {/* Public Routes */}
              <Route index element={<Login />} />
              <Route path={LOGIN} element={<Login />} />
              <Route path={REGISTER} element={<Register />} />
              <Route path={UNAUTHORIZED} element={<Unauthorized />} />
              <Route path={TEST_LINKS} element={<TestLinks />} />


              {/* Admin Route */}
              <Route element={<RequireAuth allowedRoles={[Number(ADMIN)]} />}>
                <Route path={ADMIN_PANEL} element={<AdminPanel />} />
              </Route>

              {/* Users Routes */}
              <Route element={<RequireAuth allowedRoles={[Number(USER)]} />}>
                <Route path={EDITOR} element={<Editor />} />
                <Route path={USER_PANEL} element={<UserPanel />} />
                <Route path={PROFILE} element={<Profile />} />
                <Route path={LOGOUT} element={<Logout />} />
              </Route>

              {/* 404 Page */}
              <Route path={MISSING} element={<Missing />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </UsersListContextProvider>
    </AuthContextProvider>
  );
}

export default App;