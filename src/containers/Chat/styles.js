import { StyleSheet } from 'react-native';
import { Styles, Fonts, Images, Colors, Metrics } from '@theme/';

export default StyleSheet.create({
  footerText: {
    ...Fonts.style.description,
    color: Colors.textDisabled,
    marginLeft: 5,
    marginBottom: 5,
  },
});
