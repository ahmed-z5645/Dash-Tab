import React from "react";

import './focus.css'

const Focus = () => {

    return(
        <div className="cont">
            <div className="habit">
                <div className="title">Git Push</div>
                <div className="progress-bar"></div>
                <div className="buttons">
                    <div className="done"></div>
                    <div className="rest"></div>
                    <div className="remove-habit"></div>
                </div>
            </div>
            <div className="habit">
                <div className="title">Journal</div>
                <div className="progress-bar"></div>
                <div className="buttons">
                    <div className="done"></div>
                    <div className="rest"></div>
                    <div className="remove-habit"></div>
                </div>
            </div>
            <div className="habit">
                <div className="title">Workout</div>
                <div className="progress-bar"></div>
                <div className="buttons">
                    <div className="done"></div>
                    <div className="rest"></div>
                    <div className="remove-habit"></div>
                </div>
            </div>
            <a href="https://ahmedzafar.me" style={{}}><p>Learn more about Dash-tab and it's developer, report a bug, request new feature, or say hi!</p></a>
        </div>
    )
}

export default Focus