import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

export default StyleSheet.create({
  listContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  bottomArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kmText: {
    fontFamily: Fonts.type.base,
    color: Colors.textDisabled,
    fontSize: Fonts.size.mini,
    alignSelf: 'center',
    marginLeft: 3,
  },
  sliderLabelContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
});
