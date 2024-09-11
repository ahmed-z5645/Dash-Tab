import React, { useState, useEffect } from "react";
import './timer.css';

const Timer = () => {
        [timeLeft, setTimeLeft] = useState(600000)

        const counting = () => {
            if (timeLeft !== 0) {
                setTimeLeft(timeLeft - 1)
            }
        }

        useEffect(()=>{
            const interval = setInterval(() => {
                counting()
            }, 1000)

            return () => {clearInterval(interval)}
        }, [timeLeft])
        
    return(
        <div>

        </div>
    )
}

export default Timer