import pizzaObj from '@/static/pizza.json';
import { uniqueId } from 'lodash';

import { normalizeDough, normalizeSize, normalizeSauce, normalizeIngredients } from '@/common/helpers';

const setupState = () => ({
  ingredients: [],
  sauces: [],
  sizes: [],
  doughs: [],
  buildedPizza: {
    id: uniqueId(),
    count: 1,
    dough: {},
    ingredients: [],
    pizzaName: '',
    price: 0,
    sauce: {},
    size: {}
  },
});

export default {
  namespaced: true,

  state: setupState,

  mutations: {
    SET_INGREDIENTS: (state, data) => (state.ingredients = data),
    SET_SAUCES: (state, data) => (state.sauces = data),
    SET_DOUGHS: (state, data) => (state.doughs = data),
    SET_SIZES: (state, data) => (state.sizes = data),

    ADD_PIZZA_NAME: (state, name) => (state.buildedPizza.pizzaName = name),

    ADD_SAUCE: (state, sauce) => (state.buildedPizza.sauce = sauce),
    SET_SAUCE: (state, sauceType) => {
      state.sauces.find( el => el.type === sauceType).checked = true;
      state.sauces.find( el => el.type !== sauceType).checked = false;
    },

    ADD_SIZE: (state, size) => (state.buildedPizza.size = size),
    SET_SIZE: (state, size) => {
      state.sizes.find( el => el.multiplier === size).checked = true;
      state.sizes.find( el => el.multiplier !== size).checked = false;
    },

    ADD_DOUGH: (state, dough) => (state.buildedPizza.dough = dough),
    SET_DOUGH: (state, doughType) => {
      state.doughs.find( el => el.type === doughType).checked = true;
      state.doughs.find( el => el.type !== doughType).checked = false;
    },

    SET_ID: (state, pizzaId) => (state.buildedPizza.id = pizzaId),

    SET_INGREDIENT_COUNT: (state, comingIngredients) => {
      comingIngredients.forEach( element => {
        state.ingredients.find(el => el.id === element.id).counter = element.counter;
      });
    },

    ADD_PRICE: (state, price) => (state.buildedPizza.price = price),

    CHANGE_INGREDIENTS: (state, ingredientsAdded) => (state.buildedPizza.ingredients = ingredientsAdded),

    CHANGE_INGREDIENTS_COUNT: (state, ingredient) =>
      (state.ingredients.find(el => el.id === ingredient.id).counter = ingredient.counter),

    RESET_STATE: (state) => {
      Object.assign(state, setupState());
    },

    SET_PIZZA_TO_CHANGE: (state, pizza) => (state.buildedPizza = pizza),
  },
  getters: {
    pricePizza: (state) => {
       let ingredientsPriceSum = 0;

      state.buildedPizza.ingredients.forEach( ingredient => {
        ingredientsPriceSum += parseInt(ingredient.counter * ingredient.price);
      });

      return ((state.buildedPizza.sauce.price + state.buildedPizza.dough.price + ingredientsPriceSum) * state.buildedPizza.size);
    }
   },
  actions: {
    setPizza({ commit }) {
      const pizza  = Object.assign({}, pizzaObj);

      const ingredients = pizza.ingredients.map( (item) => normalizeIngredients(item));
      commit('SET_INGREDIENTS', ingredients);

      const doughs = pizza.dough.map( (item) => normalizeDough(item));
      commit('SET_DOUGHS', doughs);

      const sizes = pizza.sizes.map( (item) => normalizeSize(item));
      commit('SET_SIZES', sizes);

      const sauces = pizza.sauces.map( (item) => normalizeSauce(item));
      commit('SET_SAUCES', sauces);
    },

    addIngredients({ state, commit }, ingredient) {
      const ingredientMovedArray = state.buildedPizza.ingredients;

      if (!ingredientMovedArray.find( el => el.id === ingredient.id )) {
        ingredientMovedArray.push(ingredient);

        commit('CHANGE_INGREDIENTS_COUNT', ingredient);
        commit('CHANGE_INGREDIENTS', ingredientMovedArray);

      } else if (ingredientMovedArray.find( el => el.id=== ingredient.id )) {
        const findedElement = ingredientMovedArray.find(el => el.id === ingredient.id);
        ingredientMovedArray.splice(ingredientMovedArray.indexOf(findedElement), 1);
        ingredientMovedArray.push(ingredient);

        commit('CHANGE_INGREDIENTS_COUNT', ingredient);
        commit('CHANGE_INGREDIENTS', ingredientMovedArray);
      }
    },
    dropIngredients({ state, commit }, ingredient) {
      const ingredientMovedArray = state.buildedPizza.ingredients;

      if (!ingredientMovedArray.find( el => el.id === ingredient.id )) {
        ingredient.counter += 1;
        commit('CHANGE_INGREDIENTS_COUNT', ingredient);

        let newIngredient = state.ingredients.find( el => el.id=== ingredient.id );

        ingredientMovedArray.push(newIngredient);

        commit('CHANGE_INGREDIENTS', ingredientMovedArray);

      } else if (ingredientMovedArray.find( el => el.id=== ingredient.id )) {
        ingredient.counter += 1;
        commit('CHANGE_INGREDIENTS_COUNT', ingredient);

        const findedElement = ingredientMovedArray.find(el => el.id === ingredient.id);
        let newIngredient = state.ingredients.find( el => el.id=== ingredient.id );

        ingredientMovedArray.splice(ingredientMovedArray.indexOf(findedElement), 1);
        ingredientMovedArray.push(newIngredient);

        commit('CHANGE_INGREDIENTS', ingredientMovedArray);
      }
    },
    setChangingPizza({ state, commit, dispatch}, copyPizza) {
      dispatch('setPizza');

      commit('SET_PIZZA_TO_CHANGE', copyPizza);
      commit('SET_SAUCE', copyPizza.sauce.type);
      commit('SET_DOUGH', copyPizza.dough.type);
      commit('SET_SIZE', copyPizza.size);
      commit('SET_INGREDIENT_COUNT', copyPizza.ingredients),
      commit('SET_ID', copyPizza.id);
    }
  },
};
