import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import {Jumbotron} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import MapItem from "./MapItem";
import './style.css'
import './VendorSelectItem.css'

export default function VendorSelectItem(props){
    const [redirect, setRedirect] = useState(false)
    const [showMap, setShowMap] = useState(false)
    let lat = props.item.lat
    let lon = props.item.lon
    let variant
    let buttonTxt
    let availability
    if (props.item.isReady === true){
        variant = "primary"
        buttonTxt = "order"
        availability = "Open"
    }else{
        variant = "Secondary"
        buttonTxt = "not Available"
        availability = "Closed"
    }


    function displayMap(){
        if (showMap){
            return <>
                <Button variant={"secondary"} size={"lg"} onClick={()=>{setShowMap(false)}}>Hide Map</Button>
                <MapItem item={props.item}/>
            </>
        }else{
            return <Button variant={"secondary"} size={"lg"} onClick={()=>{setShowMap(true)}}>Show on Map</Button>
        }
    }




    function handleClick(){
        if (props.item.isReady === true){
            localStorage.setItem("vendorID", props.item._id)
            setRedirect(true)
        }
        //do nothing if vendor is not available
    }

    if (redirect){
        return <Redirect to={"/menu"}/>
    }

    return(
        <div className="Vendorpage">
            <Jumbotron >
                <h1 >{props.item.funName}</h1>
                <h2>{props.item.description}</h2>
                <Button variant={variant} onClick={handleClick} size={"lg"}>
                    {buttonTxt}

                </Button>
                {displayMap()}


            </Jumbotron>
        </div>
    )
}

