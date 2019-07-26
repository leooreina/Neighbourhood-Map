import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import './css/searchfield.css'
import './css/map.css'
import axios from 'axios'

class Map extends Component {

  state = {
    infos: [],
  }

  componentDidMount() {
    this.getFoursquareInfos()
  }

  loadMap = () => {
    loadingScript("https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAxAPuxsvKt7MOcfU8yL-urFscW_11DHFM&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.643819, lng: -79.39779},
      zoom: 13
    })
    let searchButton = document.getElementById('icon-search')

    this.state.infos.map(singleVenue => {
      let infoWindow = new window.google.maps.InfoWindow()
      let popupMessage =
      `<div>
          <h3>${singleVenue.venue.name}</h3>
          <p>${singleVenue.venue.location.address}</p>
        </div>`

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
        if (document.getElementById('search-bar').value === '') {
          alert('You must enter an area, or address');
        } else {
          geocoder.geocode(
            { address: document.getElementById('search-bar').value,
              componentRestrictions: {locality: 'Toronto'}
            }, function(results, status) {
              if (status === window.google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
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
      fontFamily: 'Raleway',
      padding: '5px 0 5px 0'
    }

    const addressStyle = {
      color: 'white',
      fontFamily: 'Raleway'
    }

    const itemNotFound = {
      color: 'red',
      fontFamily: 'Raleway',
      fontStyle: 'italic'
    }

    return (
      <div id="app">
        <nav id="header-search" aria-label="Search in Map" role="search">
          <div className="search-field">
            <span>
              <input
                id="search-bar"
                placeholder="Search for places..."
                onChange={this.filterPlaces}
              />
            </span>
            <span><FontAwesomeIcon icon={faSearchLocation} id="icon-search" tabIndex="0"/></span>
          </div>
        </nav>

        <div>
          <h1 className="title-map">Neighborhood Map</h1>
        </div>

        <main id="map-container">
          <div id="list" aria-label="Places List" role="navigation">
            <h3 className="subtitle-map">Places List</h3>
            <ul className="places-list">
              {this.state.infos.map(place => (
                <li className="list-item" key={place.venue.id}>
                  <h4 style={nameStyle}>{place.venue.name}</h4>
                </li>
              ))}
            </ul>
          </div>
          <div id="map" aria-label="Toronto Map" role="application"></div>
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
  insertScript.onerror = () => alert('Oh no! Google Maps API request catch an error.')
}
