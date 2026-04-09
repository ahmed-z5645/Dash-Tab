import React from "react";
import { useState, useEffect } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth/web-extension";
import { doc, setDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore'
import { auth, db } from "../../firebase.js";

import './toDo.css'
import LoginInterface from './auth.js'

const ToDoList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [needCreate, setNeedCreate] = useState(false);
    const [userDocs, setUserDocs] = useState({})
    const [curr_time, setCurrT] = useState(null);
    const [newTaskTitle, setTaskTitle] = useState("");

    useEffect(() => {
        const time = new Date();
        setCurrT(Math.floor(time.getTime() / 1000))
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(user);
            } else {
                setIsLoggedIn(null);
                setUserDocs({});
            }
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        const uid = isLoggedIn?.uid;
        if (!uid) return;

        const taskCollecRef = collection(db, "users", uid, "tasks");
        const unsubscribe = onSnapshot(taskCollecRef, (snap) => {
            const allObjects = {};
            snap.docs.forEach((d) => {
                allObjects[d.data().tOfCreate] = d.data();
            });
            setUserDocs(Object.fromEntries(Object.entries(allObjects).sort((a, b) => b[0] - a[0])));
        });
        return () => unsubscribe();
    }, [isLoggedIn?.uid])

    const logout = () => {
        signOut(auth).then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }

    const newTaskHandler = async (e) => {
        e.preventDefault()
        try {
            const time = new Date().getTime()
            const data = {
                Title: newTaskTitle,
                tOfCreate: time,
                completed: false
            }
            await setDoc(doc(db, "users", isLoggedIn.uid, "tasks", time.toString()), data)
            setTaskTitle("")
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTask = async (title) => {
        try {
            await deleteDoc(doc(db, "users", isLoggedIn.uid, "tasks", String(title)))
        } catch (error) {
            console.log(error.message)
        }
    }
    
    return(
        <div style={{height: "100%"}}>
            {(isLoggedIn) ? 
            <div style={{height:"95%"}}>  
                <div className="to-do-ui">{(userDocs) ? 
                    <div>
                        <div className="new-to-do">
                            <form className="task" onSubmit={newTaskHandler}>
                                <input className="new-input" 
                                placeholder="New Note" 
                                required
                                value={newTaskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}></input>
                                <div className="task-done" style={{ marginRight: "1.35vw" }}><button type="submit" style={{color: "inherit", padding: 0, font: "inherit",
                                cursor: "pointer", outline: "inherit", width: "100%", height: "1.8vw",
                                backgroundColor: "transparent", borderColor: "transparent", display: "flex", alignItems: "center"}}><div style={{fontSize: "3vw", position: "relative", bottom: "0.2vh"}}>+</div></button></div>
                            </form>
                        </div>
                        <div className="all-to-do">
                            {/*add something here about being done all tasks if they are*/}
                            {Object.values(userDocs).map((item) => {
                                return(
                                    <div className="task">
                                        <div className="task-text">
                                            <p><span className="task-title">{item["Title"]}</span></p>
                                            {((curr_time - (item.tOfCreate / 1000)) >= 604800) ? <p className="task-time">- {Math.floor((curr_time - (item.tOfCreate / 1000)) / 604800)} weeks ago </p> : 
                                            ((curr_time - (item.tOfCreate / 1000)) >= 86400) ? <p className="task-time">- {Math.floor((curr_time - (item.tOfCreate / 1000)) / 86400)} days ago </p> : 
                                            ((curr_time - (item.tOfCreate / 1000)) >= 3600) ? <p className="task-time">- {Math.floor((curr_time - (item.tOfCreate / 1000)) / 3600)} hours ago </p> : 
                                            ((curr_time - (item.tOfCreate / 1000)) >= 60) ? <p className="task-time">- {Math.floor((curr_time - (item.tOfCreate / 1000)) / 60)} mins ago</p> : <p className="task-time">- just now</p>}
                                        </div>
                                        <div className="task-done">
                                            <button className="task-button" onClick={() => deleteTask(item.tOfCreate)}></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div> 
                    : <p>Loading...</p>}
                </div>
            <div className="buttons">
                <div className="login-create" style={{backgroundColor: "rgb(0, 0, 0, 0.500)",
                    display:"flex", justifyContent:"center", alignItems:"center", width: "15%", paddingBottom: 0,
                    borderRadius: "1vw"}} onClick={logout}><p><span className="task-title">Sign-Out</span></p></div>
            </div>
            </div>
            :
            <div>
                <LoginInterface needCreate={needCreate} setNeedCreate={setNeedCreate} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            </div>
            }
        </div>
    );
}

export default ToDoList