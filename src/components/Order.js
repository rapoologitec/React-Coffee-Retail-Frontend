import React, {useEffect, useState, useContext} from "react";
import {Accordion, AccordionCollapse, Jumbotron, Table} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {EndPointContext} from '../App.js'
import OrderItem from "./OrderItem";
import "./order.css"

function Order(props){
    const [order, setOrder] = useState([])
    const URLEndContext = useContext(EndPointContext)
    const getOrderURL = URLEndContext + '/customer/myOrders'

    useEffect(()=>{

        getOrder()
    }, [])



    function getOrder(){

        let accessCode = "Bearer " + localStorage.getItem("accessToken")
        fetch(getOrderURL,{method:"GET", headers:{
                "Authorization": accessCode
            }}).then(res=> {
                if (res.status !== 200) throw new Error("cannot fetch orders")
            return res.json()
        })
            .then(result=>{
                setOrder(result)
                console.log(result)
            }).catch(err => console.log(err))
    }




    return(
        <div>
            <h1 className="order-title">Orders</h1>
            {
            order.map(item=>{
                return(<OrderItem order={item}/>)

            })
        }
            { ()=>{
                if(order.length === 0){
                    return (<h1>You haven't made any order</h1>)
                }else{
                    return null
                }
            }}
        </div>)
}

export default Order
