import React, { useState, useEffect } from "react";
import './toDo.css'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, indexedDBLocalPersistence, onAuthStateChanged, signOut } from "firebase/auth/web-extension";
import { collection, addDoc } from "firebase/firestore";

import { auth, db } from "../../firebase.js"

const LoginInterface = ({needCreate, setNeedCreate, isLoggedIn, setIsLoggedIn}) => {

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(user);
            } else {
                setIsLoggedIn(null)
            }
        });
        return () => unsubscribe();
    })
    
    const signIn = (e) => {
        e.preventDefault();
        setPersistence(auth, indexedDBLocalPersistence)
        .then(()=>{
            console.log(auth)
            return signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        setIsLoggedIn(user)
                    })
                    .then(()=> {
                        console.log(auth)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                    });
        });
    }

    const create = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
        .then((userCredential) =>{
            console.log("successful!")
            const user = userCredential.user;
            setIsLoggedIn(user)
            setNeedCreate(false)
            console.log(user)
            addUserToDB(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
    }
    
    const addUserToDB = async(user) => {
        try{
            const id = user.uid
            const docRef = await addDoc(collection(db, "users"), {
                id : {
                    tasks: {},
                    timeSaved: 0
                }
            });
        } catch (e) {
            console.error("Error initializing document", e)
        }
    }
        
    const logout = () => {
        signOut(auth).then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }

    const noAccountHandler = () => {
        setNeedCreate(true)
    }

    const yesAccountHandler = () => {
        setNeedCreate(false)
    }

    return(
        <>
        {(needCreate) ?
        <div className="login">
            <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onSubmit={create}>
                <div style={{ width:'80%', textAlign:'left', fontSize:'1vw', paddingTop:'3%' }}>
                    Email:
                    <input className="cred-form" type="text" name="email" />
                </div>
                <div style={{ width:'80%', textAlign:'left', fontSize:'1vw', paddingTop:'3%' }}>
                    Password:
                    <input className="cred-form" type="password" name="password" />
                </div>
                <button className="login-go" type="submit">Sign Up</button>
            </form>
            <div className="login-create" onClick={yesAccountHandler}>Already have an account? Sign in</div>
        </div>
        : <div className="login">
            <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onSubmit={signIn}>
                <div style={{ width:'80%', textAlign:'left', fontSize:'1vw', paddingTop:'3%' }}>
                    Email:
                    <input className="cred-form" type="text" name="email" />
                </div>
                <div style={{ width:'80%', textAlign:'left', fontSize:'1vw', paddingTop:'3%' }}>
                    Password:
                    <input className="cred-form" type="password" name="password" />
                </div>
                <button className="login-go" type="submit">Sign In</button>
            </form>
            <div className="login-create" onClick={noAccountHandler}>Don't have an account? Create one</div>
        </div>
        }
        </>
    )
}

export default LoginInterface