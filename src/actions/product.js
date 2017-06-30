import Types from './actionTypes';

export const setProduct = productInfo =>
  ({ type: Types.PRODUCT_GET, productInfo });
export const setSearchProduct = searchProductInfo =>
  ({ type: Types.PRODUCT_GET_SEARCH, searchProductInfo });
export const setRenderProduct = renderProductInfo =>
  ({ type: Types.PRODUCT_GET_RENDER, renderProductInfo });
export const setMyOffer = myOffers =>
  ({ type: Types.PRODUCT_SET_OFFER, myOffers });
export const setMyFavourite = myFavourites =>
  ({ type: Types.PRODUCT_SET_FAVOURITE, myFavourites });
