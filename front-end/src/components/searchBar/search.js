import React, { useState } from "react";
import { redirect } from "react-router-dom";
import './search.css'

const Search = () => {

    const [searchString, setSearchString] = useState("")

    const searchHandler = (e) => {
        e.preventDefault()
        console.log(searchString)
        window.open(`https://www.google.com/search?q=${searchString}`, "_self")
    }

    return(
        <div className="search-bar">
            <form onSubmit={searchHandler} style={{ display: "flex", alignItems: "center"}}>
                <input placeholder="Search..." className="search-bar-input" onChange={(e) => {setSearchString(e.target.value)}}></input>
                <button type="submit" className="search-bar-go"><img src="/search.svg" width="100%"/></button>
            </form>
        </div>
    )
}

export default Search