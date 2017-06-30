import { StyleSheet, Platform } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  titleTextStyle: {
    color: Colors.textSecondary,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.bold,
    marginTop: 5,
  },
  addImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  topButtons: {
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'transparent',
  },
  topArea: {
    height: (Metrics.screenHeight * 0.4) + (Metrics.circleBtnSize / 2) + 10,
  },
  bottomArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  descriptionText: {
    ...Fonts.style.description,
    color: Colors.textSecondary,
    height: Metrics.screenHeight * 0.1,
    width: Metrics.screenWidth * 0.9,
    alignSelf: 'center',
    textAlign: 'auto',
    paddingTop: 0,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    width: Metrics.screenWidth * 0.9,
    paddingLeft: 4,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomColor: Colors.underlinePrimary,
    borderBottomWidth: 0.9,
  },
  categoryText: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.medium,
    color: Colors.brandPrimary,
    marginTop: 5,
  },
  publishNotifText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.mini,
    color: Colors.textDisabled,
    width: Metrics.screenWidth * 0.9,
    textAlign: 'center',
  },
  offerBtn: {
    width: Metrics.screenWidth * 0.9,
    height: Metrics.screenHeight * 0.08,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 35,
    marginBottom: 20,
  },
  viewInputStyle: {
    borderBottomColor: Colors.underlinePrimary,
    borderBottomWidth: 1,
    width: Metrics.screenWidth * 0.9,
    alignItems: 'center',
  },
});
