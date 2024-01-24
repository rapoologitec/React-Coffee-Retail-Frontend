import React, {useContext, useRef, useState} from "react";
import {useEffect} from "react";
import {EndPointContext} from "../App";
import VendorSelectItem from "./VendorSelectItem";
import './style.css'

function VendorSelect() {
    const [vendors, setVendors] = useState([]);
    let URLEndContent = useContext(EndPointContext)
    let vendorURL = URLEndContent+"/vendor"





    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    // if cannot get location, use default, Federal Sqr, Melb
    const lat = useRef(-37.8148466);
    const lon = useRef(144.9685771);


    useEffect(()=>{
        if (navigator.geolocation) {
            //getCurrentPostion(successCallback, failCallback, options),
            //each callback takes in one parameter
            navigator.geolocation.getCurrentPosition(handle, fail, options)
        } else {
            alert("Geolocation is not supported!")
            //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}`// for debug
        }
        getVendor()
    }, [])

    function getVendor(){
        fetch(vendorURL, {
            method: "GET", headers: {
                'Content-Type': 'application/json'
            }
        }) .then(r => {
            if (r.status !== 200){
                throw new Error("cannot fetch vendors")
            }
            return r.json()
        }) .then(res => {
            sortVendors(res)
            let items = res.slice(0,5)
            setVendors(items)
            console.log(items)
        }).catch(err => console.log(err))
    }

    function sortVendors(vendors){
        function sortByDistance(a, b){
            if((Math.abs(a.lat - lat.current) + Math.abs(a.lon - lon.current)) > (Math.abs(b.lat - lat.current) + Math.abs(b.lon - lon.current))){
                return 1;
            } else if((Math.abs(a.lat - lat.current) + Math.abs(a.lon - lon.current)) < (Math.abs(b.lat - lat.current) + Math.abs(b.lon - lon.current))){
                return -1;
            }
            return 0;
        }
        vendors.sort(sortByDistance)
    }



    function handle(pos){
         //pos is an obj, also has accuracy, timestamp fields
        lat.current = pos.coords.latitude;
        lon.current = pos.coords.longitude;
        //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}` // for debug
    }

    function fail(error){
        alert("Unable to retrieve your position, please try again");
        //document.querySelector('.find-me').textContent = `${lat.current}, ${lon.current}` // for debug
    }

    function pinMap(item){


    }




    return(
        <div  className="vendorform">
            <h1 className="title">Select Vendor</h1>
            <div>
                {vendors.map(item => {return <VendorSelectItem item={item}/>})}
            </div>

        </div>
    )





}

export default VendorSelect
