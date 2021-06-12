import React, { Fragment } from "react";

import { Container } from "semantic-ui-react";

import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

import { observer } from "mobx-react-lite";
import { Route, useLocation } from "react-router";
import HomePage from "../../features/home/homePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import LoginForm from "../../features/users/LoginForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function App() {
  const location = useLocation();
  return (
    <Fragment>
      <ToastContainer position="bottom-right" hideProgressBar></ToastContainer>
      <Route exact path="/" component={HomePage}></Route>
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route />
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
              <Route path="/login" component={LoginForm} />
            </Container>
          </>
        )}
      ></Route>
    </Fragment>
  );
}

export default observer(App);
