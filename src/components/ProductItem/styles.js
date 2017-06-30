import { StyleSheet, Platform } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: -4,
  },
  scrollThumb: {
    width: Metrics.sliderThumbSize,
    height: Metrics.sliderThumbSize,
    borderRadius: Metrics.sliderThumbSize / 2,
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandSecondary,
    borderWidth: 5,
  },
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  productItemContainer: {
    width: (Metrics.screenWidth / 2) - 8 - 4,
    height: (Metrics.screenHeight / 3.2) - 8 - 4,
    marginBottom: 8,
    backgroundColor: Colors.brandSecondary,
    borderRadius: 6,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowColor: '#666',
    elevation: Platform.OS === 'ios' ? 2 : 0,
    borderColor: '#EEE',
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
  },
  productItemImage: {
    flex: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  productItemInfo: {
    flex: 1,
  },
  productTitleTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 5,
  },
  productTitleText: {
    fontFamily: Fonts.type.emphasis,
    color: Colors.textSecondary,
    fontSize: Fonts.size.small,
  },
  kmText: {
    fontFamily: Fonts.type.base,
    color: Colors.textDisabled,
    fontSize: Fonts.size.mini,
    marginLeft: 5,
  },
  topButtons: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  closeIcon: {
    position: 'absolute',
    top: -3,
    right: -1,
    backgroundColor: 'transparent',
  },
});
