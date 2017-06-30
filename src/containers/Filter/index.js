/* Splash Screen */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import I18n from 'react-native-i18n';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from '@components/OverlaySpinner';
import Switch from '@components/Switch';

import ActionSheet from '@components/ActionSheet/';
// import Switch from '@components/Switch';
import { popRoute, pushNewRoute } from '@actions/route';
import { productFilterValue, setSpinnerVisible } from '@actions/globals';
import { setProduct } from '@actions/product';
import { Styles, Fonts, Colors, Metrics, Global } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';
import Constants from '@src/constants';

const Slider = require('@components/Slider');

let categoryInfo = [];
class Filter extends Component {
  constructor(props) {
    super(props);
    const tmp = Utils.clone(Constants.CATEGORIES);
    tmp.push({ key: tmp.length, label: I18n.t('CANCEL') });
    categoryInfo = tmp;
  }
  componentWillMount() {
    this.setState({
      lastDays: this.props.globals.filterValue.date_range,
      sortByExpiaryDate: this.props.globals.filterValue.expire_sort === 1 ? true : false,
      filterCategory: this.props.globals.filterValue.category,
    });
  }
  onActionSheetMenu(index) {
    this.setState({ filterCategory: index });
  }
  showActionSheetMenu() {
    this.ActionSheet.show();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  resetFilter() {
    this.setState({
      lastDays: this.props.globals.filterValue.date_range,
      filterCategory: this.props.globals.filterValue.category,
      sortByExpiaryDate: this.props.globals.filterValue.expire_sort === 1 ? true : false,
    });
  }
  applyFilter() {
    const filterValue = {
      date_range: this.state.lastDays,
      expire_sort: this.state.sortByExpiaryDate ? 1 : 0,
      category: this.state.filterCategory,
    };
    this.props.setSpinnerVisible(true);
    this.props.productFilterValue(filterValue);
    this.attemptFilteredProduct();
  }
  attemptFilteredProduct() {
    fetch(Global.API_URL + '/product/get_products_filter', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        distance: this.props.globals.distance,
        latitude: this.props.globals.location.latitude,
        longitude: this.props.globals.location.longitude,
        date_range: this.state.lastDays,
        expire_sort: this.state.sortByExpiaryDate ? 1 : 0,
        category: this.state.filterCategory,
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
        this.props.setProduct({});
      } else {
        this.props.setProduct(responseData);
      }
      this.props.setSpinnerVisible(false);
      this.props.popRoute();
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  popRoute() {
    this.props.popRoute();
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
  render() {
    const navBtnBack = (
      <TouchableOpacity
        style={Styles.iconStyle}
        onPress={() => this.popRoute()}
      >
        <Icon name="ios-arrow-back" size={40} color={Colors.brandPrimary} />
      </TouchableOpacity>
    );
    const categoryId = this.state.filterCategory;
    return (
      <View
        style={[Styles.fullScreen, { backgroundColor: 'white' }]}
      >
        <NavigationBar
          style={Styles.navigationbar}
          title={this.renderHeader(I18n.t('FILTERS'))}
          leftButton={navBtnBack}
          tintColor={Colors.brandSecondary}
        />
        <View style={{ flex: 1, marginTop: 15, backgroundColor: Colors.backgroundPrimary }}>
          <View style={{ flex: 2.5, backgroundColor: Colors.brandSecondary }}>
            <View style={styles.sliderLabelContainer}>
              <Text style={styles.labels}>
                {I18n.t('ENTERED_IN_THE_LAST')}
              </Text>
              <Text style={{ color: Colors.textSecondary }}>
                {this.state.lastDays} {I18n.t('DAYS')}
              </Text>
            </View>
            <View style={[Styles.center, { flex: 2.3, borderBottomWidth: 1, borderBottomColor: Colors.borderSecondary, marginTop: 5 }]}>
              <Slider
                style={{ width: Metrics.screenWidth * 0.93 }}
                trackStyle={Styles.sliderTrack}
                thumbStyle={Styles.sliderScrollThumb}
                minimumTrackTintColor={Colors.brandPrimary}
                minimumValue={1}
                maximumValue={50}
                value={this.state.lastDays}
                step={1}
                onValueChange={lastDays => this.setState({ lastDays })}
              />
            </View>
          </View>

          <View style={{ height: 20 }} />

          <View style={styles.rowContainer}>
            <Text style={styles.labels}>
              {I18n.t('SORT_BY_DATE_EXPIARY')}
            </Text>
            <Switch
              backgroundActive={Colors.brandPrimary}
              onSyncPress={value => this.setState({ sortByExpiaryDate: value })}
              value={this.state.sortByExpiaryDate}
            />
          </View>

          <View style={{ height: 20 }} />

          <TouchableOpacity style={styles.rowContainer} onPress={() => this.showActionSheetMenu()}>
            <View style={{ flex: 8, justifyContent: 'center' }}>
              <Text style={styles.labels}>
                {I18n.t('CATEGORY')}
              </Text>
              <Text style={styles.categoryText}>
                {Constants.CATEGORIES[categoryId].label}
              </Text>
            </View>
            <View style={[Styles.center, { flex: 1 }]}>
              <Icon
                raised
                name={'md-list'}
                type={'font-awesome'}
                color={Colors.textDisabled}
                size={30}
              />
            </View>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
          <Button
            large
            title={I18n.t('APPLY_FILTERS')}
            buttonStyle={[Styles.buttonShadow, {
              width: Metrics.screenWidth * 0.9,
              height: Metrics.screenHeight * 0.08,
              backgroundColor: Colors.brandPrimary,
              borderRadius: 35,
              alignSelf: 'center' }]}
            textStyle={Fonts.style.buttonText}
            onPress={() => this.applyFilter()}
          />
          <View style={{ height: 20 }} />
          <View style={[Styles.center, { flex: 1 }]}>
            <Button
              large
              title={I18n.t('RESET_FILTERS')}
              buttonStyle={{
                width: Metrics.screenWidth * 0.9,
                height: Metrics.screenHeight * 0.08,
                backgroundColor: 'transparent',
                alignSelf: 'center' }}
              textStyle={[Fonts.style.buttonText, { color: Colors.textSecondary }]}
              onPress={() => this.resetFilter()}
            />
          </View>
          <View style={{ flex: 6, backgroundColor: 'transparent' }} />
        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={categoryInfo}
          cancelButtonIndex={categoryInfo.length - 1}
          onPress={this.onActionSheetMenu.bind(this)}
          tintColor={Colors.textSecondary}
        />
        <Spinner visible={this.props.globals.spinnerVisible} />
      </View>
    );
  }
}

Filter.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  pushNewRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setProduct: productInfo => dispatch(setProduct(productInfo)),
    productFilterValue: filterValue => dispatch(productFilterValue(filterValue)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  return { globals, logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(Filter);
