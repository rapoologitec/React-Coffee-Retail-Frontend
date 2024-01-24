import React, { useState, useContext } from 'react';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import { EndPointContext } from '../App.js'
import './VendorLogin.css'


export default function Login(props){
    const URLEndContext = useContext(EndPointContext)
    const loginURL = URLEndContext + '/vendor/login'
    const [redirect, setRedirect] = useState(null)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginFailed, setLoginFailed] = useState(false)

    function validForm(){
        return username.length >= 4 && password.length >= 4  // for now
    }

    function handleClick(e){
        e.preventDefault();
        fetch(loginURL, { method: 'POST', headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password})
         })
         .then(res => {
           console.log(JSON.stringify({username: username, password: password}))
           if (res.status !== 200) throw new Error("Incorrect Credentials")
           return res.json()
         })
         .then(data => {
          localStorage.setItem("accessToken", data['accessToken'])
          localStorage.setItem("vendorId", data['vendorId'])
            localStorage.setItem("vendorLogIn", "true")
             setRedirect("/vendorsuccesslogin")
            //alert("Successfully login!")
        })
        .catch(err => {console.error(err); setLoginFailed(true)})
        setPassword("")
    }


    if (loginFailed){
        return (
          <div className="VendorLogin">    
            <Alert variant="danger">
            Incorrect Username/Password!
           </Alert>
           <Form>         
              <Form.Group size="lg" controlId="email">
              <Form.Label className="login-username">Vendor Username</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validForm()} onClick={handleClick}>
              Login
            </Button>
          </Form>
        </div>
        )
    }

    if (redirect){
        return <Redirect to={redirect}/>
    }
    return (
        <div className="VendorLogin">
          <Form>
            <h1 className="login-text">Vendor Login</h1>
            <Form.Group size="lg" controlId="email">
              <Form.Label>Vendor Username</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!validForm()} onClick={handleClick}>
              Login
            </Button>
          </Form>
        </div>
      )
}