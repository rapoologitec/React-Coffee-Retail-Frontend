import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import './Menu.css'
import * as propTypes from "prop-types";
import Button from "react-bootstrap/Button";
import {ButtonGroup} from "react-bootstrap";




class MenuCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0
        }
        this.handleAddition = this.handleAddition.bind(this)
        this.handleSubtraction = this.handleSubtraction.bind(this)
        this.getCurrQty = this.getCurrQty.bind(this)
    }



    getCurrQty() {
        return JSON.parse(localStorage.getItem("cart"))[this.state.index].qty
    }

    componentDidMount() {
        let i
        let dataFile
        dataFile = JSON.parse(localStorage.getItem("cart"))
        for(i = 0; i < dataFile.length; i++){
            if (this.props._id === dataFile[i]._id){
                this.setState({
                    index: i});
                break
            }
        }
    }

    handleAddition(){
        let jsonFile
        jsonFile = JSON.parse(localStorage.getItem("cart"))
        jsonFile[this.state.index].qty += 1
        localStorage.setItem("cart", JSON.stringify(jsonFile))
        this.forceUpdate()
    }

    handleSubtraction(){
        let jsonFile
        jsonFile = JSON.parse(localStorage.getItem("cart"))
        if(jsonFile[this.state.index].qty >= 1) {
            jsonFile[this.state.index].qty -= 1
            localStorage.setItem("cart", JSON.stringify(jsonFile))
            this.forceUpdate()
        }

    }


    render() {
        return (
            <div>
            <Card className="card" style={{ width: '18em' }}  text={"white"} >
                <Card.Img className="card-img" variant="top" src={"https://source.unsplash.com/" + this.props.link + "/250x250"}/>
 
                <Card.Body className="card-body">
                    <div className="card-details">
                        <Card.Header className="card-header">{this.props.name}</Card.Header>    
                        <Card.Subtitle className="card-price">${parseFloat(this.props.price).toFixed(2)}</Card.Subtitle>
                        <Card.Text className="card-details-sub">{this.props.description}</Card.Text>
                        <Card.Subtitle>{this.getCurrQty()} in Cart</Card.Subtitle>
                        <ButtonGroup className="card-btn">
                            <Button variant={"outline-light"} size={"sm"} onClick={this.handleSubtraction}>  -  </Button>
                            <Button variant={"outline-light"} size={"sm"} onClick={this.handleAddition}>  +  </Button>
                        </ButtonGroup>
                    </div>
                </Card.Body>
            </Card>
            </div>
        );
    }
}

MenuCard.propTypes = {
    name: propTypes.string,
    description: propTypes.string,
    price: propTypes.string,
    _id: propTypes.string,
    link: propTypes.string
}

export default MenuCard;

/* <Jumbotron>
                    <h1>{this.props.name}</h1>
                    <h2>${parseFloat(this.props.price).toFixed(2)}</h2>
                    <h5>{this.props.description}</h5>
                    <p>{localStorage.getItem("SnackJSON")}</p>
                </Jumbotron>*/
