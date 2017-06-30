import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import { GiftedChat, Bubble, Composer, MessageText, Day, Time, LoadEarlier } from 'react-native-gifted-chat';
import Communications from 'react-native-communications';
import Spinner from '@components/OverlaySpinner';

import { popRoute, pushNewRoute } from '@actions/route';
import { setChannelsState, setResponseMsg, setBadge, setSpinnerVisible } from '@actions/globals';
import Avatar from '@components/Avatar';
import ActionSheet from '@components/ActionSheet/';
import { Styles, Fonts, Images, Colors, Global } from '@theme/';
import styles from './styles';
import Utils from '@src/utils';
import RTM from '@src/rtm';

const chatMenu = [
  { id: 0, label: I18n.t('CANCEL') },
  { id: 0, label: I18n.t('REPORT') },
  { id: 0, label: I18n.t('BLOCK') },
];
let isNotifSent = false;
let messageData = [];
const loadMsgCount = 10;
let userData = {};
let _this;
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this._isAlright = null;
    Global.chatDetailOpened = true;
    isNotifSent = false;
    _this = this;
  }
  componentWillMount() {
    this._isMounted = true;
    this.props.setSpinnerVisible(true);
    this.loadUser(this.props.userId);
    this.onActive(1);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.globals.message && nextProps.globals.responseMsg) {
      this.onReceive(nextProps.globals.message);
      this.props.setResponseMsg(false);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.onActive(0);
  }
  onActive(active) {
    fetch(Global.API_URL + '/auth/set_active', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        active,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      console.log('chat--onActive:', responseData);
    }).catch((error) => {
      console.log('chat--onActive:', error);
    })
    .done();
  }
  onBlock() {
    const formdata = new FormData();
    formdata.append('ChannelId', Global.channelId);
    fetch(Global.API_URL + '/channel/_set_block', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.status_code === 200) {
        this.popRoute();
      }
    }).catch((error) => {
      console.log('error-chat', error);
    })
    .done();
  }
  onActionSheetMenu(index) {
    if (index === 1) {
      Communications.email(['foodsaver@uxa-app.com'], null, null, I18n.t('REPORT'), 'Mein Körpertext');
    } else if (index === 2) {
      setTimeout(() => {
        Alert.alert(
          '',
          I18n.t('BLOCK_ALERT'),
          [
            { text: I18n.t('NO'), onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: I18n.t('YES'), onPress: () => this.onBlock() },
          ]);
      }, 300);
    }
  }
  onLoadEarlier() {
    this.setState((previousState) => {
      return { isLoadingEarlier: true };
    });
    setTimeout(() => {
      if (this._isMounted === true) {
        if (messageData.length > loadMsgCount) {
          this.setState((previousState) => {
            return {
              messages: GiftedChat.prepend(previousState.messages, messageData.splice(-loadMsgCount).reverse()),
              isLoadingEarlier: false,
            };
          });
        } else {
          this.setState((previousState) => {
            return {
              loadEarlier: false,
              messages: GiftedChat.prepend(previousState.messages, messageData.reverse()),
              isLoadingEarlier: false,
            };
          });
        }
      }
    }, 100);
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    if (messages[0].text.length > 0) {
      this.props.setSpinnerVisible(true);
      this.setChannelStatus(1);
      this.storeMessageToDB(messages[0].text);
      RTM.RTSendMessage(JSON.stringify(messages), Global.channelId);
    }
  }
  onReceive(text) {
    if (text === this.props.userId.toString()) {
      this.showTypingStatus();
    } else if (text !== this.props.globals.user.user.id.toString()) {
      const message = JSON.parse(text);
      if (message[0].user._id !== this.props.globals.user.user.id) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, {
              _id: Math.round(Math.random() * 1000000),
              text: message[0].text,
              createdAt: new Date(),
              user: {
                _id: this.props.userId,
                name: this.props.userName,
                avatar: this.props.userAvatar,
              },
            }),
          };
        });
      }
      if (Global.chatDetailOpened === true) {
        this.setChannelStatus(0);
      }
    }
  }
  // getUnreadState() {
  //   const formdata = new FormData();
  //   formdata.append('token', this.props.logins.token);
  //   fetch(Global.API_URL + '/channel/_get_channel_status', {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     method: 'POST',
  //     body: formdata,
  //   })
  //   .then(response => response.json())
  //   .then((responseData) => {
  //     if (responseData.status_code === 200) {
  //       if (responseData.UnreadStatus === 1) {
  //         this.setUnreadState(true);
  //       } else {
  //         this.setUnreadState(false);
  //       }
  //     }
  //   }).catch((error) => {
  //     console.log(error);
  //   })
  //   .done();
  // }
  setChannelStatus(status) {
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    formdata.append('UserId', this.props.userId);
    formdata.append('UnreadStatus', status);
    formdata.append('ProductId', this.props.productId);
    fetch(Global.API_URL + '/channel/_set_channel_unread', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      // console.log('chat.js--set channel state--', responseData);
    }).catch((error) => {
      console.log('chart--setChannel state:', error);
    })
    .done();
  }
  storeMessageToDB(message) {
    this.props.setSpinnerVisible(false);
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    formdata.append('ReceiverId', this.props.userId);
    formdata.append('Message', message);
    formdata.append('ProductId', this.props.productId);
    fetch(Global.API_URL + '/message/_set', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      console.log('----------save chat history------------', responseData);
    }).catch((error) => {
      console.log('----------save chat history------------', error);
      this.props.setSpinnerVisible(false);
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
      // console.log('chat---loadchannel', responseData);
      if (responseData.status_code === 200) {
        if (responseData.channels.length > 0) {
          let tmpData = [];
          let unreadCount = 0;
          for (let i = 0; i < responseData.channels.length; i += 1) {
            if (responseData.channels[i].Block === 0 && responseData.channels[i].ProductAvatar !== '') {
              const tmp = { id: 0, avatar: '', name: '', unreadStatus: 0 };
              tmp.id = responseData.channels[i].id;
              tmp.avatar = responseData.channels[i].image;
              tmp.name = responseData.channels[i].name;
              tmp.unreadStatus = responseData.channels[i].Unread;
              tmp.message = responseData.channels[i].Message;
              tmp.productId = responseData.channels[i].ProductId;
              tmp.productAvatar = responseData.channels[i].ProductAvatar;
              tmp.productName = responseData.channels[i].ProductName;
              if (responseData.channels[i].Unread === 1) {
                unreadCount += 1;
                tmpData.unshift(tmp);
                // tmpData = tmpData.concat(tmp);
              } else {
                tmpData = tmpData.concat(tmp);
              }
            }
          }
          _this.props.setChannelsState(tmpData);
          if (unreadCount > 0) {
            _this.props.setBadge(true);
          } else {
            _this.props.setBadge(false);
          }
          _this.props.popRoute();
        }
      } else {
        console.log('error---chat.js--');
      }
    }).catch((error) => {
      console.log('error---chat.js--', error);
    })
    .done();
  }
  loadUser(userId) {
    const formdata = new FormData();
    formdata.append('userId', userId);
    fetch(Global.API_URL + '/auth/get_user_id', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      userData = responseData.user;
      this.loadMessages(responseData.user);
    }).catch((error) => {
      console.log(error);
      this.props.setSpinnerVisible(false);
    })
    .done();
  }
  loadMessages(user) {
    fetch(Global.API_URL + '/message/_get', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        OtherUserId: user.id,
        ProductId: this.props.productId,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      messageData = [];
      if (responseData.status_code === 200) {
        if (responseData.chart.length > 0) {
          for (let i = 0; i < responseData.chart.length; i += 1) {
            const tmpImg = user.image === '' ? 'https://s3.eu-central-1.amazonaws.com/uxa-dev/profile/imgavatar.jpg' : user.image;
            const tmp = {
              _id: responseData.chart[i].id,
              text: responseData.chart[i].Message,
              user: {
                _id: responseData.chart[i].MUserId,
                avatar: (responseData.chart[i].MUserId === this.props.userId ?
                  tmpImg : '') },
              createdAt: Utils.getDateByConvertingFormat(responseData.chart[i].created_at)
            };
            messageData = messageData.concat(tmp);
          }
          if (messageData.length > loadMsgCount) {
            this.setState({ loadEarlier: true });
            this.setState({ messages: messageData.splice(-loadMsgCount).reverse() });
          } else {
            this.setState({ loadEarlier: false });
            this.setState({ messages: messageData.reverse() });
          }
        }
      } else {
        this.props.setSpinnerVisible(false);
      }
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
    })
    .done();
  }
  showTypingStatus() {
    // this.setState((previousState) => {
    //   return {
    //     typingText: this.props.userName + ' writes...',
    //   };
    // });
    // this.setState({ hideTypingStatus: false });
    // setTimeout(() => {
    //   this.setState({ hideTypingStatus: true });
    //   setTimeout(() => {
    //     this.setState((previousState) => {
    //       if (this.state.hideTypingStatus === true) {
    //         return { typingText: null };
    //       }
    //     });
    //   }, 300);
    // }, 300);
  }
  showActionSheetMenu() {
    this.ActionSheet.show();
  }
  popRoute() {
    if (this.props.globals.preRoute === 'viewproduct' || this.props.globals.homeTab === 'discover') {
      this.props.popRoute();
    } else {
      this.props.setSpinnerVisible(true);
      const formdata = new FormData();
      formdata.append('token', this.props.logins.token);
      formdata.append('UserId', this.props.userId);
      formdata.append('UnreadStatus', 0);
      formdata.append('ProductId', this.props.productId);
      fetch(Global.API_URL + '/channel/_set_channel_unread', {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: formdata,
      })
      .then(response => response.json())
      .then((responseData) => {
        if (responseData.status_code === 200) {
          this.props.setSpinnerVisible(false);
          Global.chatDetailOpened = false;
          // this.getUnreadState();
          this.loadChannels();
        }
      }).catch((error) => {
        this.props.setSpinnerVisible(false);
      })
      .done();
    }
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  renderHeader(title) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Avatar
          placeholder={Images.imgAvatar}
          size={'mini'}
          source={userData.image}
          interactive={false}
        />
        <Text
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            color: Colors.textSecondary,
            fontFamily: Fonts.type.bold,
            fontSize: Fonts.size.regular,
            marginLeft: 5 }}
        >
          {title}
        </Text>
      </View>
    );
  }
  renderComposer(props) {
    return (
      <Composer {...props} placeholder={I18n.t('TYPE_MESSAGE')} />
    );
  }
  renderMessageText(props) {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: {
            color: 'white',
          },
          right: {
            color: '#41474f',
          },
        }}
        linkStyle={{
          left: {
            color: 'white',
          },
          right: {
            color: '#41474f',
          },
        }}
      />
    );
  }
  renderLoadEarlierMessage(props) {
    return (
      <LoadEarlier
        {...props}
        label={I18n.t('LOAD_EALIER_MESSAGE')}
      />
    );
  }
  renderDayText(props) {
    return (
      <Day
        {...props}
        textStyle={{ color: Colors.textDisabled }}
      />
    );
  }
  renderTimeText(props) {
    return (
      <Time
        {...props}
        textStyle={{
          left: {
          },
          right: {
            color: Colors.textDisabled,
          },
        }}
      />
    );
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.brandPrimary,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0, height: 4,
            },
            shadowColor: '#AAA',
            shadowRadius: 2,
          },
          right: {
            backgroundColor: 'white',
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0, height: 4,
            },
            shadowColor: '#AAA',
            shadowRadius: 2,
          },
        }}
      />
    );
  }
  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }
  render() {
    const navBtnBack = (
      <TouchableOpacity
        style={Styles.iconStyle}
        onPress={() => this.popRoute()}
      >
        <Icon name="ios-arrow-back" size={40} color={Colors.brandPrimary} />
      </TouchableOpacity>
    );
    const navBtnMenu = (
      <TouchableOpacity
        style={[Styles.iconStyle, { alignItems: 'center' }]}
        onPress={() => this.showActionSheetMenu()}
      >
        <Icon name="md-more" size={35} color={Colors.brandPrimary} />
      </TouchableOpacity>
    );
    return (
      <View
        style={[Styles.fullScreen, { backgroundColor: 'white' }]}
      >
        <NavigationBar
          style={Styles.navigationbar}
          title={this.renderHeader(userData.name)}
          leftButton={navBtnBack}
          rightButton={navBtnMenu}
          tintColor={Colors.brandSecondary}
        />
        <View style={{ flex: 1, backgroundColor: Colors.backgroundPrimary }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
            user={{
              _id: this.props.globals.user.user.id, // sent messages should have same user._id
            }}
            renderComposer={this.renderComposer}
            renderBubble={this.renderBubble}
            renderFooter={this.renderFooter}
            renderDay={this.renderDayText}
            renderTime={this.renderTimeText}
            renderMessageText={this.renderMessageText}
            renderLoadEarlier={this.renderLoadEarlierMessage}
          />
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={chatMenu}
          cancelButtonIndex={0}
          onPress={this.onActionSheetMenu.bind(this)}
          tintColor={Colors.textSecondary}
        />
        <Spinner visible={this.props.globals.spinnerVisible} />
      </View>
    );
  }
}

Chat.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  pushNewRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setChannelsState: channelStates => dispatch(setChannelsState(channelStates)),
    setResponseMsg: responseMsg => dispatch(setResponseMsg(responseMsg)),
    setBadge: visible => dispatch(setBadge(visible)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  return { globals, logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
