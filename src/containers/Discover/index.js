import React, { Component } from 'react';
import { Text, ListView, View, TouchableOpacity, RefreshControl, NetInfo, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Permissions from 'react-native-permissions'

import { popRoute, pushNewRoute } from '@actions/route';
import { setRenderProduct, setProduct } from '@actions/product';
import { setDistance, productFilterValue, showShareView, setSpinnerVisible } from '@actions/globals';
import { filterAttempt } from '@actions/filter';
import { Styles, Fonts, Global, Colors, Metrics } from '@theme/';
import Spinner from '@components/OverlaySpinner';
import ProductItemBig from '@components/ProductItemBig';
import Utils from '@src/utils';
import styles from './styles';
import Constants from '@src/constants';

const Slider = require('@components/Slider');

const None = Platform.OS === 'ios' ? 'none' : 'NONE';

let isLoading = false;
const PAGE_ITEM_CNT = 4;
class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: 50,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isLoading: false,

      isRefreshing: false,
      curPageIndex: 0,
      curPageItems: {
        items: [],
        hasNextPage: false,
      },
    };
    this.connectionInfo = null;
    this.setLocation = this.setLocation.bind(this);
    this.attemptFilter = this.attemptFilter.bind(this);
    this.getFilteredProducts = this.getFilteredProducts.bind(this);
  }
  componentWillMount() {
    if (this.props.globals.location !== null && this.props.globals.homeTab === 'discover') {
      this.props.setSpinnerVisible(true);
      this.setLocation(this.props.globals.location);
    } else {
      Utils.toast(I18n.t('TOAST_LOCATION_UNDEFINED'));
    }
  }
  componentDidMount() {
    NetInfo.addEventListener('change', this.handleConnectionInfoChange.bind(this));
    NetInfo.fetch().done(
      (connectionInfo) => {
        this.connectionInfo = connectionInfo;
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.globals.homeTab === 'discover' && isLoading === false && nextProps.globals.location !== null) {
      this.props.setSpinnerVisible(true);
      this.setLocation(nextProps.globals.location);
    } else {
      const tmpPageItems =
        this.getCurPageItems(this.state.curPageIndex, nextProps.products.productInfo);
      this.setState({
        curPageItems: tmpPageItems,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }
  }
  onSlidingComplete() {
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    if (!this.props.globals.location) {
      Utils.toast(I18n.t('TOAST_LOCATION_UNDEFINED'));
      return;
    }
    this.props.setSpinnerVisible(true);
    this.props.setDistance(this.state.distance);
    this.getFilteredProducts(this.props.globals.filterValue);
  }
  onShowShare() {
    this.props.showShareView(true);
  }
  setLocation(location) {
    isLoading = true;
    fetch(Global.API_URL + '/auth/set_location', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      this.attemptFilter();
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      console.log('---discover error 1-----', error);
    })
    .done();
  }
  getFilteredProducts(filterValue) {
    fetch(Global.API_URL + '/product/get_products_filter', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        distance: this.state.distance,
        latitude: this.props.globals.location.latitude,
        longitude: this.props.globals.location.longitude,
        date_range: filterValue.date_range,
        expire_sort: filterValue.expire_sort,
        category: filterValue.category,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      if (responseData === null) {
        this.props.setProduct([]);
        return;
      }
      this.props.setProduct(responseData);
      // const tmpPageItems =
      //   this.getCurPageItems(this.state.curPageIndex, responseData);
      // this.setState({
      //   curPageItems: tmpPageItems,
      //   dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }).catch((error) => {
      console.log('---discover error 2-----', error);
    })
    .done();
  }
  getCurPageItems(pageIndex, datas) {
    let tItems;
    if (datas.length > 0) {
      tItems = datas.slice(0, (pageIndex + 1) * PAGE_ITEM_CNT);
    } else {
      tItems = [];
    }
    const tHasNextPage = datas.length > (pageIndex + 1) * PAGE_ITEM_CNT ? true : false;
    const tmpPageItems = { items: tItems, hasNextPage: tHasNextPage };
    return tmpPageItems;
  }
  spinnerShow(value) {
    this.props.setSpinnerVisible(value);
  }
  attemptFilter() {
    fetch(Global.API_URL + '/product/get_myfilter', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.filter === null) {
        this.getFilteredProducts(this.props.globals.filterValue);
      } else {
        this.getFilteredProducts(responseData.filter);
        this.props.productFilterValue(responseData.filter);
      }
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      console.log('---discover error 3-----', error);
    })
    .done();
  }
  handleEndReached() {
    if (!this.state.isLoading && this.state.curPageItems.hasNextPage) {
      this.setState({ isLoading: true });
      const tmpPageItems = this.getCurPageItems(this.state.curPageIndex + 1, this.props.products.productInfo);
      this.setState({
        curPageIndex: this.state.curPageIndex + 1,
        isLoading: false,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }
  }
  handleRefresh() {
    if (!this.state.isRefreshing) {
      this.setState({ isRefreshing: true });
      const tmpPageItems = this.getCurPageItems(0, this.props.products.productInfo);
      this.setState({
        curPageIndex: 0,
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }
  }
  popRoute() {
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  gotoTakeItemPhoto() {
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    this.pushNewRoute('takeitemphoto');
  }
  gotoSearch() {
    if (this.props.globals.locationPermission === 'denied') {
      this.alertForPermission();
    }
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    if (this.props.globals.location === null) {
      this.props.setCurLocation();
      return;
    }
    this.pushNewRoute('search');
  }
  gotoFilter() {
    if (this.props.globals.locationPermission === 'denied') {
      this.alertForPermission();
    }
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    if (this.props.globals.location === null) {
      this.props.setCurLocation();
      return;
    }
    this.pushNewRoute('filter');
  }
  alertForPermission() {
    Alert.alert(
      I18n.t('WHERE_ARE_YOU'),
      I18n.t('LOCATION_PEMISSION_MESSAGE'),
      [
        { text: I18n.t('OPEN_SETTING'), onPress: Permissions.openSettings },
      ]);
  }
  gotoProductView(item) {
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    this.props.setRenderProduct(item);
    if (item.user_id !== this.props.globals.user.user.id) {
      this.pushNewRoute('viewproduct');
    } else {
      this.pushNewRoute('viewmyproduct');
    }
  }
  handleConnectionInfoChange(connectionInfo) {
    this.connectionInfo = connectionInfo;
  }
  renderHeader(category) {
    return (
      <View>
        <TouchableOpacity onPress={() => this.onShowShare()}>
          <Text
            style={{
              textAlign: 'center',
              color: Colors.textSecondary,
              fontFamily: Fonts.type.bold,
              fontSize: Fonts.size.regular,
              marginBottom: -5,
            }}
          >
            {I18n.t('APP_NAME')}
          </Text>
        </TouchableOpacity>
        <Text
          style={{ color: Colors.textDisabled,
            fontFamily: Fonts.type.bold,
            fontSize: Fonts.size.small }}
        >
          {category}
        </Text>
      </View>
    );
  }

  renderRow(item) {
    return (
      <ProductItemBig
        navigator={this.props.navigator}
        spinnerShow={value => this.spinnerShow(value)}
        product={item}
        userId={this.props.globals.user.user.id}
        token={this.props.logins.token}
        onPress={() => this.gotoProductView(item)}
      />
    );
  }
  render() {
    // let categoryName = '';
    // if (this.props.products.productInfo[0]) {
    const categoryName = Constants.CATEGORIES[this.props.globals.filterValue.category].label;
    // }
    const navBtnSearch = (
      <TouchableOpacity
        onPress={() => this.gotoSearch()}
        style={Styles.iconStyle}
      >
        <Icon name="ios-search" size={24} color={Colors.brandPrimary} />
      </TouchableOpacity>
    );
    const navBtnFilter = (
      <TouchableOpacity
        onPress={() => this.gotoFilter()}
        style={Styles.iconStyle}
      >
        <Icon name="ios-funnel" size={22} color={Colors.brandPrimary} />
      </TouchableOpacity>
    );
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationBar
          style={Styles.navigationbar}
          title={this.renderHeader(categoryName)}
          leftButton={navBtnSearch}
          rightButton={navBtnFilter}
          tintColor={Colors.brandSecondary}
        />
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={{ flex: 1 }}>
            <View style={styles.sliderLabelContainer}>
              <Text
                style={[Fonts.style.description,
                  { color: Colors.textSecondary, fontFamily: Fonts.type.emphasis }]}
              >
                {I18n.t('DISTANCE')}
              </Text>
              <Text style={[Fonts.style.description, { color: Colors.textDisabled }]}>
                {this.state.distance} {I18n.t('KM')}
              </Text>
            </View>
            <View style={[Styles.center, { flex: 2 }]}>
              <Slider
                style={{ width: Metrics.screenWidth * 0.95 }}
                trackStyle={Styles.sliderTrack}
                thumbStyle={Styles.sliderScrollThumb}
                minimumTrackTintColor={Colors.brandPrimary}
                minimumValue={1}
                maximumValue={50}
                value={this.state.distance}
                step={1}
                onValueChange={distance => this.setState({ distance })}
                onSlidingComplete={() => this.onSlidingComplete()}
              />
            </View>
          </View>
          <View style={{ flex: 7, backgroundColor: Colors.backgroundPrimary }}>
            { this.state.dataSource._cachedRowCount > 0 ?
              (<ListView
                style={{ flex: 1 }}
                key={this.props.products.productInfo.image1}
                removeClippedSubviews={false}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                onEndReached={this.handleEndReached.bind(this)}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    title="Loading..."
                  />
                }
                pageSize={2}
                contentContainerStyle={styles.listContainer}
                onEndReachedThreshold={10}
                onScroll={this.props.onScroll}
              />)
              :
              (<Text style={Styles.emptyText}>
                {I18n.t('DATA_EMPTY_PRODUCT')}
              </Text>)
            }
          </View>
        </View>
        <Spinner visible={this.props.globals.spinnerVisible} />
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setDistance: distance => dispatch(setDistance(distance)),
    setRenderProduct: renderProduct => dispatch(setRenderProduct(renderProduct)),
    setProduct: productInfo => dispatch(setProduct(productInfo)),
    filterAttempt: token => dispatch(filterAttempt(token)),
    productFilterValue: filterValue => dispatch(productFilterValue(filterValue)),
    showShareView: share => dispatch(showShareView(share)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const products = state.get('productinfo');
  const globals = state.get('globals');
  const logins = state.get('login');
  const filter = state.get('filter');
  const route = state.get('route');
  return { products, globals, logins, filter, route };
}
export default connect(mapStateToProps, mapDispatchToProps)(Discover);
