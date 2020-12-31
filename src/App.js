import React, { Fragment, useState } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import NavDrawer from "./NavDrawer";
import "./App.css";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDN0-c6G4B4_sa6h1JBRECAPwgUAzGMW6g",
    authDomain: "emdo-15718.firebaseapp.com",
    projectId: "emdo-15718",
    storageBucket: "emdo-15718.appspot.com",
    messagingSenderId: "315690905816",
    appId: "1:315690905816:web:006e1b80c6b40f6345a7ad",
    measurementId: "G-99LJYHEFXJ",
  });
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  useAuthState(auth);

  return (
    <Router className="app">
      <NavDrawer auth={auth} />
      <Content />
    </Router>
  );
}

function Content() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <HomePage />
      </Route>
      <Route exact={true} path="/profile">
        <Profile />
      </Route>
      <Route exact={true} path="/projects">
        <Projects />
      </Route>
      <Route exact={true} path="/contexts">
        <Contexts />
      </Route>
    </Switch>
  );
}

function HomePage() {
  return (
    <div className="contentPage">
      {auth.currentUser ? (
        <Fragment>
          <h1>Next Actions</h1>
          <Tasks />
        </Fragment>
      ) : (
        <Fragment>
          <h1>emdo</h1>
          <SignIn />
        </Fragment>
      )}
    </div>
  );
}

function Profile() {
  return (
    <div className="contentPage">
      <h1>Profile</h1>
      <SignOut />
    </div>
  );
}

function Projects() {
  return (
    <div className="contentPage">
      <h1>Projects</h1>
    </div>
  );
}

function Contexts() {
  return (
    <div className="contentPage">
      <h1>Contexts</h1>
    </div>
  );
}

function SignIn() {
  const onSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={onSignInWithGoogle}>Sign In with Google</button>;
}

function SignOut() {
  const [toHome, setToHome] = useState(!auth.currentUser);
  if (toHome) {
    return <Redirect to="/" />;
  }

  return (
    auth.currentUser && (
      <button
        onClick={() => {
          auth.signOut();
          setToHome(true);
        }}
      >
        Sign Out
      </button>
    )
  );
}

function Tasks() {
  const actionsCollection = firestore.collection("tasks");
  const query = actionsCollection.where("uid", "==", auth.currentUser.uid);

  const [tasks] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendTask = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;

    await actionsCollection.add({
      text: formValue,
      uid: uid,
    });

    setFormValue("");
  };

  return (
    <div>
      {tasks && tasks.map((t) => <Task key={t.id} task={t} />)}
      <form onSubmit={sendTask}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

function Task(props) {
  const { text } = props.task;

  return <div>{text}</div>;
}

export default App;
