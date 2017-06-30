import { Platform } from 'react-native';
import _RCTRealtimeMessagingAndroid from './RCTRealtimeMessagingAndroid.js';
import _RCTRealtimeMessagingIOS from './RCTRealtimeMessagingIOS.js';

let RCTRealtimeMessaging;

if (Platform.OS === 'ios') {
	RCTRealtimeMessaging = _RCTRealtimeMessagingIOS;
} else {
	RCTRealtimeMessaging = _RCTRealtimeMessagingAndroid;
}

module.exports = RCTRealtimeMessaging;
