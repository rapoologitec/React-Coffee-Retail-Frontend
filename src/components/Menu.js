import React, {useEffect, useState, Component, useContext} from "react";
import MenuCard from "./Menucard";
import {Modal, Button, CardDeck, CardColumns} from "react-bootstrap";
import './Menu.css'

import {EndPointContext} from '../App.js'
import {Redirect} from "react-router-dom"
import ModalHeader from "react-bootstrap/ModalHeader";




function Menu(props) {
    const URLEndContext = useContext(EndPointContext)
    const postOrderURL = URLEndContext + '/order'
    const snackURL = URLEndContext + '/snack'
    const [snacks, setSnacks] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [show, setShow] = useState(false)
    const [confirmShow, setConfirmShow] = useState(false)
    const [orderPosted, setOrderPosted] = useState(false)
    const [cartLoaded, setCartLoaded] = useState(false)


    function setup(){
        let quickfix;
        quickfix = getMap();
        console.log(localStorage.getItem("SnackJSON"))

    }

    function getMap(){

        if (localStorage.getItem("SnackJSON") !== null && localStorage.getItem("SnackJSON").length!==1){
            //this length check is here because some weird behavior presented by Chrome... on SOME computers donno Y but heres a fix
            console.log(localStorage.getItem("SnackJSON"))
            initializeCart(JSON.parse(localStorage.getItem("SnackJSON")))

        }
        else {
            console.log("oK")
            fetch(snackURL, {
                method: "GET", headers: {
                    'Content-Type': 'application/json'
                },
            }).then(res => {
                if (res.status !== 200) throw new Error("cannot fetch menu")
                return res.json()
            }).then(data => {
                console.log(JSON.stringify(data))
                initializeCart(data)
                return JSON.stringify(data)
            }).catch(err => console.log(err))

        }
    }

    //initial loading
    useEffect(()=>{
        setup()
    },[])

    function getOrderItem(){
        let total
        let orderItem = []
        let jsonFile = JSON.parse(localStorage.getItem("cart"))
        for (let i=0; i < jsonFile.length; i++){
            if (parseInt(jsonFile[i].qty) != 0){
                total += parseFloat(jsonFile[i].price) * parseFloat(jsonFile[i].qty)
                orderItem.push({name:jsonFile[i].name, qty:jsonFile[i].qty, _id:jsonFile[i]._id})
            }
        }
        console.log("orderItem", orderItem)
        return orderItem
    }

    function getTotalPrice(){
        let total = 0
        let jsonFile = JSON.parse(localStorage.getItem("cart"))
        for (let i=0; i < jsonFile.length; i++){
            if (parseInt(jsonFile[i].qty) != 0){
                total += parseFloat(jsonFile[i].price) * parseFloat(jsonFile[i].qty)
            }
        }
        console.log("total", total)
        return total
    }

    function postOrder(){
        let accessToken = localStorage.getItem('accessToken')
        let customerId = localStorage.getItem('customerId')
        let VendorID = localStorage.getItem("vendorID")
        if (accessToken == null || customerId == null) {alert("no access token/customer id"); return}

        let authString = "Bearer "+ accessToken // to submit order, need a valid token

        let price = getTotalPrice()
        let orderItem = getOrderItem()

        console.log("[Price]:", price )
        console.log("[orderItem]", orderItem)
        if (orderItem.length == 0) {return alert("No Item in cart")}

        console.log(JSON.stringify({
            amount:price,
            orderItem:orderItem,
            vendorId:VendorID
        }))

        fetch(postOrderURL, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": authString
                },
                body:JSON.stringify({
                    amount:price,
                    orderItem:orderItem,
                    vendorId: VendorID
                })
            }
        ).then(res => {
            console.log(res)
            if (res.status !== 201) {alert("Cannot Submit Order"); return}
            console.log(res)
            handleSetFinish()
            localStorage.removeItem("cart")
            localStorage.removeItem("vendorID")

            }
        ).catch(err => console.error(err))
    }




    function initializeCart(data){
        if (data.length !== 0) {
            let cart = [];

            if (localStorage.getItem("cart") === null){
                let snack;
                for (snack of data){
                    let info;
                    info = {_id: snack._id, name: snack.name, price: snack.price, qty: 0}
                    cart.push(info)
                }
                localStorage.setItem("cart", JSON.stringify(cart))
            }
            localStorage.setItem("SnackJSON", JSON.stringify(data))

            setCartLoaded(true)
            setSnacks(data)
            console.log(data)
        }
    }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleConfirmClose = () => setConfirmShow(false)
    const handleConfirmShow = () => setConfirmShow(true)

    function handleProceed(){
        if(localStorage.getItem("logIn") === "true"){
            if(hasAddedItem()){
                console.log("yay")
                handleConfirmShow()
            }else{
                handleShow()
            }
        }else{
            localStorage.setItem("logInFrom", "/menu")
            handleSetRedirect()
        }
    }


    function handleSetRedirect(){
        setRedirect(true)
    }
    function handleSetFinish(){
        setOrderPosted(true)
    }

    function hasAddedItem(){
        let stuff
        const jsonFile = JSON.parse(localStorage.getItem("cart"))
        let res = false
        for (stuff of jsonFile){
            if(stuff.qty !== 0){
                console.log("aaa")
                res = true
            }
        }
        return res

    }



    function getSummary(){
        if(cartLoaded) {
            let cart = JSON.parse(localStorage.getItem("cart"))
            let res = ""
            let item
            for (item of cart) {
                if (item.qty !== 0) {
                    res = res + item.qty.toString() + " of " + item.name + "   "
                }
            }
            return res
        }else{
            return ""
        }
    }


    if(orderPosted){
        return(
            <Redirect to={"/orders"}/>
        )
    }

    if(redirect){
        return(
            <Redirect to={"/CustomerLogin"}/>
        )
    }

    return (

        <div>
            <h1 className="food-menu">&mdash; MENU &mdash;</h1>
            <div className="cardDeck">
            <CardDeck >
                {
                snacks.map(snack => {

                    return (
                        <MenuCard className="menu-card" name={snack.name} price={snack.price.toString()} description={snack.detail} _id={snack._id} link={snack.link}/>

                    )
                })

            }

            </CardDeck> 
            

            <Button className="checkout" size={"lg"} variant={"warning"} style={{
                position: 'absolute', left: '50%',
                transform: 'translate(-50%)'
            }} onClick={handleProceed}> Proceed to Checkout 
            </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Oops...</Modal.Title>
                </Modal.Header>
                <Modal.Body>No items added to cart</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Go Back
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={confirmShow} onHide={handleConfirmClose}>
                <Modal.Header closeButton>
                    <Modal.Title>One Last Check</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You Have Ordered: {getSummary()}!     Proceed?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={postOrder}>
                        Yes
                    </Button>
                    <Button variant={"secondary"} onClick={handleConfirmClose}>
                        Go Back
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>


        )


}

export default Menu
