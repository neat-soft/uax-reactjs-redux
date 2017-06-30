
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  productInfo: [],
  searchProductInfo: [],
  renderProductInfo: [],
  myOffers: [],
  myFavourites: [],
});
const productInfo = (state, action) => ({
  ...state,
  productInfo: action.productInfo,
});
const searchProductInfo = (state, action) => ({
  ...state,
  searchProductInfo: action.searchProductInfo,
});
const renderProductInfo = (state, action) => ({
  ...state,
  renderProductInfo: action.renderProductInfo,
});
const myOffers = (state, action) => ({
  ...state,
  myOffers: action.myOffers,
});
const myFavourites = (state, action) => ({
  ...state,
  myFavourites: action.myFavourites,
});
// map our types to our handlers
const actionHandlers = {
  [Types.PRODUCT_GET]: productInfo,
  [Types.PRODUCT_GET_SEARCH]: searchProductInfo,
  [Types.PRODUCT_GET_RENDER]: renderProductInfo,
  [Types.PRODUCT_SET_OFFER]: myOffers,
  [Types.PRODUCT_SET_FAVOURITE]: myFavourites,
};

export default createReducer(initialState, actionHandlers);
