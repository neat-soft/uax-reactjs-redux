import React, { Component } from 'react';
import { ListView, View, Text, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-root-modal';
import { Button } from 'react-native-elements';
import I18n from 'react-native-i18n';

import { popRoute, pushNewRoute } from '@actions/route';
import { setRenderProduct, setMyOffer } from '@actions/product';
import { setSpinnerVisible } from '@actions/globals';
import ProductItem from '@components/ProductItem';
import { Fonts, Colors, Global, Styles } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

const PAGE_ITEM_CNT = 4;
class MyOffers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.id !== row2.id,
      }),
      dialogVisible: false,
      delOfferId: -1,

      isRefreshing: false,
      curPageIndex: 0,
      curPageItems: {
        items: [],
        hasNextPage: false,
      },
    };
  }
  componentWillMount() {
    this.props.setSpinnerVisible(true);
    this.getMyOffer();
  }
  componentWillReceiveProps(nextProps) {
    const tmpPageItems =
      this.getCurPageItems(this.state.curPageIndex, nextProps.products.myOffers);
    this.setState({
      curPageItems: tmpPageItems,
      dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
  }
  onDelete(item) {
    this.setState({ dialogVisible: true, delOfferId: item.id });
  }
  onCloseDialog(flag) {
    if (flag) {
      this.props.setSpinnerVisible(true);
      this.onDeleteMyOffer();
    }
    this.setState({ dialogVisible: false });
  }
  onDeleteMyOffer() {
    fetch(Global.API_URL + '/product/del_myoffer', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        product_id: this.state.delOfferId,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.error) {
        this.props.setSpinnerVisible(false);
        Utils.toast(responseData.error.message);
        return;
      }
      this.getMyOffer();
      Utils.toast(I18n.t('TOAST_DELETE_MYOFFER'));
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      Utils.toast(error);
    })
    .done();
  }
  getMyOffer() {
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
      this.props.setSpinnerVisible(false);
      if (responseData === null) {
        this.props.setMyOffer([]);
        return;
      }
      // const tmpPageItems = this.getCurPageItems(this.state.curPageIndex, responseData);
      // this.setState({
      //   curPageItems: tmpPageItems,
      //   dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
      this.props.setMyOffer(responseData);
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      Utils.toast(error);
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
  handleEndReached() {
    if (!this.state.isLoading && this.state.curPageItems.hasNextPage) {
      this.setState({ isLoading: true });
      const tmpPageItems =
        this.getCurPageItems(this.state.curPageIndex + 1, this.props.products.myOffers);
      this.setState({
        curPageIndex: this.state.curPageIndex + 1,
        isLoading: false,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }
  }
  handleRefresh() {
    if (!this.state.isRefreshing) {
      this.setState({ isRefreshing: true });
      const tmpPageItems = this.getCurPageItems(0, this.props.products.myOffers);
      this.setState({
        curPageIndex: 0,
        isRefreshing: false,
        dataSource: this.state.dataSource.cloneWithRows(tmpPageItems.items) });
    }
  }
  gotoMyProductView(item) {
    this.props.setRenderProduct(item);
    this.pushNewRoute('viewmyproduct');
  }
  popRoute() {
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  renderRow(item) {
    return (
      <ProductItem
        product={item}
        onPress={() => this.gotoMyProductView(item)}
        onDelete={() => this.onDelete(item)}
      />
    );
  }
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginTop: 20 }}>
        { this.state.dataSource._cachedRowCount > 0 ?
          (<ListView
            style={{ flex: 1, backgroundColor: 'white' }}
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
            contentContainerStyle={styles.favoriteContainer}
            onEndReachedThreshold={10}
          />)
          :
          (<Text style={Styles.emptyText}>
            {I18n.t('DATA_EMPTY_OFFER')}
          </Text>)
        }
        <View style={{ height: 80 }} />
        <Modal visible={this.state.dialogVisible}>
          <View style={styles.modal}>
            <View style={{ height: 10 }} />
            <Text style={{ fontFamily: Fonts.type.bold }}>{I18n.t('MESSAGE_DEL_PRODUCT')}</Text>
            <View style={{ height: 20 }} />
            <View style={{ flexDirection: 'row' }}>
              <Button
                title={I18n.t('YES')}
                fontFamily={Fonts.type.bold}
                buttonStyle={{ borderRadius: 6, height: 30, backgroundColor: Colors.brandPrimary }}
                onPress={() => this.onCloseDialog(true)}
              />
              <Button
                title={I18n.t('NO')}
                fontFamily={Fonts.type.bold}
                buttonStyle={{ borderRadius: 6, height: 30 }}
                onPress={() => this.onCloseDialog(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
MyOffers.propTypes = {

};
MyOffers.defaultProps = {

};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setMyOffer: myOffers => dispatch(setMyOffer(myOffers)),
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
export default connect(mapStateToProps, mapDispatchToProps)(MyOffers);
