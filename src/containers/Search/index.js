import React, { Component } from 'react';
import { View, ListView, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { Button, SearchBar } from 'react-native-elements';
import I18n from 'react-native-i18n';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from '@components/OverlaySpinner';
import { setSearchProduct, setRenderProduct } from '@actions/product';
import { popRoute, pushNewRoute } from '@actions/route';
import { setHomeTab, setMyAppTab, setUser, setSpinnerVisible } from '@actions/globals';
import ProductItemBig from '@components/ProductItemBig';
import { Styles, Fonts, Colors, Metrics, Global } from '@theme/';
import styles from './styles';
import Utils from '@src/utils';

const Slider = require('@components/Slider');

const PAGE_ITEM_CNT = 4;
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      searchDistance: 50,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isRefreshing: false,
      curPageIndex: 0,
      curPageItems: {
        items: [],
        hasNextPage: false,
      },
      showSearchButton: false,
    };
  }
  componentWillMount() {
    this.spinnerShow(true);
    this.getSearchedProduct('');
  }
  // componentWillReceiveProps(nextProps) {
  //   const tmpPageItems =
  //     this.getCurPageItems(this.state.curPageIndex, nextProps.products.productInfo);
  //   this.setState({
  //     curPageItems: tmpPageItems,
  //     dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
  // }
  onAddSearchAgent() {
    this.spinnerShow(true);
    const userProps = this.props.globals.user.user;
    if (this.state.searchKeyword === '') {
      this.spinnerShow(false);
      return;
    }
    if (userProps.search_agent1 === this.state.searchKeyword ||
      userProps.search_agent2 === this.state.searchKeyword ||
      userProps.search_agent3 === this.state.searchKeyword) {
      this.spinnerShow(false);
      Utils.toast(I18n.t('ALREADY_EXIST_AGENT'));
    }
    if (userProps.search_agent1 === '') {
      this.setAgentToUser(this.state.searchKeyword, '', '');
    } else if (userProps.search_agent2 === '') {
      this.setAgentToUser('', this.state.searchKeyword, '');
    } else if (userProps.search_agent3 === '') {
      this.setAgentToUser('', '', this.state.searchKeyword);
    } else {
      Utils.toast(I18n.t('FULL_SEARCH_AGENT'));
      this.props.setHomeTab('myapp');
      this.props.setMyAppTab('profile');
      this.props.popRoute();
      this.spinnerShow(false);
    }
  }
  onSlidingComplete() {
    this.getSearchedProduct(this.state.searchKeyword);
  }
  onSearchTextChange(text) {
    if (text === '') {
      this.getSearchedProduct('nil');
      this.setState({ showSearchButton: false, searchKeyword: text });
    } else {
      this.setState({ showSearchButton: true, searchKeyword: text });
    }
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
  setAgentToUser(strAgent1, strAgent2, strAgent3) {
    fetch(Global.API_URL + '/auth/set_user', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        search_agent1: strAgent1,
        search_agent2: strAgent2,
        search_agent3: strAgent3,
      }),
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.spinnerShow(false);
      this.setState({ searchKeyword: '' });
      this.props.setUser(responseData);
      Utils.toast(I18n.t('AGENT_REGISTERED'));
    }).catch((error) => {
      console.log(error);
      this.spinnerShow(false);
    })
    .done();
  }
  getSearchedProduct(agent) {
    this.spinnerShow(true);
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    formdata.append('distance', this.state.searchDistance);
    formdata.append('latitude', this.props.globals.location.latitude);
    formdata.append('longitude', this.props.globals.location.longitude);
    formdata.append('agent', agent);
    fetch(Global.API_URL + '/product/get_products_agent', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
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
        this.props.setSearchProduct([]);
        return;
      }
      this.props.setSearchProduct(responseData);
      const tmpPageItems =
        this.getCurPageItems(this.state.curPageIndex, responseData);
      this.setState({
        curPageItems: tmpPageItems,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
      // this.ListView.scrollTo({ y: 5, animated: true });
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  spinnerShow(value) {
    this.props.setSpinnerVisible(value);
  }
  handleEndReached() {
    if (!this.state.isLoading && this.state.curPageItems.hasNextPage) {
      this.setState({ isLoading: true });
      const tmpPageItems =
        this.getCurPageItems(this.state.curPageIndex + 1, this.props.products.searchProductInfo);
      this.setState({
        curPageIndex: this.state.curPageIndex + 1,
        isLoading: false,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }
  }
  handleRefresh() {
    if (!this.state.isRefreshing) {
      this.setState({ isRefreshing: true });
      const tmpPageItems = this.getCurPageItems(0, this.props.products.searchProductInfo);
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
  gotoProductView(item) {
    this.props.setRenderProduct(item);
    if (item.user_id !== this.props.globals.user.user.id) {
      this.pushNewRoute('viewproduct');
    } else {
      this.pushNewRoute('viewmyproduct');
    }
  }
  renderHeader(title) {
    return (
      <View style={{ flexDirection: 'column' }}>
        <Text
          style={{ flex: 1,
            textAlign: 'center',
            alignSelf: 'center',
            color: Colors.textSecondary,
            fontFamily: Fonts.type.bold,
            fontSize: Fonts.size.regular,
            marginBottom: 5 }}
        >
          {title}
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
    const searchBtnGo = this.state.showSearchButton ?
      (<TouchableOpacity
        style={[Styles.center, styles.goButtonStyle]}
        onPress={() => this.getSearchedProduct(this.state.searchKeyword)}
      >
        <Text style={{ fontSize: 14, color: 'white', fontFamily: Fonts.type.bold }}>{I18n.t('GO')}</Text>
      </TouchableOpacity>
      ) : null;
    const navBtnBack = (
      <TouchableOpacity
        style={Styles.iconStyle}
        onPress={() => this.popRoute()}
      >
        <Icon name="ios-arrow-back" size={40} color={Colors.brandPrimary} />
      </TouchableOpacity>
    );
    return (
      <View
        style={[Styles.fullScreen, { backgroundColor: 'white' }]}
      >
        <NavigationBar
          style={Styles.navigationbar}
          title={this.renderHeader(I18n.t('SEARCH'))}
          leftButton={navBtnBack}
          tintColor={Colors.brandSecondary}
        />
        <View style={{ flex: 1 }}>
          <View style={[Styles.center, { flexDirection: 'row' }]}>
            <SearchBar
              lightTheme
              onChangeText={text => this.onSearchTextChange(text)}
              placeholder={I18n.t('TYPE_HERE')}
              containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
              inputStyle={{ backgroundColor: Colors.backgroundPrimary }}
              value={this.state.searchKeyword}
            />
            {searchBtnGo}
          </View>
          <View style={{ flex: 2.5, backgroundColor: Colors.brandSecondary }}>
            <View style={styles.sliderLabelContainer}>
              <Text style={[Fonts.style.description, { color: Colors.textSecondary }]}>
                {I18n.t('DISTANCE')}
              </Text>
              <Text style={[Fonts.style.description, { color: Colors.textDisabled }]}>
                {this.state.searchDistance} {I18n.t('KM')}
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
                value={this.state.searchDistance}
                step={1}
                onValueChange={searchDistance => this.setState({ searchDistance })}
                onSlidingComplete={() => this.onSlidingComplete()}
              />
            </View>
            <Button
              title={I18n.t('ACTIVATE_SEARCH_AGENT')}
              buttonStyle={[Styles.buttonShadow, styles.buttonStyle]}
              textStyle={Fonts.style.buttonText}
              onPress={() => this.onAddSearchAgent()}
            />
          </View>
          <View backgroundColor={Colors.backgroundPrimary} style={{ flex: 6.5 }} >
            { this.props.products.searchProductInfo.length > 0 ?
              (<ListView
                ref={o => this.ListView = o}
                style={{ flex: 1 }}
                removeClippedSubviews={false}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                onEndReached={this.handleEndReached.bind(this)}
                pageSize={2}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    title="Loading..."
                  />
                }
                enableEmptySections
                contentContainerStyle={styles.listContainer}
                onEndReachedThreshold={10}
              />)
              :
              (<Text style={{ marginTop: 10, alignSelf: 'center', fontFamily: Fonts.type.bold, color: Colors.textSecondary }}>
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

Search.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  pushNewRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setSearchProduct: searchProductInfo => dispatch(setSearchProduct(searchProductInfo)),
    setHomeTab: homeTab => dispatch(setHomeTab(homeTab)),
    setMyAppTab: appTab => dispatch(setMyAppTab(appTab)),
    setUser: user => dispatch(setUser(user)),
    setRenderProduct: renderProduct => dispatch(setRenderProduct(renderProduct)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const products = state.get('productinfo');
  const logins = state.get('login');
  return { globals, products, logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
