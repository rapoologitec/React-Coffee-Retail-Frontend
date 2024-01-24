import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router-dom";

function Stop(){
    const [redirect, setRedirect] = useState(null)

    function handleRestart(){
        setRedirect("/vendorsuccesslogin")
    }

    function handleLogOff(){
        localStorage.removeItem("accessToken")
        localStorage.removeItem("vendorId")
        localStorage.removeItem("vendorLogIn")
        setRedirect("/")
    }

    if(redirect){
        return <Redirect to={redirect}/>
    }

    return (
        <div>
            <h1>Business Paused</h1>

            <h2>You can either:</h2>
            <div>

                <Button style={{minWidth:300}} variant={"primary"} size={"lg"} onClick={handleRestart}>Restart Somewhere Else</Button>
            </div>
            <h3>or</h3>
            <div>
                <Button style={{minWidth:300}} variant={"warning"} size={"lg"} onClick={handleLogOff}>Log Off</Button>
            </div>
        </div>
        )
}

export default Stop