import React, {Component, useContext, useEffect, useState} from 'react';
import TimeAgo from "react-timeago";
import Timestamp from "react-timestamp"
import Button from "react-bootstrap/Button";
import {Accordion, ButtonGroup, Jumbotron, Table} from "react-bootstrap";
import {EndPointContext} from "../App";
import Card from "react-bootstrap/Card";

function VendorOrderItem(props){
    const URL = useContext(EndPointContext)
    const patchURL = URL + "/order/" + props.order._id

    console.log(props.order)
    const timeCreated = new Date(props.order.created)
    const timeDiscount = new Date(timeCreated.getTime() + 600000)
    const [buttonVariant, setButtonVariant] = useState("")
    const [buttonText, setButtonText] = useState("")



    useEffect(()=>{
        if(props.order.status === "pending"){
            console.log("yesss")
            setButtonText("Fulfill")
            setButtonVariant("primary")
        }else if (props.order.status === "fulfilled"){
            setButtonText("Picked Up")
            setButtonVariant("warning")
        }
    },[])

    function handleClick(){
        if (props.order.status === "pending"){
            patchChanges("fulfilled")
            console.log("go")
        }
        if (props.order.status === "fulfilled"){
            patchChanges("finished")
        }
        //window.location.reload()
    }

    function patchChanges(nextStage){
        let token = localStorage.getItem("accessToken")
        let bearerToken = "Bearer " + token


        fetch(patchURL, {
            method: "PATCH", headers: {
                'Content-Type': 'application/json',
                'Authorization': bearerToken,
            },
            body: JSON.stringify({
                'status': nextStage,
            })
        }).then(res => {
            if (res.status !== 200) throw new Error("cannot update")
            return res.json()
        }).then(data => {
            console.log(JSON.stringify(data))
            window.location.reload()
        }).catch(err => console.log(err))
    }


    return(
        <div>
            <Jumbotron>
                <h2>
                    Order for {props.order.givenName}
                </h2>
                <h2>
                    Discount <Timestamp relative date={timeDiscount} autoUpdate />
                </h2>
                <Accordion defaultActiveKey={"1"}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                See Details
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={"0"}>
                            <Card.Body>
                                <h3>Item List</h3>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Item Quantity</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {props.order.orderItem.map(food=>{
                                        return(<tr key={food._id}>
                                            <th>{food.name}</th>
                                            <th>{food.qty}</th>
                                        </tr>)
                                    })}
                                    </tbody>
                                </Table>
                                <h4>Order placed: <Timestamp date={timeCreated} /></h4>
                                <h4>Order Number: {props.order._id}</h4>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <Button variant={buttonVariant} size={"lg"} onClick={handleClick}>{buttonText}</Button>
            </Jumbotron>
        </div>
    )
}

export default VendorOrderItem