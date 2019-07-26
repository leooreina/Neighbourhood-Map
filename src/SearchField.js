import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import './css/searchfield.css'

class SearchField extends Component {
  render() {
    return (
      <div>
        <div className="search-field">
          <span><input id="search-bar" placeholder="Search for addresses..." /></span>
          <span><FontAwesomeIcon icon={faSearchLocation} id="icon-search" tabindex="0"/></span>
        </div>
      </div>
    )
  }
}

export default SearchField
