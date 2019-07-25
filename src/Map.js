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
    loadingScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAxAPuxsvKt7MOcfU8yL-urFscW_11DHFM&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 43.643819, lng: -79.39779},
      zoom: 15
    })

    this.state.infos.map(singleVenue => {
      let marker = new window.google.maps.Marker({
        position: {
          lat: singleVenue.venue.location.lat,
          lng: singleVenue.venue.location.lng
        },
        map: map,
        title: singleVenue.venue.name
      })

    })
  }

  getFoursquareInfos = () => {
    const requestApiUrl = 'https://api.foursquare.com/v2/venues/explore?'
    const parametersObject = {
      client_id: 'CAQWSRVDV12J4R0F5JBNO124LWXBGBFZ2PF05FKWOW4N0Z0Z',
      client_secret: 'AL4RFZAJBSCPWL5HJM2KUIJKHGKWHPTVJMDS12GWNJY4HYA2',
      query: 'food',
      near: 'toronto',
      v: '20192407'
    }

    axios.get(requestApiUrl + new URLSearchParams(parametersObject))
      .then(response => {
        this.setState({
          infos: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        console.log(`You got a error ${error}`)
        alert('Oh no! Something unexpected happened...')
      })
  }

  render() {
    return (
      <div>
        <SearchField />
        <main id="map-container">
          <h1 className="title-map">Neighborhood Map</h1>
          <div id="map"></div>
        </main>
      </div>
    )
  }
}

export default Map

const loadingScript = url => {
  let getScript = window.document.getElementsByTagName('script')[0]
  let insertScript = window.document.createElement('script')
  insertScript.src = url
  insertScript.async = true
  insertScript.defer = true
  getScript.parentNode.insertBefore(insertScript, getScript)
}
