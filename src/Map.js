import React, { Component } from 'react'
import Title from './Title'
import './css/searchfield.css'
import './css/map.css'
import axios from 'axios'

class Map extends Component {

  state = {
    infos: [],
    filteredInfos: [],
    markers: []
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
      zoom: 11
    })
    this.createDetails(map)
  }
  /* Get Foursquare infos with Axios package */

  getFoursquareInfos = () => {
    const requestApiUrl = 'https://api.foursquare.com/v2/venues/explore?'
    const parametersObject = {
      client_id: 'CAQWSRVDV12J4R0F5JBNO124LWXBGBFZ2PF05FKWOW4N0Z0Z',
      client_secret: 'AL4RFZAJBSCPWL5HJM2KUIJKHGKWHPTVJMDS12GWNJY4HYA2',
      query: 'food',
      near: 'toronto',
      v: '20192707'
    }

    axios.get(requestApiUrl + new URLSearchParams(parametersObject))
      .then(response => {
        this.setState({
          infos: response.data.response.groups[0].items,
          filteredInfos: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        console.log(`You got a error ${error}`)
        alert(`Oh no! The map didn't load correctly`)
      })
  }

  onchange = e => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.643819, lng: -79.39779},
      zoom: 11
    })
    const { infos } = this.state
    const filteredInfos = infos.filter(place => {
      this.createDetails(map)
      return place.venue.name.toLowerCase().includes(e.target.value.toLowerCase())
    })
    this.setState({
      filteredInfos
    }, () => {
      this.createDetails(map)
    })
  }

  createDetails = (map) => {
    const { filteredInfos, markers } = this.state
    filteredInfos.map(info => {
      let infoWindow = new window.google.maps.InfoWindow()
      let popupMessage =`<div><h3>${info.venue.name}</h3><p>${info.venue.location.address}</p></div>`
      let marker = new window.google.maps.Marker({
        position: {lat: info.venue.location.lat, lng: info.venue.location.lng},
        map: map,
        id: info.venue.id,
        title: info.venue.name,
        animation: window.google.maps.Animation.DROP
      })
      marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null)
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE)
        }
        setTimeout(() => { marker.setAnimation(null)}, 1500)
        infoWindow.setContent(popupMessage)
        infoWindow.open(map, marker)
      })
      markers.push(marker)
    })
  }

  /* A method that opens the infowindow in map when a element is clicked on list */
  listItemCheck = (place) => {
    // Check if the marker id match the place id
    let marker = this.state.markers.filter(m => m.id === place.id)[0]

    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: place.location.lat, lng: place.location.lng},
      zoom: 11
    })
    let newMarker = new window.google.maps.Marker({
      position: {lat: place.location.lat, lng: place.location.lng},
      map: map,
      id: place.id,
      title: place.name,
      animation: window.google.maps.Animation.DROP
    })
    let infoWindow = new window.google.maps.InfoWindow()
    let popupMessage =`<div><h3>${place.name}</h3><p>${place.location.address}</p></div>`
    if (newMarker.getAnimation() !== null) {
      newMarker.setAnimation(null)
    } else {
      newMarker.setAnimation(window.google.maps.Animation.BOUNCE)
    }
    setTimeout(() => { newMarker.setAnimation(null)}, 1500)
    infoWindow.setContent(popupMessage)
    infoWindow.open(map, newMarker)
  }

  render() {
    const { filteredInfos } = this.state
    return (
      <div id="app">
        <nav id="header-search" aria-label="Search in Map" role="search">
          <div className="search-field">
            <input id="search-bar" placeholder="Search for places..." onChange={this.onchange}/>
          </div>
        </nav>
        <Title />
        <main id="map-container">
          <div id="list" aria-label="Places List" role="navigation">
            <h3 className="subtitle-map">Places List</h3>
            <ul className="places-list">
              {filteredInfos.map(place => (
                <li className="list-item" key={place.venue.id} tabIndex="0" onClick={() => { this.listItemCheck(place.venue) } }>
                  <h4 className="place-name">{place.venue.name}</h4>
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
