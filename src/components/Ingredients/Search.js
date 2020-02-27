import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadingIngredients } = props;
  const [inputFiler, setInputFilter ] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputFiler === inputRef.current.value) {
        const queryParams = inputFiler.length === 0 ? '' : `?orderBy="title"&equalTo="${inputFiler}"`;
        fetch(`https://build-burguer.firebaseio.com/ingredients-2.json${queryParams}`)
        .then(response =>  response.json())
        .then(body => {
          const loadedIngredients = [];
          for (const key in body) {
            loadedIngredients.push({
              id: key,
              title: body[key].title,
              amount: body[key].amount,
            })
          } 
          onLoadingIngredients(loadedIngredients);
        });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    }
  },
    [inputFiler, onLoadingIngredients, inputRef]
  );

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
