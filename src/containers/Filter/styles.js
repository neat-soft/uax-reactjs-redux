import { StyleSheet } from 'react-native';
import { Styles, Fonts, Images, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  sliderLabelContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  labels: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    color: Colors.textSecondary,
  },
  rowContainer: {
    flex: 1,
    backgroundColor: Colors.brandSecondary,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.borderSecondary,
  },
  categoryText: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.normal,
    color: Colors.brandPrimary,
    marginTop: 5,
  },
});
