import React, { Component } from 'react';
import { ListView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { popRoute, pushNewRoute } from '@actions/route';
import { setUnreadState, setChannelsState, setPreRoute, setSpinnerVisible } from '@actions/globals';
import MsgChannelRow from '@components/MsgChannelRow';
import I18n from 'react-native-i18n';
import Utils from '@src/utils';
import { Colors, Styles, Global } from '@theme';
import RTM from '@src/rtm';

let _this;
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
    _this = this;
  }
  componentWillMount() {
    this.props.setSpinnerVisible(true);
    this.loadChannels();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.getDataSource(nextProps.globals.channelState) });
  }
  getDataSource(channels) {
    return this.state.dataSource.cloneWithRows(channels);
  }
  gotoChat(otherUserId, otherUserName, otherUserAvatar, productId) {
    if (productId === null) return;
    this.props.setSpinnerVisible(true)
    const formdata = new FormData();
    formdata.append('token', _this.props.logins.token);
    formdata.append('UserId', otherUserId);
    formdata.append('ProductId', productId);
    fetch(Global.API_URL + '/channel/_set', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      if (responseData.status_code === 200) {
        this.loadChannel(otherUserId, otherUserName, otherUserAvatar, productId);
      } else {
        console.log('message--gotoChat:', responseData.message);
      }
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
    })
    .done();
  }
  loadChannel(otherUserId, otherUserName, otherUserAvatar, productId) {
    fetch(Global.API_URL + '/channel/_get_channel_id', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: _this.props.logins.token,
        OtherUserId: otherUserId,
        ProductId: productId,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.status_code === 200) {
        if (responseData.Block === 0) {
          Global.channelId = responseData.channelId.toString();
          if (Global.RTM_CONNECTED === true) {
            RTM.RTIsSubscribed(Global.channelId, function (result) {
              if (result === true) {
                console.log(Global.channelId + ' is subscribed');
              } else {
                RTM.RTSubscribe(Global.channelId, true);
              }
            });
          }
          this.gotoChatDetail(otherUserId, otherUserName, otherUserAvatar, productId);
        }
      }
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  loadChannels() {
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    fetch(Global.API_URL + '/channel/_get', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      if (responseData.status_code === 200) {
        if (responseData.channels.length > 0) {
          let tmpData = [];
          for (let i = 0; i < responseData.channels.length; i += 1) {
            if (responseData.channels[i].Block === 0 && responseData.channels[i].ProductAvatar !== '') {
              const tmp = { id: 0, avatar: '', message: '', name: '', unreadStatus: 0 };
              tmp.id = responseData.channels[i].id;
              tmp.avatar = responseData.channels[i].image;
              tmp.name = responseData.channels[i].name;
              tmp.unreadStatus = responseData.channels[i].Unread;
              tmp.message = responseData.channels[i].Message;
              tmp.productId = responseData.channels[i].ProductId;
              tmp.productAvatar = responseData.channels[i].ProductAvatar;
              tmp.productName = responseData.channels[i].ProductName;
              if (responseData.channels[i].Unread === 1) {
                tmpData.unshift(tmp);
                // tmpData = tmpData.concat(tmp);
              } else {
                tmpData = tmpData.concat(tmp);
              }
            }
          }
          this.props.setChannelsState(tmpData);
        }
      } else {
        console.log('message--loadChannel:', responseData.message);
        // this.setState({ dataSource: this.getDataSource([]) });
      }
    }).catch((error) => {
      Utils.toast(error);
    })
    .done();
  }
  popRoute() {
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }

  gotoChatDetail(userId, userName, userAvatar, productId) {
    this.props.setPreRoute('message');
    this.props.navigator.push({
      id: 'chat',
      passProps: {
        userId,
        userName,
        userAvatar,
        productId,
      },
    });
  }
  renderRow(rowData) {
    return (
      <MsgChannelRow
        name={rowData.name}
        message={rowData.message}
        avatar={rowData.avatar}
        unread={rowData.unreadStatus === 1 ? true : false}
        productAvatar={rowData.productAvatar}
        productName={rowData.productName}
        onPress={() => this.gotoChat(rowData.id, rowData.name, rowData.avatar, rowData.productId)}
      />
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={rowID}
        style={{
          height: 1,
          backgroundColor: Colors.underlinePrimary,
        }}
      />
    );
  }
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        {this.state.dataSource._cachedRowCount > 0 ?
            (<ListView
              style={{ flex: 1 }}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
              renderSeparator={this.renderSeparator.bind(this)}
              automaticallyAdjustContentInsets={false}
            />)
            :
            (<Text style={Styles.emptyText}>
              {I18n.t('DATA_EMPTY_MESSAGE')}
            </Text>)}
        <View style={{ height: 80 }} />
      </View>
    );
  }
}
Messages.propTypes = {

};
Messages.defaultProps = {

};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setUnreadState: unread => dispatch(setUnreadState(unread)),
    setChannelsState: channelState => dispatch(setChannelsState(channelState)),
    setPreRoute: route => dispatch(setPreRoute(route)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  return { globals, logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(Messages);
