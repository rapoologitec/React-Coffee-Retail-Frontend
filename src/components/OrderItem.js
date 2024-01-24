import React, {useContext, useState} from "react";
import {Accordion, Jumbotron, Table} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Timestamp from "react-timestamp"
import {Redirect} from "react-router-dom";
import {EndPointContext} from "../App";
import Modal from "react-bootstrap/Modal";
import "./order.css"


function OrderItem(props){
    let item = props.order
    const timeCreated = new Date(props.order.created)
    const timeDiscount = new Date(timeCreated.getTime() + 600000)
    const [redirect, setRedirect] = useState(null)
    const URLBase = useContext(EndPointContext)
    const getOrderURL = URLBase + "/customer/myOrders"
    const changeURL = URLBase + "/order/" + props.order._id
    const snackURL = URLBase + '/snack'
    const [show, setShow] = useState(false);
    const handleClose = () => window.location.reload();
    const handleShow = () => setShow(true);

    //get string of stars for rating
    function getStars(rating) {
        let i
        let res = ""
        for(i = 0; i < rating; i++){
            res = res + "★"
        }
        return res
    }


    function showDiscount() {
        if (props.order.status === "pending"){
            return <h3>Discount <Timestamp relative date={timeDiscount} autoUpdate /> </h3>
        }else{
            return <></>
        }
    }

    function handleAddComment(){
        localStorage.setItem("currentOrder", props.order._id)
        setRedirect("/addComment")
    }

    //show review, if no review, show a button to add one
    function showReviewBlock(){
        if (props.order.status === "finished"){
            if (item.review === ""){
                return (
                    <div>
                        <Button variant={"primary"} size={"lg"} onClick={handleAddComment}>Leave A Comment</Button>
                    </div>
                )
            }else {
                return (<Accordion defaultActiveKey={"0"}>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant={"link"} eventKey={"0"}>
                                Hide/Show Review
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={"0"}>
                            <Card.Body>
                                <h3>Rating: {getStars(item.rating)}</h3>
                                <Card.Text>Review: {item.review}</Card.Text>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>)
            }
        }
    }


    function handleChange(changeType){
        let accessCode = "Bearer " + localStorage.getItem("accessToken")
        //check current status of order.
        fetch(getOrderURL,{method:"GET", headers:{
                "Authorization": accessCode
            }}).then(res=> {
            if (res.status !== 200) throw new Error("cannot fetch orders")
            return res.json()
        })
            .then(result=>{
                console.log(result)
                let order;
                for(order in result){
                    console.log(result[order])
                        if (result[order]._id === props.order._id){

                            if(result[order].status === "pending"){
                                if(changeType === "change"){
                                    //this is used when user are kicked back to the menu. submit order to same vendor
                                    localStorage.setItem("vendorID", result[order].vendorId)
                                     changeOrder()
                                }else{
                                    cancelOrder()
                                }

                            }
                            else(handleShow())
                    }

                }
            }).catch(err => console.log(err))
    }

    function cancelOrder(){
        let accessCode = "Bearer " + localStorage.getItem("accessToken")
        fetch(changeURL, {method:"PATCH", headers:{'Authorization': accessCode,
                'Content-Type': 'application/json'
            },body:JSON.stringify(
                {
                    'status':'cancelled'
                })
        }).then(res =>{
            if (res.status !== 200) throw new Error("cannot update")
            return res.json()
        }).then(r=>{
            console.log(r)
            window.location.reload()
            //refresh to remove cancelled order.
        })
    }

    function changeOrder(){
        //setting up a cart based on current order
        setNewCart()
    }

    function setNewCart(){
        //get menu to set cart
        fetch(snackURL, {
            method: "GET", headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (res.status !== 200) throw new Error("cannot fetch menu")
            return res.json()
        }).then(data => {
            initializeCart(data)
            //cancel the old order and send user back to menu
            cancelOrder()
            setRedirect("/menu")
            return JSON.stringify(data)
        }).catch(err => console.log(err))
    }

    function initializeCart(data) {
        if (data.length !== 0) {
            let cart = [];

            let snack;
            for (snack of data) {
                let info;
                info = {_id: snack._id, name: snack.name, price: snack.price, qty: findQuantity(snack._id)}
                cart.push(info)
            }
            localStorage.setItem("cart", JSON.stringify(cart))
        }
    }

    function findQuantity(snackID){
        for(let i = 0; i < props.order.orderItem.length; i++){
            if (props.order.orderItem[i]._id === snackID){
                return props.order.orderItem[i].qty
            }
        }
        return 0;
    }

    function showCancel(){
        if (props.order.status === "pending"){
            if(timeDiscount > Date.now()){
                return <div>
                    <Button variant={"warning"} size={"lg"} onClick={() => {handleChange("cancel")}}>Cancel Order</Button>
                    <Button variant={"secondary"} size={"lg"} onClick={() =>{handleChange("change")}}>Change Order</Button>
                </div>
            } else return <li>your order has been placed for more than 10 min, therefore cannot be changed or cancelled</li>
        }
    }

    if (props.order.status === "cancelled"){
        return <></>
    }

    if (redirect){
        return <Redirect to={redirect}/>
    }

    return (
        <div className="order-box">
            <Jumbotron className="order-box-Jumbotron">
                <h1>{item.status}</h1>
                <h2>Items</h2>
                <Table>
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {item.orderItem.map(food=>{
                        return(<tr key={food._id}>
                            <th>{food.name}</th>
                            <th>{food.qty}</th>
                        </tr>)
                    })}
                    </tbody>
                </Table>
                <h2>Total Amount: ${parseFloat(item.amount).toFixed(2)}</h2>
                {showDiscount()}
                {showReviewBlock()}
                {showCancel()}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Oops...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Sorry, your order has already been fulfilled, therefore cannot be cancelled</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Refresh Page
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Jumbotron>
        </div>
    )
}

export default OrderItem