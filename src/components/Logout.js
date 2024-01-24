import React, {useContext, useEffect, useState} from 'react';
import {EndPointContext} from '../App.js'
import {Alert} from "react-bootstrap"

export default function Logout(){
    const URLEndContext = useContext(EndPointContext)
    const URLEndPoint = URLEndContext + '/customer/logout'
    const refreshToken = localStorage.getItem('refreshToken')
    const [logoutFailed, setLogoutFailed] = useState(false)
    const [logoutSuccess, setLogoutSuccess] = useState(false)

    // should only run once
    useEffect(
        () => {
            fetch(URLEndPoint, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({
                    token: refreshToken
                })
        
            }).then(res => {
                if (res.status !== 200) throw new Error("Cannot logout")
                console.log(res)
                return res.json()
            }).then(res => {
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('accessToken')
                localStorage.removeItem("logIn")
                localStorage.removeItem("customerId")
                setLogoutSuccess(true)
            }).catch(err => {
                console.error(err)
                setLogoutFailed(true)
            })
        }
        ,[])
    

    if (logoutFailed){
        return (
        <Alert variant="danger" dismissible>
        Oops! Logout failed 
        <Alert.Link href="/"> Go Home</Alert.Link>
        </Alert>
      )
    }

    if (logoutSuccess){
        return (
        <Alert variant="info" dismissible>
            Logout success <Alert.Link href="/"> Go Home</Alert.Link>
        </Alert>
        )
    }

    return (
        <>
        </>
    )

}