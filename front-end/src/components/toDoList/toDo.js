import React from "react";
import { useState, useEffect } from "react";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, indexedDBLocalPersistence, onAuthStateChanged, signOut } from "firebase/auth/web-extension";
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from "../../firebase.js";
import './toDo.css'

import LoginInterface from './auth.js'

const ToDoList = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [needCreate, setNeedCreate] = useState(false);
    const [userInfo, setUserInfo] = useState(null)
    const [curr_time, setCurrT] = useState(null);

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
        const docSnap = await getDoc(docRef)
        
        if (!userInfo){
            console.log('here')
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserInfo(docSnap.data().tasks)
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
    
    return(
        <div>
            {(isLoggedIn) ? 
            <div>  
                <div className="to-do-ui">{(userInfo) ? 
                    <div>
                        <div className="new-to-do">
                            <form className="task">
                                <input></input>
                                <button type="submit">new item</button>
                            </form>
                        </div>
                        <div className="all-to-do">
                            {Object.values(userInfo).map((item) => {
                                return(
                                    <div className="task">
                                        <div className="task-text">
                                            <p><span className="task-title">{item.Title}</span></p>
                                            {((curr_time - item.tOfCreate.seconds) >= 604800) ? <p className="task-time">- {Math.floor((curr_time - item.tOfCreate.seconds) / 604800)} weeks ago </p> : 
                                            ((curr_time - item.tOfCreate.seconds) >= 86400) ? <p className="task-time">- {Math.floor((curr_time - item.tOfCreate.seconds) / 86400)} days ago </p> : 
                                            ((curr_time - item.tOfCreate.seconds) >= 3600) ? <p className="task-time">- {Math.floor((curr_time - item.tOfCreate.seconds) / 3600)} hours ago </p> : 
                                            ((curr_time - item.tOfCreate.seconds) >= 60) ? <p className="task-time">- {Math.floor((curr_time - item.tOfCreate.seconds) / 60)} mins ago</p> : <p className="task-time">- just now</p>}
                                        </div>
                                        <div className="task-done">
                                            <button className="task-button"></button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div> 
                    : <p>Loading...</p>}</div>
                <div className="login-create" onClick={logout}> Sign-Out </div>
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