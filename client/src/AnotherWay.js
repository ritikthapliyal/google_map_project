import { useLoadScript, GoogleMap, Marker, HeatmapLayer  } from "@react-google-maps/api"
import React,{useCallback, useEffect, useMemo, useRef, useState} from 'react'
import usePlacesAutocomplete,{getGeocode,getLatLng} from "use-places-autocomplete"
import axios from 'axios'


const LocationSearchInput = ({addLocation}) => {
  
    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions} = usePlacesAutocomplete()
  
    const handleInput = (e) => {
      setValue(e.target.value)
    }
  
    const handleSelect = async ({ description }) => {
      
        setValue(description, false)
        
        clearSuggestions()
        
        try{
            const results = await getGeocode({ address: description })
            const { lat, lng } = getLatLng(results[0])
            addLocation({lat,lng})
        }
        catch(err){
            console.log(err)
        }
    }
  
    const renderSuggestions = () =>
      
        data.map((suggestion) => {
        const {place_id, structured_formatting: { main_text, secondary_text }} = suggestion
        
        return (
          <li key={place_id} onClick={()=>handleSelect(suggestion)}>
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </li>
        )
    })
  
    return (
      <div style={{width : "50%", height : "100%", display: "flex", flexDirection : "column", alignItems:"center", gap:".5rem"}}>
        <input
          style={{width : "70%", padding:".4rem 1rem"}}
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Enter a location to mark on map"
        />
        <ul style={{width : "70%", listStyle:"none"}}>{status === 'OK' && renderSuggestions()}</ul>
      </div>
    )
}





//shows the map
const ShowMap = () => {

    const [removeMarker,setRemoveMarker] = useState(true)
    const [removeHeatmap,setRemoveHeatmap] = useState(true)
    
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/points');
            setZoom(12)
            setLocations([...locations,...response.data])
        } 
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const generateHeatMap = () =>{
        setRemoveMarker(!removeMarker)
        setRemoveHeatmap(!removeHeatmap)
    }
    
    //default value of dehradun
    const defaultCoordinates = useMemo(() => ({lat: 30.3165, lng: 78.0322}),[])
    // const [center, setCenter] = useState({ lat: 30.3165, lng: 78.0322 })
    const [zoom, setZoom] = useState(14)
    const [locations, setLocations] = useState([])
    
    const mapRef = useRef()
    const onLoad = useCallback((map)=> (mapRef.current = map), [])

    const addLocation = (location_obj)=>{
        // setCenter(location_obj)
        const newPosition = new window.google.maps.LatLng(location_obj.lat, location_obj.lng)
        mapRef.current?.panTo(newPosition)
        setLocations([...locations,location_obj])
    }

    return <div className="map" style={{width:"80vw",height:"90vh", display:"flex"}}>

        <div className="--buttons">
            <button className="fetch-button" onClick={fetchData}>Fetch Points</button>
            <button className="fetch-button" onClick={generateHeatMap}>Show Heatmap</button>
        </div>
        
        <GoogleMap zoom={zoom} 
                   center={defaultCoordinates} 
                //    center={defaultCoordinates} 
                   onLoad={onLoad} 
                   mapContainerStyle={{width:"50%",height:"100%"}}>
            {
                
                !removeMarker && locations.length > 0 && locations.map((location,index)=>{
                    return <Marker key={index} position={location} />
                })

            }

            {
                
                !removeHeatmap && locations.length && <HeatmapLayer options={{radius: 20, opacity:0.8}} data={locations.map(point => new window.google.maps.LatLng(point.lat, point.lng))}/>
            }


        </GoogleMap>


        <LocationSearchInput addLocation={addLocation}></LocationSearchInput>
    
    </div>
}






//main component
function AnotherWay() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "",
        libraries: ["places","visualization"],
    })
    
    if (!isLoaded) return <div>Loading...</div>
    return <ShowMap />
}

export default AnotherWay
