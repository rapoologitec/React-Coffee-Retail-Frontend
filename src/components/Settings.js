import React, { useState, useEffect, useContext } from 'react';
import { EndPointContext } from '../App.js'
import { Redirect } from "react-router-dom";
import {Form, Alert, Button} from "react-bootstrap/"
import "./Settings.css"

export default function Settings(){
    const [fetchDetailFailed, setFetchDetailFailed] = useState(false)
    const URLEndContext = useContext(EndPointContext)
    const detailsURL = URLEndContext + '/customer/details'
    const updateURL = URLEndContext + '/customer/update'

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")

    const [saveChangeSuccess, setSaveChangeSuccess] = useState()
    const [saveChangeFailed, setSaveChangeFailed] = useState()
    
    
    let tk = localStorage.getItem('accessToken')
    //if (tk == null) { return (<Redirect to='/CustomerLogin' />); }
    const accessToken = "Bearer " + tk

    useEffect(() => {
        fetch(detailsURL, {method: 'GET', headers: {"Authorization": accessToken}})
        .then(
            res => {
                if (res.status !== 200) throw new Error("Cannot get detail")
                return res.json()
            }
        )
        .then( res => {
            setFirstName(res['firstName'])
            setLastName(res['lastName'])
            setEmail(res['email'])
            setUsername(res['username'])
        })
        .catch(err => {console.log(err); setFetchDetailFailed(true); })
    }
    ,[]) // Run when component is mounted

    function handleSubmit(e){
        e.preventDefault()

        let payload = {}
        if (firstName.length != 0) payload.firstName = firstName 
        if (lastName.length != 0) payload.lastName = lastName 
        if (email.length != 0) payload.email = email 
        if (username.length != 0) payload.username = username
        if (password.length >= 8) payload.password = password 

        fetch(updateURL, { 
          method:"POST", 
          headers: {"Authorization": accessToken, "Content-Type": "application/json"}, 
        body: JSON.stringify(payload)
      }).then(res => { 
        if (res.status != 200) { throw new Error("Cannot save changes")}
        setSaveChangeSuccess(true);
      }).catch(err => {console.error(err); setSaveChangeFailed(true)})
    }

    function validForm(){
        return password.length == 0 || password.length >= 8
    }


    if (fetchDetailFailed) {
        if (tk == null) { return (<Redirect to='/CustomerLogin' />); }
        return (
            <Alert variant="danger">
                Cannot get detail!
                <Alert.Link href="/"> Go Home</Alert.Link>
          </Alert>
        )
    }

    if (saveChangeSuccess) {
      return (
        <>
      <Alert variant="success">
        Changes Saved!
        <Alert.Link href="/"> Go Home</Alert.Link>
      </Alert>
      
      </>
      )
    }

    if (saveChangeFailed) {
      return (
        <>
      <Alert variant="alert">
        Cannot save changes! <Alert.Link href="/"> Go Home</Alert.Link>
      </Alert> 
      
      </>

      )
    }

    return (
        <div className="Settings">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="Change Your Email Address"
              autoFocus
              type="email"
              value={email}
              onChange={(e) => { 
                  setEmail(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Username
            </Form.Label>
            <Form.Control
              placeholder="Change Your username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value);}}
          />
         </Form.Group>
  
          <Form.Group>
            <Form.Label>
              First Name
            </Form.Label>
            <Form.Control
              placeholder="Change Your Firstname"
              type="text"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value);}}
          />
         </Form.Group>
  
         <Form.Group>
            <Form.Label>
              Last Name
            </Form.Label>
            <Form.Control
              placeholder="Change Your Lastname"
              type="text"
              value={lastName}
              onChange={(e) => {setLastName(e.target.value);}}
          />
         </Form.Group>
  
          <Form.Group size="sm">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Change Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" block size="lg" type="submit" className="btn" disabled={!validForm()}>
            Save Changes
          </Button>
        </Form>
        </div>

    )
    
}