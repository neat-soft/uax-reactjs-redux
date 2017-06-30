import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import OverlaySpinner from 'react-native-spinkit';
import { Colors, Metrics } from '@theme/';

const styles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  textContent: {
    top: 80,
    height: 50,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});
export default class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: this.props.visible, textContent: this.props.textContent };
  }
  componentWillReceiveProps(nextProps) {
    const { visible, textContent } = nextProps;
    this.setState({ visible, textContent });
  }
  _renderSpinner() {
    const { visible } = this.state;
    if (!visible) {
      return (<View />);
    }
    return (
      <View style={styles.container}>
        <OverlaySpinner
          isVisible
          size={60}
          type={'FadingCircleAlt'}
          color={Colors.brandPrimary}
        />
      </View>
    );
  }
  render() {
    return this._renderSpinner();
  }
}
