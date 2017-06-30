import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView, Clipboard, ToastAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
// import { Button } from 'react-native-elements';
import ViewPager from 'react-native-viewpager';
import MapView from 'react-native-maps';
import Modal from 'react-native-root-modal';
import Spinner from '@components/OverlaySpinner';
import Share, { ShareSheet, Button } from 'react-native-share';
import { AdMobBanner, AdMobRewarded } from 'react-native-admob';
import Communications from 'react-native-communications';
import Utils from '@src/utils';
import CircleButton from '@components/CircleButton';
import { popRoute, pushNewRoute } from '@actions/route';
import { setHomeTab, setPreRoute, setSpinnerVisible } from '@actions/globals';
import { setRenderProduct, setProduct, setMyFavourite } from '@actions/product';
import { Styles, Fonts, Global, Colors, Metrics } from '@theme/';
import RTM from '@src/rtm';

import styles from './styles';
import Constants from '@src/constants';
// import Utils from '@src/utils';
class ViewProduct extends Component {
  constructor(props) {
    super(props);
    var adUnitID = '';
    if(Platform.OS === 'android')
    {
      adUnitID = Global.AD_UNIT_ID_ANDROID;
    } else if (Platform.OS == 'ios')
    {
      adUnitID = Global.AD_UNIT_ID_IOS;
    }
    this.state = {
      dialogVisible: false,
      shareVisible: false,
      renderUserProducts: [],
      adUnitID: adUnitID
    };
  }
  componentWillMount() {
    const renderUserProducts = [];
    const productProps = this.props.products;
    for (let i = 0; i < productProps.productInfo.length; i += 1) {
      if (this.props.products.renderProductInfo.id !== productProps.productInfo[i].id &&
        this.props.products.renderProductInfo.user_id === productProps.productInfo[i].user_id) {
        renderUserProducts.push(productProps.productInfo[i]);
      }
    }
    this.setState({ renderUserProducts });
  }
  componentDidMount() {
    AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
    AdMobRewarded.addEventListener('rewardedVideoDidRewardUser',
      (type, amount) => console.log('rewardedVideoDidRewardUser', type, amount));
    AdMobRewarded.addEventListener('rewardedVideoDidLoad', () => console.log('rewardedVideoDidLoad'));
    AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', (error) => console.log('rewardedVideoDidFailToLoad', error));
    AdMobRewarded.addEventListener('rewardedVideoDidOpen', () => console.log('rewardedVideoDidOpen'));
    AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
      console.log('rewardedVideoDidClose');
      AdMobRewarded.requestAd((error) => error && console.log(error));
    });
    AdMobRewarded.addEventListener('rewardedVideoWillLeaveApplication', () => console.log('rewardedVideoWillLeaveApplication'));
    AdMobRewarded.requestAd((error) => error && console.log(error));
  }
  componentWillUnmount() {
    AdMobRewarded.removeAllListeners();
  }
  onRenderProduct(item) {
    const renderUserProducts = [];
    for (let i = 0; i < this.props.products.productInfo.length; i += 1) {
      if (item.id !== this.props.products.productInfo[i].id &&
        item.user_id === this.props.products.productInfo[i].user_id) {
        renderUserProducts.push(this.props.products.productInfo[i]);
      }
    }
    this.setState({ renderUserProducts });
    this.props.setRenderProduct(item);
    this.ScrollView.scrollTo({ y: 0, animated: true });
  }
  onAddFavourite() {
    this.setState({ dialogVisible: true });
  }
  onShare() {
    this.setState({ shareVisible: true });
  }
  onCancelShare() {
    this.setState({ shareVisible: false });
  }
  onCloseDialog(flag) {
    if (flag) {
      this.addProductToFavourite();
    }
    this.setState({ dialogVisible: false });
  }
  getMyFavourite() {
    this.props.setSpinnerVisible(true);
    fetch(Global.API_URL + '/product/get_myfavourite', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        latitude: this.props.globals.location.latitude,
        longitude: this.props.globals.location.longitude,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then((responseData) => {
      this.spinnerShow(false)
      if (responseData === null) {
        this.props.setMyFavourite([]);
        this.props.popRoute();
      } else {
        this.props.setMyFavourite(responseData);
        this.props.popRoute();
      }
    }).catch((error) => {
      this.spinnerShow(false)
      Utils.toast(error);
    })
    .done();
  }
  // /////////
  gotoChat(userId, productId) {
    this.spinnerShow(true);
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    formdata.append('UserId', userId);
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
      if (responseData.status_code === 200) {
        this.loadChannel(userId, productId);
      } else {
        console.log(responseData.message);
      }
    }).catch((error) => {
      this.spinnerShow(false);
    })
    .done();
  }
  loadChannel(userId, productId) {
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    formdata.append('OtherUserId', userId);
    formdata.append('ProductId', productId);
    fetch(Global.API_URL + '/channel/_get_channel_id', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      this.spinnerShow(true);
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
          } else {
            this.spinnerShow(false);
            return;
          }
          this.props.setPreRoute('viewproduct');
          const productProps = this.props.products.renderProductInfo;
          this.gotoChatDetail(userId, productProps.user_name, productProps.user_image, productProps.id);
        } else {
          Utils.toast(I18n.t('TOAST_BLOCKED_USER'));// 'Blocked with this user');
          this.spinnerShow(false);
        }
      } else {
        this.spinnerShow(false);
      }
    }).catch((error) => {
      this.spinnerShow(false);
    })
    .done();
  }
  gotoChatDetail(userId, userName, userAvatar, productId) {
    this.spinnerShow(false);
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
  // ///////////////////////////////////////////////
  addProductToFavourite() {
    this.spinnerShow(true);
    fetch(Global.API_URL + '/product/set_myfavourite', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        product_id: this.props.products.renderProductInfo.id,
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
        this.spinnerShow(false)
        return;
      }
      const objArray = this.props.products.productInfo;
      const id = this.props.products.renderProductInfo.id;
      const obj = objArray.filter(function(element) {
        return element.id === id;
      });
      if (obj[0].favourite === 1) {
        obj[0].favourite = 0;
        Utils.toast(I18n.t('TOAST_DELETE_FAVOURITE'));
      } else {
        obj[0].favourite = 1;
        Utils.toast(I18n.t('TOAST_ADD_FAVOURITE'));
      }
      let index = -1;
      objArray.find(function(item, i) {
        if (item.id === id) {
          index = i;
        }
      });
      objArray[index] = obj[0];
      this.props.setRenderProduct(obj[0]);
      this.props.setProduct(objArray);
      this.spinnerShow(false)
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  spinnerShow(value) {
    this.props.setSpinnerVisible(value)
  }
  popRoute() {
    // this.setState({ renderUserProducts: [] });
    this.getMyFavourite();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  renderProductImages(data, pageID) {
    return (
      <Image
        source={{ uri: data }}
        resizeMode={'cover'}
        style={{ width: Metrics.screenWidth }}
      />
    );
  }
  renderUserProducts() {
    return (
      this.state.renderUserProducts.map(item => (
        <TouchableOpacity key={item.id} onPress={() => this.onRenderProduct(item)}>
          <Image
            source={{ uri: item.image1 }}
            resizeMode={'cover'}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
        </TouchableOpacity>
      ))
    );
  }
  render() {
    const productProps = this.props.products.renderProductInfo;
    const shareOptions = {
      title: productProps.name,
      message: 'Schau mal was ich bei UXA entdeckt habe: ',
      url: productProps.image1,
      subject: 'Schau mal was ich bei UXA entdeckt habe: ' + productProps.name, //  for email
    };
    const dataSource = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });
    const imgTmpArray = [];
    if (productProps.image1) {
      imgTmpArray.push(productProps.image1);
    }
    if (productProps.image2) {
      imgTmpArray.push(productProps.image2);
    }
    if (productProps.image3) {
      imgTmpArray.push(productProps.image3);
    }
    const modalText = productProps.favourite === 0 ?
      I18n.t('MESSAGE_ADD_FAVORITE')
      :
      I18n.t('MESSAGE_DEL_FAVORITE');
    const imgArray = dataSource.cloneWithPages(imgTmpArray);
    const coordinate = {
      latitude: +productProps.latitude,
      longitude: +productProps.longitude,
    };
    const productImages =
      (<ViewPager
        style={{ width: Metrics.screenWidth }}
        dataSource={imgArray}
        renderPage={this.renderProductImages}
        isLoop={false}
        autoPlay={false}
      />);
    const favButton = (
      <TouchableOpacity style={Styles.topRightButton} onPress={() => this.onAddFavourite()}>
        <Icon
          raised
          style={{ color: Colors.brandPrimary }}
          name={productProps.favourite === 0 ? 'md-heart-outline' : 'md-heart'}
          color={productProps.favourite === 1 ? Colors.brandPrimary : Colors.brandSecondary}
          size={30}
        />
      </TouchableOpacity>);
    const backButton =
      (<TouchableOpacity style={Styles.topLeftButton} onPress={() => this.popRoute()}>
        <Icon
          raised
          name={'ios-arrow-back'}
          type={'font-awesome'}
          color={Colors.brandPrimary}
          size={40}
        />
      </TouchableOpacity>);
    const sendMessageBtn = !this.state.shareVisible ?
      (<TouchableOpacity
        style={[Styles.buttonShadow, styles.msgButton]}
        onPress={() => this.gotoChat(productProps.user_id, productProps.id)}
      >
        <Icon name="ios-text-outline" style={{ fontSize: 30, marginLeft: 0, color: 'white' }} />
        <Text style={[Fonts.style.buttonText, { textAlign: 'center', color: 'white' }]}>{I18n.t('SEND_MESSAGE')}</Text>
        <View />
      </TouchableOpacity>)
      :
      null;
    return (
      <View style={[Styles.fullScreen, { backgroundColor: Colors.backgroundPrimary }]}>
        <ScrollView ref={o => this.ScrollView = o} alwaysBounceVertical={false}>
          <View style={{ height: Metrics.screenHeight * 0.5 + Metrics.circleBtnSize-20 }}>
            <View style={Styles.productViewShadow}>
              {productImages}
            </View>
            <CircleButton
              icon={'md-person'}
              image={productProps.user_image}
              title={productProps.user_name}
              radius={Metrics.circleBtnSize}
              style={styles.chatButton}
              titleStyle={styles.titleTextStyle}
              hasBorder={false}
              backColor={Colors.brandPrimary}
              color={Colors.brandSecondary}
              onPress={() => this.gotoChat(productProps.user_id, productProps.id)}
            />
            {backButton}
            {favButton}
          </View>
          <View style={{ paddingHorizontal: 30 }}>
            <Text style={[Fonts.style.titleText, { color: Colors.textSecondary }]}>
              {productProps.name}
            </Text>
            <View style={styles.productInfo}>
              <View style={[styles.iconTextContainer, { justifyContent: 'flex-start' }]}>
                <Icon name="ios-pin" size={17} color={Colors.textDisabled} />
                <Text style={styles.iconText}>
                  {Math.round(productProps.distance * 10) / 10}{I18n.t('KM')}
                </Text>
              </View>
              <View style={[styles.iconTextContainer, { justifyContent: 'center' }]}>
                <Icon name="ios-funnel" size={17} color={Colors.textDisabled} />
                <Text style={styles.iconText}>
                  {Constants.CATEGORIES[productProps.category].label}
                </Text>
              </View>
              <View style={[styles.iconTextContainer, { justifyContent: 'flex-end' }]}>
                <Icon name="md-time" size={17} color={Colors.textDisabled} />
                <Text style={styles.iconText}>
                  {productProps.expiary_date}
                </Text>
              </View>
            </View>
            <Text
              style={[Fonts.style.description, { color: Colors.textSecondary, marginVertical: 10 }]}
              numberOfLines={5}
            >
              {productProps.description}
            </Text>
            <View style={[styles.productInfo, { justifyContent: 'space-between' }]}>
              <TouchableOpacity
                style={[styles.iconTextContainer, { justifyContent: 'flex-start' }]}
                onPress={() => this.onShare()}
              >
                <Icon name="md-share" size={17} color={Colors.textDisabled} />
                <Text style={styles.iconText}>
                  {I18n.t('SHARE_THIS_FEED')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconTextContainer, { justifyContent: 'flex-end' }]}
                onPress={() => Communications.email(['foodsaver@uxa-app.com'], null, null, 'UXA REPORT', null)}
              >
                <Icon name="ios-warning" size={17} color={Colors.textDisabled} />
                <Text style={styles.iconText}>
                  {I18n.t('REPORT')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={MapView.PROVIDER_GOOGLE}
              initialRegion={{
                latitude: +productProps.latitude,
                longitude: +productProps.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              region={{
                latitude: +productProps.latitude,
                longitude: +productProps.longitude,
                latitudeDelta: 0.00522,
                longitudeDelta: (0.00522 * Metrics.screenWidth) / Metrics.screenHeight,
              }}
            >
              {/* <MapView.Marker
                coordinate={{
                  latitude: +productProps.latitude,
                  longitude: +productProps.longitude,
                }}
                title={productProps.name}
                description={productProps.description}
              />*/}
              <MapView.Circle
                center={coordinate}
                radius={100}
                strokeColor={'transparent'}
                fillColor={'rgba(119, 238, 117, 0.6)'}
              />
            </MapView>
          </View>
          <View style={styles.otherProductsContainer}>
            <Text style={{ fontFamily: Fonts.type.bold, color: Colors.textSecondary }}>
              {I18n.t('OTHER_PRODUCTS')}
            </Text>
            <ScrollView
              style={{ flexDirection: 'row', paddingVertical: 10 }}
              horizontal
            >
              {this.renderUserProducts()}
            </ScrollView>
          </View>
          <AdMobBanner
            style={{ marginLeft: (Metrics.screenWidth - 320) / 2 }}
            bannerSize={'banner'}
            testDeviceID="EMULATOR"
            adUnitID={this.state.adUnitID}
          />
          <View style={{ height: Platform.OS === 'ios' ? 150 : 80, width: Metrics.screenWidth }} />
        </ScrollView>
        {sendMessageBtn}
        <Modal visible={this.state.dialogVisible}>
          <View style={styles.modal}>
            <View style={{ height: 10 }} />
            <Text style={{ fontFamily: Fonts.type.bold }}>{modalText}</Text>
            <View style={{ height: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Metrics.screenWidth * 0.4 }}>
              <TouchableOpacity
                style={[Styles.modalBtn, Styles.center, { backgroundColor: Colors.brandPrimary }]}
                onPress={() => this.onCloseDialog(true)}
              >
                <Text style={{ fontFamily: Fonts.type.bold, color: 'white' }}>{I18n.t('YES')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.modalBtn, Styles.center, { backgroundColor: Colors.textDisabled }]}
                onPress={() => this.onCloseDialog(false)}
              >
                <Text style={{ fontFamily: Fonts.type.bold, color: 'white' }}>{I18n.t('NO')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Spinner visible={this.props.globals.spinnerVisible} />
        <ShareSheet visible={this.state.shareVisible} onCancel={this.onCancelShare.bind(this)}>
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
                if (typeof shareOptions["url"] !== undefined) {
                  Clipboard.setString('www.uxa-app.com');
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
    setRenderProduct: renderProduct => dispatch(setRenderProduct(renderProduct)),
    setProduct: productInfo => dispatch(setProduct(productInfo)),
    setHomeTab: homeTab => dispatch(setHomeTab(homeTab)),
    setPreRoute: route => dispatch(setPreRoute(route)),
    setMyFavourite: myOffers => dispatch(setMyFavourite(myOffers)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const products = state.get('productinfo');
  const logins = state.get('login');
  const globals = state.get('globals');
  return { products, logins, globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewProduct);
