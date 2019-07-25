import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import './css/searchfield.css'

class SearchField extends Component {
  render() {
    return (
      <div className="search-field">
        <span><FontAwesomeIcon icon={faSearchLocation} className="icon-search"/></span>
        <span><input className="search-bar" placeholder="Search for places..." /></span>
      </div>
    )
  }
}

export default SearchField

//
