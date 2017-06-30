// @flow
import { Platform } from 'react-native';

import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const Styles = {
  screen: {
    mainContainer: {
      flex: 1,
      marginTop: Metrics.navBarHeight,
      backgroundColor: Colors.transparent,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    container: {
      flex: 1,
      paddingTop: Metrics.baseMargin,
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin,
      borderTopColor: Colors.frost,
      borderTopWidth: 0.5,
      borderBottomColor: Colors.frost,
      borderBottomWidth: 1,
    },
    sectionText: {
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin,
    },
  },
  darkLabelContainer: {
    backgroundColor: Colors.cloud,
    padding: Metrics.smallMargin,
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow,
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center',
  },
  fullScreen: {
    width: Metrics.screenWidth,

    ...Platform.select({
      ios: {
        paddingBottom: 0,
        height: Metrics.screenHeight,
      },
      android: {
        paddingBottom: 0,
        height: Metrics.screenHeight + 24,
      },
    }),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonShadow: {
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: Platform.OS === 'ios' ? 8 : 4,
    },
    shadowColor: '#029c1f',
    shadowRadius: 8,
    elevation: 3,
  },
  buttonShadowSmall: {
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 3,
    },
    shadowColor: '#000',
    shadowRadius: 2,
    elevation: 3,
  },
  circleButtonShadow: {
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 5,
    },
    shadowColor: '#00a42e',
    shadowRadius: 5,
    elevation: 6,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: -4,
    backgroundColor: '#e3e5e1',
  },
  sliderScrollThumb: {
    width: Metrics.sliderThumbSize,
    height: Metrics.sliderThumbSize,
    borderRadius: Metrics.sliderThumbSize / 2,
    backgroundColor: Colors.brandPrimary,
    borderColor: Platform.OS === 'ios' ? Colors.brandSecondary : '#f2f0f0',
    borderWidth: 5,
  },
  navigationbar: {
    paddingHorizontal: 10,
    alignItems: 'flex-end',
    shadowOpacity: 0.2,
    shadowRadius: (Platform.OS === 'ios') ? 1.6 : 2,
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowColor: '#777',
    height: Metrics.navBarHeight,
    borderColor: Colors.underlinePrimary,
    borderBottomWidth: (Platform.OS === 'ios') ? 0 : 1,
  },
  productViewShadow: {
    height: Metrics.screenHeight * 0.5,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0, height: 5,
    },
    shadowColor: '#00a42e',
    shadowRadius: 6,
  },
  iconStyle: {
    width: 30,
    marginTop: Platform.OS === 'android' ? Metrics.statusBarHeight : 0,
    alignItems: 'center',
    marginBottom: 10,
  },
  topLeftButton: {
    alignItems: 'center',
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'transparent',
    marginTop: 5,
    left: 0,
    width: 40,
  },
  topRightButton: {
    position: 'absolute',
    top: Metrics.statusBarHeight,
    backgroundColor: 'transparent',
    right: 0,
    marginTop: 7,
    alignItems: 'center',
    width: 40,
  },
  emptyText: {
    marginTop: Metrics.screenHeight / 5,
    alignSelf: 'center',
    fontFamily: Fonts.type.bold,
    color: Colors.textSecondary,
  },
  spinnerStyle: {
    position: 'absolute',
    top: (Metrics.screenHeight / 3),
    left: (Metrics.screenWidth / 2) - 30,
  },
  modalBtn: {
    width: 60,
    borderRadius: 5,
  },
};

export default Styles;
