import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  titleTextStyle: {
    backgroundColor: 'transparent',
    color: Colors.textDisabled,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    marginTop: 5,
  },
  chatButton: {
    position: 'absolute',
    bottom: -15,
    right: 0,
  },
  topButtons: {
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'red',
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
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenHeight * 0.06,
    backgroundColor: Colors.brandPrimary,
    flexDirection: 'row',
    borderRadius: 35,
    position: 'absolute',
    bottom: 25,
    left: Metrics.screenWidth * 0.15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    width: Math.round(Metrics.screenWidth * 0.7),
    height: Metrics.screenHeight / 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 10,
    top: Metrics.screenHeight / 2.5,
    left: Metrics.screenWidth * 0.15,
  },
});
