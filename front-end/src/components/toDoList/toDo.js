import React from "react";
import { useState, useEffect } from "react";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";
import './toDo.css'

const ToDo = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const [needCreate, setNeedCreate] = useState(false);
     
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

    const signin = (e) =>{
        e.preventDefault();
        signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            setIsLoggedIn(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const newSignIn = (e) => {
        e.preventDefault();
        setPersistence(auth, browserLocalPersistence)
        .then(()=>{
            console.log("this is working??")
            console.log(auth)
            return signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        setIsLoggedIn(user)
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
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })
    }

    const noAccountHandler = () => {
        setNeedCreate(true)
    }

    const yesAccountHandler = () => {
        setNeedCreate(false)
    }
    
    return(
        <div>
            {(isLoggedIn) ? <p> signed in </p>
            :
            <div>
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
                </div> :
                <div className="login">
                    <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onSubmit={newSignIn}>
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
                </div>}
            </div>
            }
        </div>
    );
}

export default ToDo
