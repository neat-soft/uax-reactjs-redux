import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { View } from 'react-native-animatable';
import { connect } from 'react-redux';

import styles from './styles';
import TabButton from './TabButton.js';

class MyAppTabBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TabButton
          badgeVisible={this.props.badgeVisible}
          buttonText={I18n.t('MESSAGES')}
          selected={this.props.globals.myAppTab === 'messages' ? true : false}
          onPress={() => this.props.onPressTabButton('messages')}
        />
        <TabButton
          buttonText={I18n.t('MY_OFFERS')}
          selected={this.props.globals.myAppTab === 'myoffers' ? true : false}
          onPress={() => this.props.onPressTabButton('myoffers')}
        />
        <TabButton
          buttonText={I18n.t('FAVORITE')}
          selected={this.props.globals.myAppTab === 'favorite' ? true : false}
          onPress={() => this.props.onPressTabButton('favorite')}
        />
        <TabButton
          buttonText={I18n.t('PROFILE')}
          selected={this.props.globals.myAppTab === 'profile' ? true : false}
          onPress={() => this.props.onPressTabButton('profile')}
        />
      </View>
    );
  }
}
MyAppTabBar.propTypes = {
  onPressTabButton: React.PropTypes.func.isRequired,
};
MyAppTabBar.defaultProps = {
  onPressTabButton: () => { console.log('L'); },
};
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}

export default connect(mapStateToProps, null)(MyAppTabBar);
