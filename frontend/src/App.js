import "./index.css";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import GetAccess from "./pages/GetAccess";
import CreateUser from "./pages/CreateUser";
import SelectPayment from "./pages/SelectPayment";
import ConfirmPayment from "./pages/ConfirmPayment";
import EditUser from "./pages/EditUser";

import Index from "./pages/Index";
import Up from "./pages/Up";
import Haryana from "./pages/Haryana";
import Uttrakhand from "./pages/Uttrakhand";
import Punjab from "./pages/Punjab";
import Bihar from "./pages/Bihar";
import Bills from "./pages/Bills";
import Users from "./pages/Users";
import Gujrat from "./pages/Gujrat";
import Maharashtra from "./pages/Maharashtra";
import Rajasthan from "./pages/Rajasthan";
import MadhyaPardesh from "./pages/MadhyaPardesh";
import karnataka from "./pages/Karnataka";
import HimachalPradesh from "./pages/HimachalPradesh";
import Jharkhand from "./pages/Jharkhand";
import Chhattisgarh from "./pages/Chhattisgarh";
import Odisha from "./pages/Odisha";
import Tamilnadu from "./pages/Tamilnadu";
import Kerala from "./pages/Kerala";

import { LOCAL_STORAGE_KEY } from "./constants";
import { useState } from "react";
import { webIndexApi } from "./utils/api";

function App() {
  return (
    <div className="App">
      <Router basename="app">
        <Switch>
          <ProtectedRoute exact path="/" component={Index} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin/login" component={AdminLogin} />
          <AdminRoute exact path="/admin/users" component={Users} />
          <AdminRoute exact path="/admin/create-user" component={CreateUser} />
          <AdminRoute exact path="/admin/edit-user/:id" component={EditUser} />
          <ProtectedRoute exact path="/reports" component={Bills} />
          <ProtectedRoute exact path="/pb" component={Punjab} />
          <ProtectedRoute exact path="/hr" component={Haryana} />
          <ProtectedRoute exact path="/uk" component={Uttrakhand} />
          <ProtectedRoute exact path="/up" component={Up} />
          <ProtectedRoute exact path="/bh" component={Bihar} />
          <ProtectedRoute exact path="/gj" component={Gujrat} />
          <ProtectedRoute exact path="/rj" component={Rajasthan} />
          <ProtectedRoute exact path="/mh" component={Maharashtra} />
          <ProtectedRoute exact path="/hp" component={HimachalPradesh} />
          <ProtectedRoute exact path="/ka" component={karnataka} />
          <ProtectedRoute exact path="/mp" component={MadhyaPardesh} />
          <ProtectedRoute exact path="/jh" component={Jharkhand} />
          <ProtectedRoute exact path="/cg" component={Chhattisgarh} />
          <ProtectedRoute exact path="/od" component={Odisha} />
          <ProtectedRoute exact path="/tn" component={Tamilnadu} />
          <ProtectedRoute exact path="/kl" component={Kerala} />

          <ProtectedRoute
            exact
            path="/select-payment"
            component={SelectPayment}
          />
          <ProtectedRoute
            exact
            path="/confirm-payment"
            component={ConfirmPayment}
          />
          <Route exact path="/register/:id/get-access" component={GetAccess} />
          <Route render={NotFound} />
        </Switch>
        <Check />
      </Router>
    </div>
  );
}

export default App;

const Check = () => {
  const history = useHistory();
  const init = async () => {
    const userInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!userInfo) return;
    const { data, error } = await webIndexApi({
      authToken: userInfo.token,
    });
    if (data && data.success) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
    } else {
      history.push("/login");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log("user not found");
    }
  };
  useState(() => {
    init();
  }, []);
  return <></>;
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // get from local storage
  const userInfo = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (userInfo) {
    return (
      <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
    );
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  }
};
const AdminRoute = ({ component: Component, ...rest }) => {
  // get from local storage
  const userInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  if (userInfo && userInfo.role === "admin") {
    return (
      <Route {...rest} render={(props) => <Component {...rest} {...props} />} />
    );
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  }
};
