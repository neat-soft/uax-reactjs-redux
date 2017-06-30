import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Colors, Styles } from '@theme/';
import styles from './styles';

export default class TabButton extends Component {
  render() {
    const bottomLine = this.props.selected === true ?
      <View style={{ flex: 1, backgroundColor: Colors.brandPrimary }} />
    :
      <View style={{ flex: 1, backgroundColor: 'transparent' }} />;
    // const badgeIcon = this.props.badgeVisible ? <View style={styles.badgeIcon} /> : null;
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => this.props.onPress()}
      >
        <View style={[Styles.center, { flex: 10 }]}>
          <Text style={styles.tabButtonText}>
            {this.props.buttonText}
          </Text>
          {/* badgeIcon */}
        </View>
        {bottomLine}
      </TouchableOpacity>
    );
  }
}

TabButton.propTypes = {
  selected: PropTypes.bool,
  buttonText: PropTypes.string,
  onPress: PropTypes.func,
};

TabButton.defaultProps = {
  selected: false,
  onPress: () => {},
  buttonText: 'NONE',
};
