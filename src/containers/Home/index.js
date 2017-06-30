import React, { Component } from 'react';
import { View, Clipboard, ToastAndroid, Platform, DeviceEventEmitter, NativeModules, NetInfo, Alert } from 'react-native';
import { connect } from 'react-redux';
import store from 'react-native-simple-store';
import Permissions from 'react-native-permissions'
import Share, { ShareSheet, Button } from 'react-native-share';
import I18n from 'react-native-i18n';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Discover from '../Discover/';
import MyApp from '../MyApp';
import HomeTabBar from '@components/HomeTabBar';
import FloatButton from '@components/FloatButton';
import { setRenderProduct, setProduct } from '@actions/product';
import { setLocation, setHomeTab, setMessage, setResponseMsg, setChannelsState, setBadge, setUser, showShareView, setPreRoute, setSpinnerVisible, setLocationPermission } from '@actions/globals';
import { popRoute, pushNewRoute } from '@actions/route';
import { Styles, Colors, Global, Fonts, Metrics } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';
import RTM from '@src/rtm';

let offset = 0;
let _this;
const None = Platform.OS === 'ios' ? 'none' : 'NONE';
let permissionLocation = '';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: '',
      circleBtnText: I18n.t('TO_OFFER'),
      connectionInfo: null,
    };
    _this = this;
  }
  componentWillMount() {
    this.doConnect();
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    this.getCurrentCoordinate();
    this.getUser();
    this.loadUnreadState();
    if (this.props.globals.homeTab === 'myapp') {
      this.props.setHomeTab('discover');
    }
  }
  componentDidMount() {
    NetInfo.addEventListener('change', this.handleConnectionInfoChange.bind(this));
    NetInfo.fetch().done(
        (connectionInfo) => {
          this.connectionInfo = connectionInfo;
        });
    this.checkPemission();
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.globals.shareVisible) {
    //   this.onShare();
    // }
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }
  onReceived(notification) {
    console.log('received=========', notification);
  }
  onOpened(openResult) {
    const productid = Platform.OS === 'ios' ?
      openResult.notification.payload.additionalData.productId
      : openResult.notification.payload.additionalData.productId;
    _this.props.setSpinnerVisible(true);
    fetch(Global.API_URL + '/product/get_products_filter', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: _this.props.logins.token,
        distance: 50,
        latitude: _this.props.globals.location.latitude,
        longitude: _this.props.globals.location.longitude,
        date_range: _this.props.globals.filterValue.date_range,
        expire_sort: _this.props.globals.filterValue.expire_sort,
        category: _this.props.globals.filterValue.category,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then((responseData) => {
      let productNo = 0;
      _this.props.setSpinnerVisible(false);
      _this.props.setProduct(responseData);
      for (let i = 0; i < responseData.length; i += 1) {
        if (responseData[i].id.toString() === productid.toString()) {
          productNo = i;
          break;
        }
      }
      _this.props.setRenderProduct(responseData[productNo]);
      _this.pushNewRoute('viewproduct');
    }).catch((error) => {
      console.log('---home error 1-----', error);
      _this.props.setSpinnerVisible(false);
    })
    .done();
  }
  // onShare() {
  //   this.setState({ shareVisible: true });
  // }
  onCancelShare() {
    // this.setState({ shareVisible: false });
    this.props.showShareView(false);
  }
  onScroll(event) {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const delta = Platform.OS === 'android' ? 8 : 15;
    if (_this.props.products.productInfo.length < 5 || currentOffset < 0) {
      return;
    } else if (currentOffset > offset + delta) {
      _this.setState({
        animation: Platform.OS === 'android' ? 'slideOutDown' : 'slideOutDown',
        circleBtnText: '',
      });
    } else if (currentOffset < offset - delta) {
      _this.setState({
        animation: Platform.OS === 'android' ? 'slideInUp' : 'slideInUp',
        circleBtnText: '',
      });
    }
    offset = currentOffset;
  }
  // ////////////////////////get current position/////////////////////////////
  getCurrentCoordinate() {
    if (Platform.OS === 'ios') {
      NativeModules.RNLocation.requestAlwaysAuthorization();
      NativeModules.RNLocation.startUpdatingLocation();
      NativeModules.RNLocation.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        const locationMe = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
        _this.props.setLocation(locationMe);
      });
    } else {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: '<h6>Use Location?</h6>This app wants to change your device settings.',
        ok: 'YES',
        cancel: 'NO',
      }).then(function(success) {
        this.watchID = navigator.geolocation.watchPosition((position) => {
          const locationMe = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          _this.props.setLocation(locationMe);
        },
        (error) => {
          console.log('---home error 2-----', error);
        });
      }).catch((error) => {
        console.log('---home error 3-----', error);
      });
    }
  }
  getUser() {
    fetch(Global.API_URL + '/auth/get_user', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then((responseData) => {
      if (responseData === null) {
        return;
      }
      this.props.setUser(responseData);
      this.setDeviceInfoToDB(responseData.user.id);
    }).catch((error) => {
      console.log('---home error 4-----', error);
    })
    .done();
  }
  setDeviceInfoToDB(userId) {
    store.get('device').then((device) => {
      if (device === null) {
        return;
      }
      fetch(Global.API_URL + '/auth/set_device', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          device_id: device.userId,
          push_token: device.pushToken,
        }),
      })
      .then(response => response.json())
      .then((responseData) => {
        console.log('-----device info-----', responseData);
      }).catch((error) => {
        console.log('---home error 4-----', error);
      })
      .done();
    });
  }
  setCurLocation() {
    _this.getCurrentCoordinate();
    Utils.toast(I18n.t('TOAST_LOCATION_UNDEFINED'));
  }
  checkPemission() {
    if (Platform.OS === 'ios') {
      Permissions.getPermissionStatus('location')
        .then((response) => {
          this.props.setLocationPermission(response);
        });
    } else {
      this.props.setLocationPermission('authorized');
    }
  }
  handleConnectionInfoChange(connectionInfo) {
    this.connectionInfo = connectionInfo;
  }
  // /////////////////Real time message connecting//////////////////////////////////////
  doConnect() {
    console.log('RTM is trying to connect!');
    RTM.RTEventListener('onConnected', this._onConnected.bind(this));
    RTM.RTEventListener('onDisconnected', this._onDisconnected.bind(this));
    RTM.RTEventListener('onException', this._onException.bind(this));
    RTM.RTEventListener('onSubscribed', this._onSubscribed.bind(this));
    RTM.RTEventListener('onUnSubscribed', this._onUnSubscribed.bind(this));
    RTM.RTConnect({
      appKey: Global.RTM_APP_KEY,
      token: Global.RTM_TOKEN,
      connectionMetadata: Global.RTM_META_DATA,
      clusterUrl: Global.RTM_CLUSTER_URL,
      projectId: Global.RTM_GCM_PROJECT_ID,
    });
  }
  _onNotification(data) {
    console.log('Received notification: ' + JSON.stringify(data));
  }
  _onConnected() {
    console.log('connected');
    Global.RTM_CONNECTED = true;
    RTM.RTIsSubscribed('UXA', function (result) {
      if (result === true) {
        console.log('UXA is subscribed');
      } else {
        RTM.RTSubscribe('UXA', true);
      }
    });
    RTM.RTEventListener('onMessage', this._onMessage.bind(this));
  }
  _onDisconnected() {
    Global.RTM_CONNECTED = false;
    console.log('disconnected');
  }
  _onSubscribed(subscribedEvent) {
    console.log("Subscribed channel " + subscribedEvent.channel);
  }
  _onUnSubscribed(unSubscribedEvent) {
    console.log("Unsubscribed channel " + unSubscribedEvent.channel);
  }
  _onException(exceptionEvent) {
    console.log("Exception:" + exceptionEvent.error);
  }
  _onMessage(messageEvent) {
    const obj = JSON.parse(messageEvent.message);
    if (messageEvent.channel === 'UXA') {
      if (obj.otherUserId === this.props.globals.user.user.id) {
        RTM.RTIsSubscribed(obj.channelId, function (result) {
          if (result === false) {
            RTM.RTSubscribe(obj.channelId, true);
          }
        });
      }
    } else {
      if (Global.chatDetailOpened === true && messageEvent.channel === Global.channelId) {
          // ///////////////////////////
        this.props.setMessage(messageEvent.message);
        this.props.setResponseMsg(true);
      } else {
        this.loadChannels();
      }
    }
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
      if (responseData.status_code === 200) {
        if (responseData.channels.length > 0) {
          let tmpData = [];
          let unreadCount = 0;
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
                unreadCount += 1;
                tmpData.unshift(tmp);
                // tmpData = tmpData.concat(tmp);
              } else {
                tmpData = tmpData.concat(tmp);
              }
            }
          }
          this.props.setChannelsState(tmpData);
          if (unreadCount > 0) {
            this.props.setBadge(true);
          } else {
            this.props.setBadge(false);
          }
        }
      } else {
        console.log('home--message:', responseData.message);
      }
    }).catch((error) => {
      alert(error);
    })
    .done();
  }
  // ///////////////////////////////////////////////////////

  loadUnreadState() {
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    fetch(Global.API_URL + '/channel/_get_channel_status', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.status_code === 200) {
        if (responseData.UnreadStatus === 1) {
          _this.props.setBadge(true);
        } else {
          _this.props.setBadge(false);
        }
      }
    }).catch((error) => {
      console.log('---home error 5-----', error);
    })
    .done();
  }
  popRoute() {
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  showDiscoverTab() {
    this.props.setHomeTab('discover');
  }
  showMyappTab() {
    this.checkPemission();
    if (this.props.globals.locationPermission === 'denied') {
      this.alertForPermission();
    }
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    if (!this.props.globals.location) {
      this.setCurLocation();
      return;
    }
    this.props.setHomeTab('myapp');
  }
  alertForPermission() {
    Alert.alert(
      I18n.t('WHERE_ARE_YOU'),
      I18n.t('LOCATION_PEMISSION_MESSAGE'),
      [
        { text: I18n.t('OPEN_SETTING'), onPress: Permissions.openSettings },
      ]);
  }
  render() {
    const shareOptions = {
      title: 'uxa application',
      message: 'UXA - Essen einfach teilen'+ '\n' +
                'https://itunes.apple.com/.your.app.id.if.you.post.your.app' + '\n' +
                'https://play.google.com/store?hl=en',
      subject: 'www.uxa-app.com', //  for email
    };
    const mainPage = this.props.globals.homeTab === 'discover' ?
      (<Discover
        navigator={this.props.navigator}
        onScroll={this.onScroll}
        setCurLocation={this.setCurLocation}
      />)
    :
      <MyApp navigator={this.props.navigator} />;
    return (
      <View style={[Styles.fullScreen, { backgroundColor: Colors.brandSecondary }]}>
        {mainPage}
        <HomeTabBar
          animation={this.state.animation}
          centerTitle={I18n.t('TO_OFFER')}
          badgeVisible={this.props.globals.badgeVisible}
          centerTitleStyle={styles.tabCenterText}
          duration={Platform.OS === 'android' ? 800 : 450}
          onPressLeftButton={() => this.showDiscoverTab()}
          onPressRightButton={() => this.showMyappTab()}
        />
        <FloatButton
          buttonColor={Colors.brandPrimary}
          position={'center'}
          onPress={() => {
            if (this.connectionInfo === None) {
              Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
              return;
            }
            this.props.setPreRoute('home');
            Global.OfferImages = [];
            this.pushNewRoute('takeitemphoto');
          }}
        />
        <ShareSheet visible={this.props.globals.shareVisible} onCancel={this.onCancelShare.bind(this)}>
          <Button textStyle={{ marginLeft: Platform.OS === 'ios' ? -60 : 10 }}>
            {I18n.t('SHARE_FRIEND')}
          </Button>
          <Button
            iconSrc={{ uri: Global.TWITTER_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, { 'social': 'twitter' }));
              }, 300);
            }}
          >
            Twitter
          </Button>
          <Button
            iconSrc={{ uri: Global.FACEBOOK_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, { 'social': 'facebook' }));
              }, 300);
            }}
          >
            Facebook
          </Button>
          <Button
            iconSrc={{ uri: Global.WHATSAPP_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, { 'social': 'whatsapp' }));
              }, 300);
            }}
          >
            Whatsapp
          </Button>
          <Button
            iconSrc={{ uri: Global.GOOGLE_PLUS_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, { 'social': 'googleplus' }));
              }, 300);
            }}
          >
            Google +
          </Button>
          <Button
            iconSrc={{ uri: Global.EMAIL_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                Share.shareSingle(Object.assign(shareOptions, { 'social': 'email' }));
              }, 300);
            }}
          >
            Email
          </Button>
          <Button
            iconSrc={{ uri: Global.CLIPBOARD_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                if (typeof shareOptions["url"] !== 'undefined') {
                  Clipboard.setString(shareOptions["url"]);
                  if (Platform.OS === 'android') {
                    ToastAndroid.show(I18n.t('LINK_COPIED'), ToastAndroid.SHORT);
                  } else if (Platform.OS === 'ios') {
                    Utils.toast(I18n.t('LINK_COPIED'));
                  }
                }
              }, 300);
            }}
          >
            Copy Link
          </Button>
          <Button
            iconSrc={{ uri: Global.MORE_ICON }}
            onPress={() => {
              this.onCancelShare();
              setTimeout(() => {
                Share.open(shareOptions);
              }, 300);
            }}
          >
            More
          </Button>
        </ShareSheet>
      </View>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setHomeTab: homeTab => dispatch(setHomeTab(homeTab)),
    setUser: user => dispatch(setUser(user)),
    setMessage: message => dispatch(setMessage(message)),
    setResponseMsg: responseMsg => dispatch(setResponseMsg(responseMsg)),
    setChannelsState: channels => dispatch(setChannelsState(channels)),
    setBadge: visible => dispatch(setBadge(visible)),
    setRenderProduct: renderProduct => dispatch(setRenderProduct(renderProduct)),
    setProduct: product => dispatch(setProduct(product)),
    showShareView: showVisible => dispatch(showShareView(showVisible)),
    setPreRoute: route => dispatch(setPreRoute(route)),
    setLocation: coords => dispatch(setLocation(coords)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
    setLocationPermission: locPermission => dispatch(setLocationPermission(locPermission)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  const products = state.get('productinfo');
  return { globals, logins, products };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
