"use strict";
import axios from 'axios';
// import { browserHistory } from 'react-router';
import {
  YELP_SET_CURRENT_LOCATION,
  YELP_SET_CURRENT_POSITION,
  YELP_SET_PLACES,
  YELP_SET_SEARCH_TERMS,
  YELP_CONFIRM_REQUEST,
  YELP_CONFIRM_SUCCESS
} from '../constants/actionTypes';
// import toastr from 'toastr';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://fcc-wubto-rest-api.herokuapp.com'
  : 'http://localhost:8050';

export function setCurrentLocation(location) {
  return {
    type: YELP_SET_CURRENT_LOCATION,
    payload: location
  };
}

export function setCurrentPosition(coords) {
  return {
    type: YELP_SET_CURRENT_POSITION,
    payload: coords
  };
}

export function setPlaces(places) {
  return {
    type: YELP_SET_PLACES,
    payload: places
  };
}

export function setSearchTerms(formData) {
  return {
    type: YELP_SET_SEARCH_TERMS,
    payload: formData
  };
}

export function confirmRequest(id) {
  return {
    type: YELP_CONFIRM_REQUEST,
    payload: id
  };
}

export function confirmSuccess(id) {
  return {
    type: YELP_CONFIRM_SUCCESS,
    payload: id
  };
}

// Find string location from coordinates
export function getCurrentLocation(coords) {
  return dispatch => {
    axios.post(`${API_URL}/yelp/search`, {
      latitude: coords[0],
      longitude: coords[1]
    })
      .then(response => {
        // TODO: Error checking
        const location = response.data.businesses[0].location;

        dispatch(setCurrentPosition(coords));
        dispatch(setCurrentLocation(location));
        dispatch(searchDefault(location));
      })
      .catch(err => {
        console.error(err);
      });
  };
}

export function searchDefault(location) {
  return dispatch => {
    axios.post(`${API_URL}/yelp/search`, {
      location: location.display_address[1],
      categories: 'bars,restaurants'
    })
      .then(response => {
        // TODO: Error checking
        const { businesses } = response.data;
        dispatch(setPlaces(businesses));
      })
      .catch(err => {
        console.error(err);
      });
  };
}

export function searchSubmit(formData) {
  return dispatch => {
    // TODO: Dispatch action that adds search form data to current
    dispatch(setSearchTerms(formData));
    axios.post(`${API_URL}/yelp/search`, {
      location: formData.location,
      categories: formData.categories,
      term: formData.term
    })
      .then(response => {
        // TODO: Error checking
        const { businesses } = response.data;
        dispatch(setPlaces(businesses));
      })
      .catch(err => {
        console.error(err);
      });
  };
}

export function toggleConfirmPlace(id, isConfirming) {
  return dispatch => {
    if (isConfirming) return;

    const userToken = localStorage.getItem('user_token');

    dispatch(confirmRequest(id));

    axios.post(`${API_URL}/yelp/confirm/${id}`, {}, {
      headers: { authorization: userToken }
    })
      .then(response => {
        // TODO: Error checking
        dispatch(confirmSuccess(response.data.place));
      })
      .catch(err => {
        console.error(err);
      });
  };
}
