import React, { Component } from 'react'
import SearchField from './SearchField'
import './css/map.css'
import axios from 'axios'

class Map extends Component {

  state = {
    infos: []
  }

  componentDidMount() {
    this.getFoursquareInfos()
  }

  loadMap = () => {
    loadingScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=YOUR_API_KEY&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.643819, lng: -79.39779},
      zoom: 13
    })

    let searchButton = document.getElementById('icon-search')
    let infoWindow = new window.google.maps.InfoWindow()
    /* Autocomplete form with Toronto places */
    let timeAutocomplete = new window.google.maps.places.Autocomplete(document.getElementById('search-bar'));
    timeAutocomplete.bindTo('bounds', map);

    this.state.infos.map(singleVenue => {

      let popupMessage =
      `
      <div>
        <h3>${singleVenue.venue.name}</h3>
        <p>${singleVenue.venue.location.address}</p>
      </div>
      `

      let marker = new window.google.maps.Marker({
        position: {
          lat: singleVenue.venue.location.lat,
          lng: singleVenue.venue.location.lng
        },
        map: map,
        title: singleVenue.venue.name,
        animation: window.google.maps.Animation.DROP
      })

      /* Add infoWindow to the markers and center in the map */

      marker.addListener('click', function() {
        map.setZoom(16)
        map.setCenter(this.getPosition())
        infoWindow.setContent(popupMessage)
        infoWindow.open(map, marker)
      })

      searchButton.addEventListener('click', function() {
        let geocoder = new window.google.maps.Geocoder()
        // Make sure the address isn't blank.
        if (document.getElementById('search-bar').value === '') {
          // window.alert('You must enter an area, or address.');
          alert('You must enter an area, or address');
        } else {
          // Geocode the address/area entered to get the center. Then, center the map
          // on it and zoom in
          geocoder.geocode(
            { address: document.getElementById('search-bar').value,
              componentRestrictions: {locality: 'Toronto'}
            }, function(results, status) {
              if (status === window.google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(16);
              } else {
                console.log('We could not find that location - try entering a more' +
                    ' specific place.');
              }
            });
          }
      })

    })
  }

  /* Get Foursquare infos with Axios package */

  getFoursquareInfos = () => {
    const requestApiUrl = 'https://api.foursquare.com/v2/venues/explore?'
    const parametersObject = {
      client_id: 'CAQWSRVDV12J4R0F5JBNO124LWXBGBFZ2PF05FKWOW4N0Z0Z',
      client_secret: 'AL4RFZAJBSCPWL5HJM2KUIJKHGKWHPTVJMDS12GWNJY4HYA2',
      query: 'food',
      near: 'toronto',
      v: '20192407',
      radius: '5000'
    }

    axios.get(requestApiUrl + new URLSearchParams(parametersObject))
      .then(response => {
        this.setState({
          infos: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        console.log(`You got a error ${error}`)
        alert(`Oh no! The map didn't load correctly`)
      })
  }

  render() {
    const listStyle = {
      display: 'inline'
    }

    const nameStyle = {
      color: '#fcba03',
      fontFamily: 'Raleway'
    }

    const addressStyle = {
      color: 'black',
      fontFamily: 'Raleway'
    }

    const itemNotFound = {
      color: 'red',
      fontFamily: 'Raleway',
      fontStyle: 'italic'
    }

    return (
      <div>
        <SearchField />
        <main id="map-container">
          <h1 className="title-map">Neighborhood Map</h1>
          <h3 className="subtitle-map">Addresses List</h3>
          <ul>
            {this.state.infos.map(place => (
              <li>
                <h4 style={addressStyle}>{
                  (place.venue.location.address) ?
                  (place.venue.location.address) : <span style={itemNotFound}>Address not found</span>
                } - <span style={nameStyle}>{place.venue.name}</span>
                </h4>
              </li>
            ))}
          </ul>
          <div id="map"></div>
        </main>
      </div>
    )
  }
}

export default Map

/* Adding the script tag in HTML */

const loadingScript = url => {
  let getScript = window.document.getElementsByTagName('script')[0]
  let insertScript = window.document.createElement('script')
  insertScript.src = url
  insertScript.async = true
  insertScript.defer = true
  getScript.parentNode.insertBefore(insertScript, getScript)
}
