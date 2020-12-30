import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
  const [user] = useAuthState(auth);

  return (
    <div className="app">
      <header>
        <h1>emdo</h1>
        <SignOut />
      </header>
      {user ? <Tasks /> : <SignIn />}
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
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
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
