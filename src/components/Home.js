import React from "react";
import Button from "react-bootstrap/Button";
import {Link, Redirect} from "react-router-dom";
import "./Home.css"
import {Jumbotron} from "react-bootstrap";

function Home(){
return(
    <div className={"container"}>
        <div className={"center"}>
            <Jumbotron>
                <h1>Snack in a Van</h1>
                <br/>
                <Link to={"/CustomerLogin"} >
                    <Button variant={"primary"} block={true} size={"lg"}>
                        Log in now
                    </Button>
                </Link>
                <br/>
                <Link to={"/selectvendor"} >
                    <Button variant={"warning"} block={true} size={"lg"}>
                        Start Ordering
                    </Button>
                </Link>
                <Link to={"/VendorLogin"}>
                    Vendor Login
                </Link>
            </Jumbotron>
        </div>
    </div>
)
}

export default Home