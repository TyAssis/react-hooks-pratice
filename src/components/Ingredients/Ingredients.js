import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [ ingredients, setIngredients ] = useState([]);

  // not needed anymore, once it is fetched on Search
  // useEffect(() => {
  //   fetch('https://build-burguer.firebaseio.com/ingredients-2.json')
  //   .then(response =>  response.json())
  //   .then(body => {
  //     const loadedIngredients = [];
  //     for (const key in body) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: body[key].title,
  //         amount: body[key].amount,
  //       })
  //     }
  //     setIngredients(loadedIngredients)
  //   })
  // }, []);


  const addIngredientHandler = ingredient => {
    fetch('https://build-burguer.firebaseio.com/ingredients-2.json', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        ...ingredient
      })
    }).then(response =>
        response.json()
      ).then(body => {
        setIngredients(prevIngredients => [ 
          ...prevIngredients, 
          { 
            id: body.name,
            ...ingredient, 
          } 
        ])
      })
  };

  const removeIngredientHandler = id => {
    setIngredients(prevIngredients => 
      prevIngredients.filter(prevIngredient => prevIngredient.id !== id)
    );
  };

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadingIngredients={filterIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
