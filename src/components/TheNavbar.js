import React from 'react'; 
import Navbar from 'react-bootstrap/Navbar'
import Nav from "react-bootstrap/Nav"

export default function TheNavbar(props) {
    if (localStorage.getItem('logIn') === "true"){
        return(
            <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
            <Navbar.Brand href="/">Van</Navbar.Brand>
            <Nav>
                <Nav.Link href="/orders">My Order</Nav.Link>
            </Nav>
            
            <Nav>
                <Nav.Link href="/logout" >Logout</Nav.Link>
            </Nav>

            </Navbar>
        )
    }
    return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Van</Navbar.Brand>
            </Navbar>
    )
}
