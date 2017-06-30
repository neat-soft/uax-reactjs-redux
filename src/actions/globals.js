import Types from './actionTypes';

export const setHomeTab = homeTab =>
  ({ type: Types.SET_HOME_TAB, homeTab });
export const setMyAppTab = myAppTab =>
  ({ type: Types.SET_MYAPP_TAB, myAppTab });
export const popAgentModal = agentModal =>
  ({ type: Types.POP_AGENT_MODAL, agentModal });
export const productFilterValue = filterValue =>
  ({ type: Types.PRODUCT_FILTER_VALUE, filterValue });
export const setLocation = location =>
  ({ type: Types.SET_LOCATION, location });
export const setDistance = distance =>
  ({ type: Types.SET_DISTANCE, distance });
export const setUser = user =>
  ({ type: Types.SET_USER, user });
export const setPreRoute = route =>
  ({ type: Types.SET_PRE_ROUTE, route });
export const setChannelsState = channelState =>
  ({ type: Types.SET_CHANNELS_STATE, channelState });
export const setUnreadState = readed =>
  ({ type: Types.SET_UNREAD_STATE, readed });
export const setMessage = message =>
  ({ type: Types.SET_MESSAGE, message });
export const setResponseMsg = responseMsg =>
  ({ type: Types.SET_RESPONSE_MSG, responseMsg });
export const setOneSignalInfo = device =>
  ({ type: Types.SET_ONESIGNAL_INFO, device });
export const showShareView = shareVisible =>
  ({ type: Types.SHOW_SHARE_VIEW, shareVisible });
export const setBadge = badgeVisible =>
  ({ type: Types.SET_BADGE, badgeVisible });
export const setSpinnerVisible = spinnerVisible =>
  ({ type: Types.SET_SPINNER_VISIBLE, spinnerVisible });
export const setLocationPermission = locationPermission =>
  ({ type: Types.SET_LOCATION_PERMISSION, locationPermission });
