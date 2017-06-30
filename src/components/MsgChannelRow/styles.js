import { StyleSheet, Platform } from 'react-native';
import { Styles, Fonts, Images, Colors, Metrics } from '@theme/';

const rowHeight = Metrics.screenHeight * 0.11;

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: rowHeight,
    width: Metrics.screenWidth,
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  nameText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    color: Colors.textThird,
  },
  msgText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.mini,
  },
});
