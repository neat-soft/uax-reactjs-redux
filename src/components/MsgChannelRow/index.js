import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

import Avatar from '@components/Avatar';
import { Styles, Images, Colors, Fonts } from '@theme/';
import styles from './styles';

class MsgChannelRow extends Component {
  render() {
    const unreadAvatarStyle = this.props.unread === true ?
    [{ borderWidth: 3, borderColor: Colors.brandPrimary, position: 'absolute', bottom: 1, right: 1 }]
      :
    [{ borderWidth: 3, borderColor: 'white', position: 'absolute', bottom: 1, right: 1 }];
    const unreadTextStyle = this.props.unread === true ?
    [styles.msgText, { color: Colors.textSecondary }]
      :
    [styles.msgText, { color: Colors.textDisabled }];
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={styles.container}
      >
        <View style={[Styles.center, { flex: 2 }]}>
          <Avatar
            placeholder={Images.imgAvatar}
            size={'small'}
            source={this.props.productAvatar}
            interactive={false}
          />
          <Avatar
            placeholder={Images.imgAvatar}
            size={'mini'}
            source={this.props.avatar}
            interactive={false}
            style={unreadAvatarStyle}
          />
        </View>
        <View style={{ flex: 8, flexDirection: 'column' }}>
          <View style={{ flex: 4, justifyContent: 'flex-end' }}>
            <Text style={styles.nameText}>
              {this.props.name} - {this.props.productName}
            </Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <Text style={unreadTextStyle}>
              {this.props.message}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </TouchableOpacity>
    );
  }
}
MsgChannelRow.propTypes = {
  name: React.PropTypes.string,
  message: React.PropTypes.string,
  avatar: React.PropTypes.string,
  productName: React.PropTypes.string,
  unread: React.PropTypes.bool,
  productAvatar: React.PropTypes.string,
  onPress: React.PropTypes.func.isRequired,
};
MsgChannelRow.defaultProps = {
  name: 'none',
  message: 'none',
  avatar: '',
  productAvatar: '',
  productName: '',
  unread: false,
  onPress: () => { console.log('L'); },
};
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}

export default connect(mapStateToProps, null)(MsgChannelRow);
