import { StyleSheet, Platform } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  productItemContainer: {
    width: (Metrics.screenWidth / 2) - 8 - 4,
    height: (Metrics.screenHeight / 2.85) - 8 - 4,
    marginBottom: 8,
    backgroundColor: Colors.brandSecondary,
    borderRadius: 6,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowColor: '#666',
    elevation: Platform.OS === 'ios' ? 3 : 0,
    borderColor: '#EEE',
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
  },
  productItemImage: {
    flex: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  productItemInfo: {
    flex: 1,
  },
  productTitleTextContainer: {
    flex: 0.5,
    paddingLeft: 8,
    marginBottom: 5,
    justifyContent: 'center',
  },
  productTitleText: {
    fontFamily: Fonts.type.emphasis,
    color: Colors.textSecondary,
    fontSize: Fonts.size.medium,
  },
  bottomArea: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  kmText: {
    fontFamily: Fonts.type.emphasis,
    color: Colors.textDisabled,
    fontSize: Fonts.size.mini,
    alignSelf: 'center',
    marginLeft: 3,
  },
  kmView: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 3,
    paddingLeft: 3,
  },
  sendMsgBtn: {
    paddingVertical: 1,
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 12,
    marginRight: 3,
  },
});
