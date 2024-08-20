import React, { useEffect } from "react";
import { useState } from "react";
import '../App.css'

const Clock = () => {
    var time = new Date();
    const [curr_time, setTime] = useState(time);

    const updateTime = () => {
        time = new Date();
        setTime(time)
        var hours = curr_time.getHours()
        var mins = curr_time.getMinutes()
    };

    useEffect(()=>{
        const interval = setInterval(()=>{
            updateTime()
        }, 60000);

        return () => {clearInterval(interval)}
        
    },[])

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

    
    return(
        <>
            <div className="clocktimer">{(curr_time.getHours() >= 13) ? (curr_time.getHours() - 12) : curr_time.getHours()}:{(curr_time.getMinutes() <= 9) ? (`0${curr_time.getMinutes()}`) : curr_time.getMinutes()}</div>
            <h2>{weekday[curr_time.getDay()]}, {month[curr_time.getMonth()]} {curr_time.getDate()}, {curr_time.getFullYear()}</h2>
        </>
    )
}

export default Clock 