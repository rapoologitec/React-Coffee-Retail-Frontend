import React, {useContext, useEffect, useRef, useState} from "react";
import Alert from "react-bootstrap/Alert";
import {FormGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./VenderSuccessLogin.css"
import Button from "react-bootstrap/Button";
import {EndPointContext} from "../App";
import {Redirect} from "react-router-dom";


function VendorSuccessLogin(){
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    const [description, setDescription] = useState("")
    const URLEndContext = useContext(EndPointContext)
    const patchURL = URLEndContext + "/vendor"
    const [redirect, setRedirect] = useState(false)


    function validForm(){
        return description.length >= 1
    }

    function handleClick(){
        console.log(description)
        postChanges()
        setRedirect(true)

    }


    function postChanges(){
        let token = localStorage.getItem("accessToken")
        let bearerToken = "Bearer " + token


        fetch(patchURL, {
            method: "PATCH", headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerToken,
            },
            body: JSON.stringify({
                'isReady': true,
                'lon': lon.current,
                'lat': lat.current,
                'description': description
            })
        }).then(res => {
            if (res.status !== 200) throw new Error("cannot update")
            return res.json()
        }).then(data => {
            console.log(JSON.stringify(data))
        }).catch(err => console.log(err))
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
    //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API


    // if cannot get location, use default, Federal Sqr, Melb
    const lat = useRef(-37.8148466);
    const lon = useRef(144.9685771);

    function handle(pos){
        //console.log(pos) pos is an obj, also has accuracy, timestamp fields
        lat.current = pos.coords.latitude;
        lon.current = pos.coords.longitude;
        console.log(lat)
        //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}` // for debug
    }

    function fail(error){
        alert("Unable to retrieve your position, please try again");
        //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}` // for debug
    }

    useEffect(()=>{
        console.log(JSON.stringify({
            isReady:true
        }))
        if (navigator.geolocation) {
            //getCurrentPostion(successCallback, failCallback, options),
            //each callback takes in one parameter
            navigator.geolocation.getCurrentPosition(handle, fail, options)
        } else {
            alert("Geolocation is not supported!")
            //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}`// for debug
        }

    }, [])


    if (redirect){
        return <Redirect to={"/vendorOrder"}/>
    }

    return(
        <div>
            <h1>
                G'day!
            </h1>
            <Alert variant={"primary"}>
                Your Geolocation has been recorded, add a description to get into business!
            </Alert>
            <Form className={"Form"}>
                <FormGroup controlId={"description"}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control placeholder="Enter here"
                                  type="text"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}/>
                    <Form.Text className="text-muted">
                        Put some descriptive information about where you at.
                    </Form.Text>
                </FormGroup>
            </Form>
            <Button size="lg" type="submit" disabled={!validForm()} onClick={handleClick}>Get online</Button>
        </div>
    )
}

export default VendorSuccessLogin