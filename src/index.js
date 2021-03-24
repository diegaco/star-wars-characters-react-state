import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import dummyData from './dummy-data';

import endpoint from './endpoint';

import './styles.scss';

const initialState = {
  result: null,
  loading: true,
  error: null
}

const fetchReducer = (state = initialState, { type, payload }) => {
  console.log(type);
  if (type === 'FETCH_START') {
    return {
      result: null,
      loading: true,
      error: null
    }
  }

  if (type === 'FETCH_SUCCESS') {
    return {
      result: payload,
      loading: false,
      error: null
    }
  }

  if (type === 'FETCH_ERROR') {
    return {
      result: null,
      loading: false,
      error: payload
    }
  }

  return state;
}

const useFetch = url => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'FETCH_START' });

    fetch(url)
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      })
      .catch(err => {
        dispatch({ type: 'FETCH_ERROR', payload: err });
      });
  }, [url]);

  return [state.result, state.loading, state.error];

}

const Application = () => {
  const [response, loading, error] = useFetch(`${endpoint}/characters`);
  const characters = response?.characters || [];

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {
            loading ?
              <div>Loading...</div> :
              <CharacterList characters={characters} />
          }
          {
            error && <div className="error">{`There was an error ${error.message}`}</div>
          }
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
