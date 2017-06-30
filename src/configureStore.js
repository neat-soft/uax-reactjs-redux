import { applyMiddleware, compose, createStore } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import devTools from 'remote-redux-devtools';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState = fromJS({})) {
  const middlewares = [
    sagaMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  if (__DEV__) {
    enhancers.push(devTools());
  }

  const store = createStore(
    createReducer(),
    initialState,
    compose(...enhancers)
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;

  return store;
}

module.exports = configureStore;

/*import { AsyncStorage } from 'react-native';
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import promise from './promise';
import rootSaga from './sagas';

export default function configureStore(onCompletion:()=>void):any {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(
    applyMiddleware(thunk, promise, sagaMiddleware),
    devTools({
      name: 'UXA', realtime: true,
    }),
  );

  const store = createStore(reducer, enhancer);
  persistStore(store, { storage: AsyncStorage }, onCompletion);

  sagaMiddleware.run(rootSaga);
  //store.runSaga = sagaMiddleware.run;
  return store;
}
*/
