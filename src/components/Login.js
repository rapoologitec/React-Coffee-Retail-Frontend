import React, { useState, useContext } from 'react';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button";
import './Login.css'
import { Redirect } from "react-router-dom";
import { EndPointContext } from '../App.js'


export default function Login(props) {
  const URLEndContext = useContext(EndPointContext)
  const loginURL = URLEndContext + '/customer/login'

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [loginFailed, setLoginFailed] = useState(false)

  function handleClick(e) {
    e.preventDefault()
     /* Send the POST request and save JWT to localStorage */
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
     localStorage.setItem("refreshToken", data['refreshToken'])
     localStorage.setItem("customerId", data['customerId'])
     localStorage.setItem("logIn", "true")
     props.setIsLoggedIn(true)
      if (localStorage.getItem("logInFrom") === "menu"){
        setRedirect('/menu')
      } else{
        setRedirect("/")
      }

   })
   .catch(err => {console.error(err); setLoginFailed(true)})

   //clean the email and pw fields
   setPassword('')
  }

  function validForm() {
    return username.length > 0 && password.length > 0
  }
  // react-boot strap buttons
  // https://react-bootstrap.github.io/components/buttons/
    if (redirect) {
       return (<Redirect to={redirect} />);
     }
    if (loginFailed){
      return (<>

        <div className="Login">
          <Alert variant="danger">
            Incorrect Username/Password!
          </Alert>
        <Form >
          <Form.Group size="lg" controlId="email">
            <Form.Label>Username</Form.Label>
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
      </>
      )
    }
    return (
      <div className="Login">
        <Form >
          <h1>Login</h1>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}/>
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
          <p>Does not have an account? <a href="/Signup">Sign up</a> </p>
        </Form>
      </div>
    )

}
