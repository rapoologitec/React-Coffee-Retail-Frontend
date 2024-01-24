import React, {useState} from "react";
import {GoogleMap, InfoWindow, LoadScript, Marker} from "@react-google-maps/api";


function MapItem(props){
    const position = {lat: props.item.lat, lng: props.item.lon}
    const [showWindow, setShowWindow] = useState(false)
    const divStyle = {
        background: `white`,
        border: `1px solid #ccc`,
        padding: 15
    }

    const GoogleMapAPIKey = "SAMPLE_KEY"
    
    const containerStyle = {
        width: '400px',
        height: '400px'
    };




    return(<LoadScript googleMapsApiKey={GoogleMapAPIKey}>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={14}
        >
            <Marker
                position={position}
            />
        </GoogleMap>
    </LoadScript>
    )
}

export default MapItem
