import { StyleSheet, Platform } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: Metrics.footerHeight,
    width: Metrics.screenWidth,
    backgroundColor: 'transparent',
    shadowOpacity: (Platform.OS === 'ios') ? 0.2 : 2,
    shadowRadius: (Platform.OS === 'ios') ? 2.6 : 4,
    shadowOffset: {
      width: 0,
      height: -2.5,
    },
    shadowColor: '#000',
    position: 'absolute',
    bottom: 0,
    borderTopColor: '#ececee',
    borderTopWidth: (Platform.OS === 'android') ? 1 : 0,
  },
  centerButton: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.textPrimary,
  },
  tabView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundPrimary,
  },
  badgeIcon: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    position: 'absolute',
    right: (Metrics.screenWidth / 4) - 30,
    top: 3,
  },
  centerText: {
    fontSize: Fonts.size.mini,
    fontFamily: Fonts.type.emphasis,
    textAlign: 'center',
    marginBottom: 3,
    color: Colors.textSecondary,
  },
});
