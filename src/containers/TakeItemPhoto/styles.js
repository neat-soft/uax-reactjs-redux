import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '@theme/';

const btnSize = Metrics.screenWidth / 5;

export default StyleSheet.create({
  topButtons: {
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  captureButtonContainer: {
    width: btnSize,
    height: btnSize,
    borderWidth: 1,
    borderColor: Colors.brandPrimary,
    borderRadius: btnSize / 2,
    backgroundColor: '#5555',
  },
  captureButton: {
    width: btnSize - 15,
    height: btnSize - 15,
    borderRadius: (btnSize - 15) / 2,
    backgroundColor: Colors.textDisabled,
  },
});
