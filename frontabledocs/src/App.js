import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

// import {ADMIN, USER} from "../src/const/roles";

import AuthContextProvider from './contexts/AuthContext';

import Layout from "./components/Layout";
import RequireAuth from './components/RequireAuth';

import AdminPanel from "./views/AdminPanel";
import Editor from "./views/Editor";
import Login from "./views/Login";
import Logout from "./views/Logout";
import UserPanel from "./views/UserPanel";
import Register from "./views/Register";
import Missing from './views/Missing';
import TestLinks from './views/TestLinks';

import { LAYOUT, LOGIN, REGISTER, MISSING, UNAUTHORIZED, EDITOR, ADMIN_PANEL, USER_PANEL, LOGOUT, TEST_LINKS } from './config/routes/paths';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Unauthorized from './views/Unauthorized';

const ADMIN = 1990;
const USER = 1984;

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path={LAYOUT} element={<Layout />}>
          
            {/* Public Routes */}
            <Route index element={<Login />} />
            <Route path={LOGIN} element={<Login />} />
            <Route path={REGISTER} element={<Register />} />
            <Route path={UNAUTHORIZED} element={<Unauthorized/>}/>
            <Route path={TEST_LINKS} element={<TestLinks/>}/>


            {/* Admin Route */}
            <Route element={<RequireAuth allowedRoles={[ADMIN]} />}>
              <Route path={ADMIN_PANEL} element={<AdminPanel />} />
            </Route>

            {/* Users Routes */}
            <Route element={<RequireAuth allowedRoles={[USER]} />}>
              <Route path={EDITOR} element={<Editor />} />
              <Route path={USER_PANEL} element={<UserPanel />} />
              <Route path={LOGOUT} element={<Logout />} />
            </Route>

            {/* 404 Page */}
            <Route path={MISSING} element={<Missing />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;