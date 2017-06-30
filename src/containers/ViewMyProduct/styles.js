import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  titleTextStyle: {
    color: Colors.textDisabled,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    backgroundColor: 'transparent',
    marginTop: 5,
  },
  chatButton: {
    position: 'absolute',
    bottom: -8,
    right: 0,
  },
  topButtons: {
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'transparent',
  },
  iconTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    color: Colors.textDisabled,
    fontFamily: Fonts.type.base,
    marginLeft: 5,
  },
  productInfo: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  mapContainer: {
    height: Metrics.screenHeight * 0.3,
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  otherProductsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSecondary,
    paddingTop: 15,
    marginHorizontal: 15,
  },
  msgButton: {
    width: Metrics.screenWidth * 0.9,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 25,
    position: 'absolute',
    bottom: 25,
  },
});
