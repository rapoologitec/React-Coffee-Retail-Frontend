import React, {useContext, useEffect, useState} from "react";
import {Button, ButtonGroup, Form, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {EndPointContext} from "../App";
import {Redirect} from "react-router-dom";

function AddComment(){

    const [stars, setStars] = useState(5);
    const [comment, setComment] = useState("")
    const URL = useContext(EndPointContext)
    const patchURL = URL+"/order/"+localStorage.getItem("currentOrder")
    const [redirect, setRedirect] = useState(false)



    function postComment(){
        let token = localStorage.getItem("accessToken")
        let bearerToken = "Bearer " + token

        let commentStr
        if(comment.length === 0){
            commentStr = "No Comment Left"
        }else{
            commentStr = comment
        }

        fetch(patchURL, {
                method: "PATCH", headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken,
                },
                body: JSON.stringify({
                    'rating': stars,
                    'review': commentStr
                })
            }).then(res => {
                if (res.status !== 200) throw new Error("cannot update")
                return res.json()
            }).then(data => {
                console.log(JSON.stringify(data))
                localStorage.removeItem("currentOrder")
                setRedirect(true)
            }).catch(err => console.log(err))
    }

    const handleChange = (val) => setStars(val);

    if (redirect){
        return <Redirect to={"/orders"}/>
    }

    return(
        <div>
            <h1>Add Review</h1>
            <Form.Group controlId="comment box">
                <Form.Label><h2>Add Comment Down Below</h2></Form.Label>
                <Form.Control as="textarea" rows={3}
                              placeholder="Enter here"
                              type="text"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}/>
            </Form.Group>
            <br />
            <ToggleButtonGroup type={"radio"} name={"star"} value={stars} size={"lg"} onChange={handleChange}>
                <ToggleButton value={1}>★</ToggleButton>
                <ToggleButton value={2}>★</ToggleButton>
                <ToggleButton value={3}>★</ToggleButton>
                <ToggleButton value={4}>★</ToggleButton>
                <ToggleButton value={5}>★</ToggleButton>
            </ToggleButtonGroup>
            <br/>
            <br/>
            <Button size={"lg"} variant={"warning"} onClick={postComment}>Post Comment</Button>
        </div>
    )
}

export default AddComment