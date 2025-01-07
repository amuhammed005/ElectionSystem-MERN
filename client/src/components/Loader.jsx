import React from 'react'
import Spinner from "../assets/loader.gif";

const Loader = () => {
  return (
    <section className="loader">
        <div className="loader_container">
            <img src={Spinner} alt="Loading spinner" />
        </div>
    </section>
  )
}

export default Loader