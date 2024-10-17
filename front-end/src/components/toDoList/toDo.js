import React from "react";
import { useState, useEffect } from "react";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, indexedDBLocalPersistence, onAuthStateChanged, signOut } from "firebase/auth/web-extension";
import { doc, getDoc, addDoc, updateDoc, setDoc, collection, orderBy, getDocs, deleteField, deleteDoc } from 'firebase/firestore'
import { auth, db } from "../../firebase.js";
import './toDo.css'

import LoginInterface from './auth.js'

const ToDoList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [needCreate, setNeedCreate] = useState(false);
    const [userInfo, setUserInfo] = useState({})
    const [curr_time, setCurrT] = useState(null);
    const [newTaskTitle, setTaskTitle] = useState(null);

    var time = new Date()
    useEffect(()=>{
        const time = new Date();
        setCurrT(Math.floor(time.getTime()/1000))
    }, [])

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(user);
                getAllDocs(user)
            } else {
                setIsLoggedIn(null)
            }
        });
        return () => unsubscribe();
    })

    const getAllDocs = async(user) =>{
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef, orderBy("tOfCreate"))
        console.log("hi")
        if (Object.keys(userInfo).length == 0){
            if (docSnap.exists()) {
                //do we need smt here for the case where the user has no tasks?
                const data = docSnap.data().tasks
                const sortedKeys = Object.keys(data).map(Number).sort((a, b) => b - a)
                const sortedData = sortedKeys.reduce((acc, key) => {
                    acc[key] = data[key];
                    return acc;
                }, {});
                setUserInfo(sortedData)
            } else {
                console.log("No such document!")
            }
        }
    }

    const logout = () => {
        signOut(auth).then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }

    const newTaskHandler = async(e) => {
        e.preventDefault()
        try {
            const time = new Date();
            const real = time.getTime()
            const data = { tasks : {
                            [real.toString()] : {
                                Title: newTaskTitle,
                                tOfCreate: real,
                                completed: false
                                }
                        }
                    }
            const userSubCollec = collection(db, "users", isLoggedIn.uid)
            await addDoc(userSubCollec, data, {merge:true})
            
            const docRef = doc(db, "users", isLoggedIn.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data().tasks
                const sortedKeys = Object.keys(data).map(Number).sort((a, b) => b - a)
                const sortedData = sortedKeys.reduce((acc, key) => {
                    acc[key] = data[key];
                    return acc;
                }, {});
                setUserInfo(sortedData)
            } else {
                console.log("No such document!")
            }

            setTaskTitle(null)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTaskHelp = async(template, docRef) => {
        try {
            await deleteDoc(docRef).then(() => {
                console.log("Doc deleted successfully")
                setUserInfo(template)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteTask = async (title) => {
        let temp = {...userInfo}
        delete temp[String(title)];
        const data = {
            tasks: temp
        }
        const userSubCollec = doc(db, "users", isLoggedIn.uid, "tasks", String(title))
        console.log(userSubCollec)
        await deleteTaskHelp(temp, userSubCollec)
        console.log(userInfo)
    }
    
    return(
        <div style={{height: "100%"}}>
            {(isLoggedIn) ? 
            <div style={{height:"95%"}}>  
                <div className="to-do-ui">{(userInfo) ? 
                    <div>
                        <div className="new-to-do">
                            <form className="task" onSubmit={newTaskHandler}>
                                <input className="new-input" 
                                placeholder="New Task" 
                                required
                                onChange={(e) => setTaskTitle(e.target.value)}></input>
                                <div className="task-done" style={{ marginRight: "1.35vw" }}><button type="submit" style={{color: "inherit", padding: 0, font: "inherit",
                                cursor: "pointer", outline: "inherit", width: "100%", height: "1.8vw",
                                backgroundColor: "transparent", borderColor: "transparent", display: "flex", alignItems: "center"}}><div style={{fontSize: "3vw", position: "relative", bottom: "0.2vh"}}>+</div></button></div>
                            </form>
                        </div>
                        <div className="all-to-do">
                            {/*add something here about being done all tasks if they are*/}
                            {Object.values(userInfo).map((item) => {
                                return(
                                    <div className="task">
                                        <div className="task-text">
                                            <p><span className="task-title">{item.Title}</span></p>
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
            <div className="login-create" style={{backgroundColor: "rgb(0, 0, 0, 0.500)", borderRadius: "0.5vw",
                    display:"flex", justifyContent:"center", alignItems:"center", width: "15%", paddingBottom: 0,
                    margin: "auto", height: "5%"}}onClick={logout}><p>Sign-Out</p></div>
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