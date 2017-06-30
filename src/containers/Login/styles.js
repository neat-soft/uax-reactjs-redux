import { StyleSheet } from 'react-native';
import { Styles, Fonts, Images, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: Colors.textDisabled,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 35,
  },
  labelText: {
    color: Colors.textPrimary,
  },
  placeHolderText: {
    fontSize: Fonts.size.small,
    fontFamily: Fonts.type.base,
    fontWeight: 'normal',
    color: Colors.textSecondary,
    marginLeft: 0,
  },
  underlineText: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.medium,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.textSecondary,
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  underlineText1: {
    fontFamily: Fonts.type.emphasis,
    fontSize: Fonts.size.small,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.textSecondary,
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  appTitle: {
    fontSize: Fonts.size.h1,
    fontFamily: Fonts.type.bold,
    backgroundColor: 'transparent',
  },
  appDescription: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.type.bold,
    backgroundColor: 'transparent',
  },
  loginBtn: {
    width: Metrics.screenWidth * 0.85,
    height: Metrics.screenHeight * 0.08,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 35,
    marginTop: 15,
  },
  formInputStyle: {
    width: Metrics.screenWidth * 0.8,
  },
  viewInputStyle: {
    borderBottomColor: Colors.underlinePrimary,
    borderBottomWidth: 1,
    width: Metrics.screenWidth * 0.8,
    alignItems: 'center',
  },
});
