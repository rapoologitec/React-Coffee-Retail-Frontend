import React, { useEffect, useRef, useState } from 'react'


/*handle routes
//https://www.digitalocean.com/community/tutorials/how-to-handle-routing-in-react-apps-with-react-router
*/ 
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import Login from './components/Login'
import Signup from './components/Signup'
import TheNavbar from './components/TheNavbar'
import Logout from './components/Logout'
import Menu from "./components/Menu";
import Order from "./components/Order";
import Home from "./components/Home";
import VendorLogin from "./components/VendorLogin"
import Settings from './components/Settings'
import "./App.css"
import VendorSelect from "./components/VendorSelect";
import VendorSuccessLogin from "./components/VenderSuccessLogin";
import VendorOrder from "./components/VendorOrder";
import Stop from "./components/Stop";
import AddComment from "./components/AddComment";

// pass in our backend server's address in <EndPointContext.Provide value={URLend}>
export const EndPointContext = React.createContext()

require('dotenv').config()

function App() {
  let URLEnd = "http://localhost:8000"

  if (process.env.REACT_APP_BACKEND_URL != '') {
    URLEnd = process.env.REACT_APP_BACKEND_URL
    console.log("Use ENV")
  }
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  window.onunload = ()=>{
    //localStorage.clear()
  }

  return (
    <div className="App">
      <BrowserRouter>
      <EndPointContext.Provider value={URLEnd}>
        <TheNavbar isUserIn={isLoggedIn}/>
        <Switch>

          <Route exact path="/CustomerLogin">
            <Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
          </Route>

          <Route exact path="/Signup">
            <Signup  />
          </Route>

          <Route exact path="/CustomerLogout">
            <Logout />
          </Route>
          <Route exact path = "/menu">
            <Menu isLoggedIn={isLoggedIn}/>
          </Route>
          <Route exact path = "/orders">
            <Order isLoggedIn={isLoggedIn}/>
          </Route>
          <Route exact path = "/">
            <Home />
          </Route>

          <Route exact path = "/VendorLogin">
          <VendorLogin/>
          </Route>

          <Route exact path = "/settings">
          <Settings/>
          </Route>

          <Route exact path = "/selectvendor">
            <VendorSelect/>
          </Route>

          <Route exact path="/vendorsuccesslogin">
            <VendorSuccessLogin/>
          </Route>

          <Route exact path="/vendorOrder">
            <VendorOrder/>
          </Route>

          <Route exact path="/vendorStop">
            <Stop/>
          </Route>

          <Route exact path="/logout">
            <Logout/>
          </Route>

          <Route exact path="/addComment">
            <AddComment/>
          </Route>

        </Switch>
      </EndPointContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;



// //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
//   //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
//   const options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
//   };

// // if cannot get location, use default, Federal Sqr, Melb
// const lat = useRef(-37.8148466);
// const lon = useRef(144.9685771);

// function handle(pos){
//   //console.log(pos) pos is an obj, also has accuracy, timestamp fields
//   lat.current = pos.coords.latitude;
//   lon.current = pos.coords.longitude;
//   //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}` // for debug
// }

// function fail(error){
//   alert("Unable to retrieve your position, please try again");
//   //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}` // for debug
// }

// useEffect(()=>{
// if (navigator.geolocation) {
//   //getCurrentPostion(successCallback, failCallback, options), 
//   //each callback takes in one parameter
//   navigator.geolocation.getCurrentPosition(handle, fail, options)
// } else {
//   alert("Geolocation is not supported!")
//   //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}`// for debug
// }
// })