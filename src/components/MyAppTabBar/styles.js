import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Images, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Metrics.footerHeight * 0.8,
    width: Metrics.screenWidth,
    backgroundColor: 'transparent',
  },
  tabButtonText: {
    fontFamily: Fonts.type.light,
    fontSize: Fonts.size.small,
    color: Colors.textThird,
    textAlign: 'center',
  },
  badgeIcon: {
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
    position: 'absolute',
    right: 3,
    top: (Metrics.footerHeight * 0.6) / 2,
  },
});
