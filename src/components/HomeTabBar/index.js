import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { View, Text } from 'react-native-animatable';
import { connect } from 'react-redux';

import { Styles, Colors, Metrics } from '@theme/';
import styles from './styles';
import CircleButton from '../CircleButton';


class HomeTabBar extends Component {
  render() {
    return (
      <View style={styles.container} animation={this.props.animation} duration={this.props.duration}>
        <View style={styles.tabView}>
          <View style={[Styles.center, { flex: 0.4 }]}>
            <CircleButton
              icon={'ios-home'}
              radius={Metrics.screenWidth / 12}
              title={I18n.t('DISCOVER')}
              onPress={this.props.onPressLeftButton}
              color={this.props.globals.homeTab === 'discover' ? Colors.textSecondary : Colors.borderPrimary}
              showShadow={false}
            />
          </View>
          <View style={[Styles.center, { flex: 0.2, paddingVertical: 5 }]}>
            <View style={{ height: Metrics.screenWidth / 12, marginTop: 5 }} />
            <Text style={styles.centerText}>
              {this.props.centerTitle}
            </Text>
          </View>
          <View style={[Styles.center, { flex: 0.4 }]}>
            <CircleButton
              icon={'md-person'}
              radius={Metrics.screenWidth / 12}
              title={I18n.t('MYAPP')}
              onPress={this.props.onPressRightButton}
              color={this.props.globals.homeTab === 'myapp' ? Colors.textSecondary : Colors.borderPrimary}
              showShadow={false}
            />
            {this.props.badgeVisible ? (<View style={styles.badgeIcon} />) : null}
          </View>
        </View>
      </View>
    );
  }
}
HomeTabBar.propTypes = {
  onPressLeftButton: React.PropTypes.func.isRequired,
  onPressMiddleButton: React.PropTypes.func.isRequired,
  onPressRightButton: React.PropTypes.func.isRequired,
};
HomeTabBar.defaultProps = {
  onPressLeftButton: () => { console.log('L'); },
  onPressMiddleButton: () => { console.log('M'); },
  onPressRightButton: () => { console.log('R'); },
};
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}

export default connect(mapStateToProps, null)(HomeTabBar);
