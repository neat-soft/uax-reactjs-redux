import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  avatarStyle: {
    width: Metrics.screenWidth / 4,
    height: Metrics.screenWidth / 4,
    borderRadius: Metrics.screenWidth / 8,
  },
  nameText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.h5,
    color: Colors.textThird,
    marginTop: 10,
  },
  modal: {
    backgroundColor: 'white',
    width: Metrics.screenWidth * 0.7,
    height: Metrics.screenHeight / 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 10,
    top: Metrics.screenHeight / 2.5,
    left: Metrics.screenWidth * 0.15,
  },
  descText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.small,
    color: Colors.textDisabled,
    marginTop: 3,
  },
  favoriteContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 0,
  },
  addOfferButton: {
    width: Metrics.screenWidth * 0.9,
    height: Metrics.screenHeight * 0.08,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 35,
    marginVertical: 10,
  },
  profileRowContainer: {
    width: Metrics.screenWidth,
    paddingHorizontal: 5,
  },
  profileRowSeparatorContainer: {
    backgroundColor: Colors.backgroundPrimary,
    height: Metrics.screenHeight * 0.07,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  profileRowTitleText: {
    color: Colors.textDisabled,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.small,
    fontWeight: 'normal',
  },
  profileSeparatorText: {
    color: Colors.textThird,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.small,
  },
  radioStyle: {
    flex: 1,
    width: Metrics.screenWidth / 4.5,
    paddingRight: 10,

  },
  radioButtonWrap: {
    marginRight: 5,
  },
  switchRowContainer: {
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: Metrics.screenHeight * 0.08,
  },
  underline: {
    borderBottomWidth: 0.5,
    borderColor: Colors.underlinePrimary,
  },
  agentListItem: {
    flexDirection: 'row',
    backgroundColor: Colors.brandPrimary,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    height: 30,
  },
  profileRowContentText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
  },
  viewInputStyle: {
    borderBottomColor: Colors.underlinePrimary,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  formInputStyle: {
    marginLeft: 0,
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  versionText: {
    marginTop: 5,
    alignSelf: 'flex-end',
    marginRight: 20,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    color: Colors.textDisabled,
  },
});
