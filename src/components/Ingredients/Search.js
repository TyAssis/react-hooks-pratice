import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';
import useHttp from '../../hooks/http';

const Search = React.memo(props => {
  const { onLoadingIngredients } = props;
  const [inputFiler, setInputFilter ] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputFiler === inputRef.current.value) {
        const queryParams = inputFiler.length === 0 ? '' : `?orderBy="title"&equalTo="${inputFiler}"`;
        sendRequest(
          `https://build-burguer.firebaseio.com/ingredients-2.json${queryParams}`,
          'GET',
        )
        // fetch(`https://build-burguer.firebaseio.com/ingredients-2.json${queryParams}`)
        // .then(response =>  response.json())
        // .then(body => {
        //   const loadedIngredients = [];
        //   for (const key in body) {
        //     loadedIngredients.push({
        //       id: key,
        //       title: body[key].title,
        //       amount: body[key].amount,
        //     })
        //   } 
        //   onLoadingIngredients(loadedIngredients);
        // });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    }
  },
    [inputFiler, inputRef, sendRequest]
  );

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        })
      } 
    onLoadingIngredients(loadedIngredients);
    }
  }, [onLoadingIngredients, data, isLoading, error])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span> loading ... </span>}
          <input type="text" 
            value={inputFiler}
            ref={inputRef}
            onChange={event => setInputFilter(event.target.value) }  
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
