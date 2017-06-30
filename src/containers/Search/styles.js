import { StyleSheet } from 'react-native';
import { Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  sliderLabelContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  buttonStyle: {
    width: Metrics.screenWidth * 0.9,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 25,
    marginVertical: 10,
  },
  goButtonStyle: {
    width: Metrics.screenWidth * 0.1,
    height: 30,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 5,
    marginRight: 5,
  },
  listContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
});
