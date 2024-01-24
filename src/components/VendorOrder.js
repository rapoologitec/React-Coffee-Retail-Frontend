import React, {useContext, useEffect, useState} from "react";
import {EndPointContext} from "../App";
import VendorOrderItem from "./VendorOrderItem";
import Button from "react-bootstrap/Button";
import "./VendorOrder.css"
import {Redirect} from "react-router-dom";




function VendorOrder(){
    const [order, setOrder] = useState([])
    const URLEndContext = useContext(EndPointContext)
    const getOrderURL = URLEndContext + "/vendor/allOrders"
    const patchURL =URLEndContext + "/vendor"
    const [redirect, setRedirect] = useState(false)


    useEffect(()=>{
        getOrderVendor()
    }, [])

    function getOrderVendor(){
        let token = localStorage.getItem("accessToken")
        let bearerToken = "Bearer " + token
        fetch(getOrderURL,
            {method:"GET", headers:{
                    "Content-Type": "application/json",
                    "Authorization": bearerToken
            }}) .then(res => {
                if(res.status !== 200) throw new Error("cannot get order.")
                return res.json();
        }) .then(r => {
            setOrder(r)
            console.log(r)
        })
    }

    function handleStop(){
        let token = localStorage.getItem("accessToken")
        let bearerToken = "Bearer " + token


        fetch(patchURL, {
            method: "PATCH", headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerToken,
            },
            body: JSON.stringify({
                'isReady': false,
                'lon': 0,
                'lat': 0,
            })
        }).then(res => {
            if (res.status !== 200) throw new Error("cannot update")
            return res.json()
        }).then(data => {
            console.log(JSON.stringify(data))
            setRedirect(true)
        }).catch(err => console.log(err))
    }

    function handleClickRefresh(){
        window.location.reload()
    }

    if (redirect){
        return <Redirect to={"/vendorStop"}/>
    }

    return (
        <div>
            <h1>Orders</h1>
            <div style={{flexDirection: "row"}}>
                <Button variant={"danger"} size={"lg"} onClick={handleStop}>Stop Taking Orders</Button>
                <Button variant={"primary"} size={"lg"} className="button" onClick={handleClickRefresh}>Refresh</Button>
            </div>

            {order.map((orderItem)=>{
                if(orderItem.status === "pending" || orderItem.status === "fulfilled") {
                    return <VendorOrderItem order={orderItem}/>
                }
            })}
        </div>
    )

}

export default VendorOrder