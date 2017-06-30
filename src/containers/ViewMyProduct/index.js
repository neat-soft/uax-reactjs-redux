import React, { Component } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView, Clipboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewPager from 'react-native-viewpager';
import MapView from 'react-native-maps';
import Share, { ShareSheet, Button } from 'react-native-share';
import Spinner from '@components/OverlaySpinner';

import CircleButton from '@components/CircleButton';
import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { setHomeTab, setMyAppTab, setPreRoute, setSpinnerVisible } from '@actions/globals';
import { setMyOffer, setProduct } from '@actions/product'
import { Styles, Fonts, Colors, Metrics, Global } from '@theme/';
import Utils from '@src/utils';

import styles from './styles';
import Constants from '@src/constants';

class ViewMyProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareVisible: false,
    };
  }
  onBackToFavourite() {
    Global.OfferImages = [];
    this.props.setHomeTab('myapp');
    this.props.setMyAppTab('myoffers');
    this.popRoute();
  }
  onShare() {
    this.setState({ shareVisible: true });
  }
  onCancelShare() {
    this.setState({ shareVisible: false });
  }
  getFilteredProducts() {
    // this.props.setSpinnerVisible(true)
    // fetch(Global.API_URL + '/product/get_products_filter', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    //   body: JSON.stringify({
    //     token: this.props.logins.token,
    //     distance: this.props.globals.distance,
    //     latitude: this.props.globals.location.latitude,
    //     longitude: this.props.globals.location.longitude,
    //     date_range: this.props.globals.filterValue.date_range,
    //     expire_sort: this.props.globals.filterValue.expire_sort,
    //     category: this.props.globals.filterValue.category,
    //   }),
    // })
    // .then((response) => {
    //   if (!response.ok) {
    //     return null;
    //   }
    //   return response.json();
    // })
    // .then((responseData) => {
    //   this.props.globals.spinnerVisible(false)
    //   if (responseData === null) {
    //     this.props.setProduct([]);
    //   } else {
    //     this.props.setProduct(responseData);
    //   }
    //   this.props.popRoute();
    // }).catch((error) => {
    //   console.log(error);
    // })
    // .done();
    this.props.popRoute();
  }
  getMyOffer() {
    this.spinnerShow(true);
    fetch(Global.API_URL + '/product/get_myoffer', {
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
      this.spinnerShow(false);
      if (responseData === null) {
        this.props.setMyOffer([]);
        return;
      }
      this.props.setMyOffer(responseData);
      this.props.popRoute();
    }).catch((error) => {
      this.spinnerShow(false);
      Utils.toast(error);
    })
    .done();
  }
  spinnerShow(value) {
    this.props.setSpinnerVisible(value);
  }
  gotoEdit() {
    this.props.setPreRoute('viewproduct');
    this.props.replaceRoute('startoffer');
  }
  popRoute() {
    if (this.props.globals.homeTab === 'discover') {
      this.props.setHomeTab('discover');
      this.getFilteredProducts();
    } else {
      this.getMyOffer();
    }
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
    // TODO : Get products from user : from user id in product struct
    return (
      Constants.IMG_ARRAY1.map(item => (
        <TouchableOpacity key={item.id} onPress={() => alert(item.id)}>
          <Image
            source={{ uri: item.image }}
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
    Global.OfferImages = imgTmpArray;
    const imgArray = dataSource.cloneWithPages(imgTmpArray);
    // TODO : if no product images then <View style={{height:theme.devheight / 2}} />
    const productImages =
      (<ViewPager
        style={{ width: Metrics.screenWidth }}
        dataSource={imgArray}
        renderPage={this.renderProductImages}
        isLoop={false}
        autoPlay={false}
      />);
    const backButton =
      (<TouchableOpacity style={Styles.topLeftButton} onPress={() => this.onBackToFavourite()}>
        <Icon
          raised
          name={'ios-arrow-back'}
          type={'font-awesome'}
          color={Colors.brandPrimary}
          size={40}
        />
      </TouchableOpacity>);
    const coordinate = {
      latitude: +productProps.latitude,
      longitude: +productProps.longitude,
    };
    return (
      <View style={[Styles.fullScreen, { backgroundColor: Colors.backgroundPrimary }]}>
        <ScrollView alwaysBounceVertical={false}>
          <View style={{ height: Metrics.screenHeight * 0.5 + Metrics.circleBtnSize-20 }}>
            <View style={Styles.productViewShadow}>
              {productImages}
            </View>
            <CircleButton
              title={''}
              icon={'md-create'}
              radius={Metrics.circleBtnSize}
              style={styles.chatButton}
              titleStyle={styles.titleTextStyle}
              hasBorder={false}
              backColor={Colors.brandPrimary}
              color={Colors.brandSecondary}
              onPress={() => this.gotoEdit()}
            />
            {backButton}
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
          <View style={{ height: 20 }} />
        </ScrollView>
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
                  Clipboard.setString("www.uxa-app.com");
                  if (Platform.OS === 'android') {
                    Utils.toast(I18n.t('LINK_COPIED'));
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
ViewMyProduct.propTypes = {

};
ViewMyProduct.defaultProps = {

};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    setHomeTab: tab => dispatch(setHomeTab(tab)),
    setMyAppTab: tab => dispatch(setMyAppTab(tab)),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    replaceRoute: route => dispatch(replaceRoute(route)),
    setProduct: productInfo => dispatch(setProduct(productInfo)),
    setPreRoute: route => dispatch(setPreRoute(route)),
    setMyOffer: myOffers => dispatch(setMyOffer(myOffers)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const products = state.get('productinfo');
  const logins = state.get('login');
  const globals = state.get('globals');
  return { products, logins, globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewMyProduct);
