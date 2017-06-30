import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  homeTab: 'discover',
  myAppTab: 'messages',
  agentModal: false,
  location: null,
  distance: 50,
  user: {},
  filterValue: {
    date_range: 50,
    expire_sort: 1,
    category: 0,
  },
  preRoute: '', // 'takephoto' and 'viewproduct'
  channelState: [],
  readed: false,
  message: '',
  responseMsg: false,
  device: {},
  shareVisible: false,
  badgeVisible: false,
  spinnerVisible: false,
  locationPermission: '',
});
const homeTab = (state, action) => ({
  ...state,
  homeTab: action.homeTab,
});
const myAppTab = (state, action) => ({
  ...state,
  myAppTab: action.myAppTab,
});
const agentModal = (state, action) => ({
  ...state,
  agentModal: action.agentModal,
});
const location = (state, action) => ({
  ...state,
  location: action.location,
});
const distance = (state, action) => ({
  ...state,
  distance: action.distance,
});
const filterValue = (state, action) => ({
  ...state,
  filterValue: action.filterValue,
});
const user = (state, action) => ({
  ...state,
  user: action.user,
});
const preRoute = (state, action) => ({
  ...state,
  preRoute: action.route,
});
const channelState = (state, action) => ({
  ...state,
  channelState: action.channelState,
});
const readMessage = (state, action) => ({
  ...state,
  readMessage: action.readed,
});
const message = (state, action) => ({
  ...state,
  message: action.message,
});
const responseMsg = (state, action) => ({
  ...state,
  responseMsg: action.responseMsg,
});
const deviceInfo = (state, action) => ({
  ...state,
  device: action.device,
});
const shareVisible = (state, action) => ({
  ...state,
  shareVisible: action.shareVisible,
});
const badgeVisible = (state, action) => ({
  ...state,
  badgeVisible: action.badgeVisible,
});
const spinnerVisible = (state, action) => ({
  ...state,
  spinnerVisible: action.spinnerVisible,
});
const locationPermission = (state, action) => ({
  ...state,
  locationPermission: action.locationPermission,
});
const actionHandlers = {
  [Types.SET_HOME_TAB]: homeTab,
  [Types.SET_MYAPP_TAB]: myAppTab,
  [Types.POP_AGENT_MODAL]: agentModal,
  [Types.SET_LOCATION]: location,
  [Types.SET_DISTANCE]: distance,
  [Types.PRODUCT_FILTER_VALUE]: filterValue,
  [Types.SET_USER]: user,
  [Types.SET_PRE_ROUTE]: preRoute,
  [Types.SET_CHANNELS_STATE]: channelState,
  [Types.SET_UNREAD_STATE]: readMessage,
  [Types.SET_MESSAGE]: message,
  [Types.SET_RESPONSE_MSG]: responseMsg,
  [Types.SET_ONESIGNAL_INFO]: deviceInfo,
  [Types.SHOW_SHARE_VIEW]: shareVisible,
  [Types.SET_BADGE]: badgeVisible,
  [Types.SET_SPINNER_VISIBLE]: spinnerVisible,
  [Types.SET_LOCATION_PERMISSION]: locationPermission,
};
export default createReducer(initialState, actionHandlers);
