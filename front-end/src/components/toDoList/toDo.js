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

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            console.log("No such document!")
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
                <div>signed in</div> 
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
