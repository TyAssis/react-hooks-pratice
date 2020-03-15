import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErroModal from '../UI/ErrorModal';

import useHttp from '../../hooks/http';

// (state, action)
const ingredientReducer = (currentIndredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIndredients, action.ingredients];
    case 'DELETE':
      return currentIndredients.filter(ingredient => ingredient.id !== action.id);
    default:
      throw new Error('Something went wrong!')
  }
};


const Ingredients = () => {
  const [ ingredients, dispatch ] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, extra, identifier, clear } = useHttp();

  // old: when using useState
  // const [ ingredients, dispatch ] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

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
  //     dispatch(loadedIngredients)
  //   })
  // }, []);


  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://build-burguer.firebaseio.com/ingredients-2.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT',
    );;

    // replaced by custom hook
    // fetch('https://build-burguer.firebaseio.com/ingredients-2.json', {
    //   headers: { 'Content-Type': 'application/json' },
    //   method: 'POST',
    //   body: JSON.stringify({
    //     ...ingredient
    //   })
    // }).then(response => {
    //     return response.json();
    // }).then(body => {
    //   // using useState to update prev state
    //   //   setIngredients(prevIngredients => [ 
    //   //     ...prevIngredients, 
    //   //     { 
    //   //       id: body.name,
    //   //       ...ingredient, 
    //   //     } 
    //   //   ])
    //   // })
    //   dispatch({ type: 'ADD', ingredients: { id: body.name, ...ingredient } }) });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://build-burguer.firebaseio.com/ingredients-2/${id}.json`,
      'DELETE',
      null,
      id,
      'REMOVE_INGREDIENT',
    );
  }, [sendRequest]);

  useEffect(() => {
    if (identifier === 'REMOVE_INGREDIENT' && !isLoading && !error) {
      dispatch({ type: 'DELETE', id: extra })
    } 
    if (identifier === 'ADD_INGREDIENT' && !isLoading && !error) {
      dispatch({ type: 'ADD', ingredients: { id: data.name, ...extra } });
    }
  }, [data, extra, identifier, isLoading, error]);

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  // useMemo replaces React.memo inside the nested component
  const ingredientList = useMemo(() => {
    return (<IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />)
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErroModal onClose={clear}> {error} </ErroModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadingIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
