import React, { Component } from 'react';
import { Text, Image, View, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, FormInput } from 'react-native-elements';
import ViewPager from 'react-native-viewpager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-simple-modal';
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';
import ActionSheet from '@components/ActionSheet/';
import Spinner from '@components/OverlaySpinner';
import CircleButton from '@components/CircleButton';
import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { setHomeTab, setSpinnerVisible } from '@actions/globals';
import { setMyOffer, setRenderProduct, setProduct } from '@actions/product';
import { Styles, Fonts, Colors, Metrics, Global } from '@theme/';

import styles from './styles';
import Constants from '@src/constants';
import Utils from '@src/utils';

let categoryInfo = [];
let flag = [];
class StartOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      description: '',
      expiaryDate: new Date(),
      productCategory: 0,
      calendarVisible: false,
      curDate: new Date(),
      slideImageNo: 0,
      slideImages: [],
    };
    const tmp = Utils.clone(Constants.CATEGORIES);
    tmp.splice(0, 1);
    tmp.push({ key: tmp.length, label: I18n.t('CANCEL') });
    categoryInfo = tmp;
  }
  componentWillMount() {
    const productProps = this.props.products.renderProductInfo;
    if (productProps && this.props.globals.preRoute !== 'home') {
      this.setState({
        productName: productProps.name,
        description: productProps.description,
        expiaryDate: Utils.getDateFromString(productProps.expiary_date),
        productCategory: productProps.category - 1,
        slideImages: Global.OfferImages,
      });
    } else {
      this.setState({
        productName: Global.TMP_NAME,
        description: Global.TMP_DESC,
        expiaryDate: Global.TMP_DATE === '' ? new Date() : Global.TMP_DATE,
        productCategory: +Global.TMP_CATEGORY,
        slideImages: Global.OfferImages,
      });
    }
  }
  onChangeViewPage(pageNo) {
    this.setState({ slideImageNo: pageNo });
  }
  onDeleteImage() {
    // if (Global.OfferImages[this.state.slideImageNo].includes('https')) {
      // Global.DeletedImages.push(Global.OfferImages[this.state.slideImageNo]);
    // }
    // ////////////////////////////////////
    Global.OfferImages.splice(this.state.slideImageNo, 1);
    if (Global.OfferImages.length === 0) {
      Global.TMP_NAME = '';
      Global.TMP_DESC = '';
      Global.TMP_DATE = new Date();
      Global.TMP_CATEGORY = 0;
      this.replaceRoute('takeitemphoto');
    } else {
      this.setState({ slideImages: Global.OfferImages });
    }
    if (Global.OfferImages.length === 1) {
      this.setState({ slideImageNo: 0 });
    }
  }
  // onDeleteImageFromDB(imageNo) {
  //   if (this.props.products.renderProductInfo && this.props.globals.preRoute === 'viewproduct') {
  //     this.props.setSpinnerVisible(true);
  //     fetch(Global.API_URL + '/product/del_image', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({
  //         product_id: this.props.products.renderProductInfo.id,
  //         image_no: imageNo,
  //       }),
  //     })
  //     .then(response => response.json())
  //     .then((responseData) => {
  //       this.props.setSpinnerVisible(false);
  //       if (responseData.state_code === 200) {
  //         console.log(responseData.result);
  //       } else {
  //         console.log(responseData.result);
  //       }
  //     }).catch((error) => {
  //       console.log(error);
  //     })
  //     .done();
  //   }
  // }
  onActionSheetMenu(index) {
    this.setState({ productCategory: index });
  }
  onGetImageNames() {
    this.props.setSpinnerVisible(true);
    fetch(Global.API_URL + '/product/get_images', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        productId: this.props.products.renderProductInfo.id,
      }),
    })
    .then(response => response.json())
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      if (responseData.state_code === 200) {
        this.onCompareImageUrl(responseData.result);
      } else {
        this.onCompareImageUrl([]);
      }
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      console.log(error);
    })
    .done();
  }
  onCompareImageUrl(images) {
    flag = [0, 0, 0];
    for (let i = 0; i < this.state.slideImages.length; i += 1) {
      if (this.state.slideImages[i].includes('https')) {
        for (let j = 0; j < images.length; j += 1) {
          if (this.state.slideImages[i] === images[j]) {
            flag[j] = -1;
            break;
          }
        }
      }
    }
    for (let i = 0; i < this.state.slideImages.length; i += 1) {
      if (!this.state.slideImages[i].includes('https')) {
        let b = false;
        for (let j = 0; j < images.length; j += 1) {
          if (flag[j] === 0 && this.state.slideImages[i] !== '') {
            flag[j] = i + 1;
            b = true;
            break;
          }
        }
        if (b === false) {
          for (let j = 0; j < 3; j += 1) {
            if (flag[j] === 0 && this.state.slideImages[i] !== '') {
              flag[j] = i + 1;
              break;
            }
          }
        }
      }
    }
    this.onStartOffer();
  }
  onStartOffer() {
    Global.TMP_NAME = '';
    Global.TMP_DESC = '';
    Global.TMP_DATE = new Date();
    Global.TMP_CATEGORY = 0;
    if (this.state.productName === '' || this.state.description === '') {
      this.props.setSpinnerVisible(false);
      Utils.toast(I18n.t('ALERT_PRODUCT_INFO_ERROR'));
      return;
    }
    this.props.setSpinnerVisible(true);
    const productProps = this.props.globals;
    const formdata = new FormData();
    let toastMsg = I18n.t('TOAST_ADD_PRODUCT');
    if (this.props.products.renderProductInfo && productProps.preRoute === 'viewproduct') {
      toastMsg = I18n.t('TOAST_UPDATE_PRODUCT');
      formdata.append('product_id', this.props.products.renderProductInfo.id);
    }
    formdata.append('user_id', productProps.user.user.id);
    formdata.append('name', this.state.productName);
    formdata.append('description', this.state.description);
    formdata.append('expiary_date', Utils.getStringFromDate(this.state.expiaryDate));
    formdata.append('category', this.state.productCategory + 1);
    if (flag[0] > 0) {
      formdata.append('image1', { uri: this.state.slideImages[flag[0] - 1], name: 'avatar.jpg', type: 'image/jpg' });
    } else if (flag[0] === 0) {
      formdata.append('image1', 'delete');
    }
    if (flag[1] > 0) {
      formdata.append('image2', { uri: this.state.slideImages[flag[1] - 1], name: 'avatar.jpg', type: 'image/jpg' });
    } else if (flag[1] === 0) {
      formdata.append('image2', 'delete');
    }
    if (flag[2] > 0) {
      formdata.append('image3', { uri: this.state.slideImages[flag[2] - 1], name: 'avatar.jpg', type: 'image/jpg' });
    } else if (flag[2] === 0) {
      formdata.append('image3', 'delete');
    }
    formdata.append('latitude', productProps.location.latitude);
    formdata.append('longitude', productProps.location.longitude);

    fetch(Global.API_URL + '/product/set_product', {
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
      if (responseData === null) {
        this.props.setSpinnerVisible(false);
        Utils.toast(I18n.t('ALERT_FAIL_SAVE_PRODUCT'));
      } else {
        Utils.toast(toastMsg);
        this.getFilteredProducts();
      }
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  getFilteredProducts() {
    // fetch(Global.API_URL + '/product/get_myoffer', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    //   body: JSON.stringify({
    //     token: this.props.logins.token,
    //     latitude: this.props.globals.location.latitude,
    //     longitude: this.props.globals.location.longitude,
    //   }),
    // })
    // .then((response) => {
    //   if (!response.ok) {
    //     return null;
    //   }
    //   return response.json();
    // })
    // .then((responseData) => {
    //   if (responseData === null) {
    //     this.props.setMyOffer({});
    //     this.props.setSpinnerVisible(false);
    //     return;
    //   }
    //   this.props.setMyOffer(responseData);
    //   this.props.setSpinnerVisible(false);
    //
    //   const objArray = responseData;
    //   const name = this.state.productName;
    //   const obj = objArray.filter(function(element) {
    //     return element.name === name;
    //   });
    //   this.props.setRenderProduct(obj[0]);
    //   // this.replaceRoute('viewmyproduct');
    //   this.props.popRoute();
    // }).catch((error) => {
    //   console.log(error);
    // })
    // .done();
    this.props.setSpinnerVisible(true);
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
        date_range: this.props.globals.filterValue.date_range,
        expire_sort: this.props.globals.filterValue.expire_sort,
        category: this.props.globals.filterValue.category,
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
      } else {
        this.props.setProduct(responseData);
      }
      this.props.setHomeTab('discover');
      this.props.popRoute();
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  showActionSheetMenu() {
    this.ActionSheet.show();
  }
  showDatePicker() {
    this.setState({ calendarVisible: true });
  }
  handleDatePicked(date) {
    this.setState({ expiaryDate: date.toDate() });
    this.hideDatePicker();
  }
  popRoute() {
    Global.TMP_NAME = '';
    Global.TMP_DESC = '';
    Global.TMP_DATE = new Date();
    Global.TMP_CATEGORY = 0;
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  replaceRoute(route) {
    this.props.replaceRoute(route);
  }
  hideDatePicker() {
    this.setState({ calendarVisible: false });
  }
  renderProductImages(data) {
    return (
      <Image
        source={{ uri: data }}
        resizeMode={'cover'}
        style={{ width: Metrics.screenWidth }}
      />
    );
  }
  render() {
    const dataSource = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });
    const imgArray = dataSource.cloneWithPages(Global.OfferImages);// this.state.slideImages);
    // TODO : if no product images then <View style={{height:theme.devheight / 2}} />
    const productImages =
      (<ViewPager
        style={{ width: Metrics.screenWidth }}
        dataSource={imgArray}
        renderPage={this.renderProductImages}
        isLoop={false}
        autoPlay={false}
        onChangePage={pageNo => this.onChangeViewPage(pageNo)}
      />);
    const favButton =
      (<TouchableOpacity onPress={() => this.onDeleteImage()} style={Styles.topRightButton}>
        <Icon
          raised
          style={{ color: Colors.brandPrimary }}
          name={'md-close-circle'}
          type={'font-awesome'}
          color={Colors.brandSecondary}
          size={30}
        />
      </TouchableOpacity>);
    const backButton =
      (<TouchableOpacity
        onPress={() => {
          Global.OfferImages = [];
          this.popRoute();
        }}
        style={Styles.topLeftButton}
      >
        <Icon
          raised
          name={'ios-arrow-back'}
          type={'font-awesome'}
          color={Colors.brandPrimary}
          size={40}
        />
      </TouchableOpacity>);
    const spacer = (<View style={{ height: 10 }} />);
    const categoryId = this.state.productCategory;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: Colors.brandSecondary }}
          automaticallyAdjustContentInsets={false}
        >
          <View style={styles.topArea}>
            <View
              style={{ height: Metrics.screenHeight * 0.4,
                shadowOpacity: 0.2,
                shadowOffset: {
                  width: 0, height: 5,
                },
                shadowColor: '#00a42e',
                shadowRadius: 6 }}
            >
              {productImages}
            </View>
            <CircleButton
              icon={'md-add'}
              radius={Metrics.circleBtnSize}
              style={styles.addImageButton}
              titleStyle={styles.titleTextStyle}
              hasBorder={false}
              backColor={Colors.brandPrimary}
              color={Colors.brandSecondary}
              onPress={() => {
                if (this.state.slideImages.length === 3) {
                  Utils.toast(I18n.t('ALERT_EXEED_IMAGE_LENGTH'));
                  return;
                }
                Global.TMP_NAME = this.state.productName;
                Global.TMP_DESC = this.state.description;
                Global.TMP_DATE = this.state.expiaryDate;
                Global.TMP_CATEGORY = this.state.productCategory;
                // this.replaceRoute('takeitemphoto');
                this.pushNewRoute('takeitemphoto');
              }}
            />
            {backButton}
            {favButton}
          </View>
          <View style={[Styles.center, styles.bottomArea]}>
            <View style={styles.viewInputStyle}>
              <FormInput
                containerStyle={{ width: Metrics.screenWidth * 0.9, borderBottomWidth: 0 }}
                underlineColorAndroid={'transparent'}
                inputStyle={[Fonts.style.description, { color: Colors.textSecondary }]}
                placeholderTextColor={Colors.textDisabled}
                placeholder={I18n.t('PRODUCT_NAME')}
                returnKeyType={'next'}
                onSubmitEditing={() => this.refs.description.focus()}
                value={this.state.productName}
                onChangeText={text => this.setState({ productName: text })}
              />
            </View>
            <View style={styles.viewInputStyle}>
              <TextInput
                ref={'description'}
                placeholder={I18n.t('DESCRIPTION')}
                placeholderTextColor={Colors.textDisabled}
                style={styles.descriptionText}
                editable
                maxLength={300}
                multiline
                numberOfLines={3}
                onChangeText={text => this.setState({ description: text })}
                value={this.state.description}
                returnKeyType={'next'}
                textAlignVertical={'top'}
                underlineColorAndroid={'transparent'}
              />
            </View>
            <TouchableOpacity style={styles.rowContainer} onPress={() => this.showDatePicker()}>
              <View style={{ flex: 8 }}>
                <Text style={[Fonts.style.description, { color: Colors.textDisabled }]}>
                  {I18n.t('EXPIARY_DATE')}
                </Text>
                <Text style={[Fonts.style.description, { color: Colors.textSecondary, marginTop: 7 }]}>
                  {Utils.getStringFromDate(this.state.expiaryDate)}
                </Text>
              </View>
              <View style={[Styles.center, { flex: 1 }]}>
                <Icon
                  raised
                  name={'ios-calendar-outline'}
                  type={'font-awesome'}
                  color={Colors.textDisabled}
                  size={25}
                  style={{ marginTop: 15 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowContainer} onPress={() => this.showActionSheetMenu()}>
              <View style={{ flex: 8 }}>
                <Text style={[Fonts.style.description, { color: Colors.textDisabled }]}>
                  {I18n.t('CATEGORY')}
                </Text>
                <Text style={styles.categoryText}>
                  {categoryInfo[categoryId].label}
                </Text>
              </View>
              <View style={[Styles.center, { flex: 1 }]}>
                <Icon
                  raised
                  name={'md-list'}
                  type={'font-awesome'}
                  color={Colors.textDisabled}
                  size={25}
                  style={{ marginTop: 15 }}
                />
              </View>
            </TouchableOpacity>
            {spacer}
            {spacer}
            {spacer}
            <Button
              large
              title={I18n.t('START_OFFER')}
              buttonStyle={[Styles.buttonShadow, styles.offerBtn]}
              textStyle={Fonts.style.buttonText}
              onPress={() => this.onGetImageNames()}
            />
            <Text style={styles.publishNotifText}>
              {I18n.t('PRODUCT_WILL_PUBLISHED')}
            </Text>
          </View>
          <ActionSheet
            ref={o => this.ActionSheet = o}
            options={categoryInfo}
            cancelButtonIndex={categoryInfo.length - 1}
            onPress={this.onActionSheetMenu.bind(this)}
            tintColor={Colors.textSecondary}
          />
        </KeyboardAwareScrollView>
        <Modal
          open={this.state.calendarVisible}
          offset={0}
          overlayBackground={'rgba(0, 0, 0, 0.75)'}
          animationDuration={200}
          animationTension={40}
          modalDidClose={() => this.hideDatePicker()}
          closeOnTouchOutside
          containerStyle={{
          }}
          modalStyle={{
            backgroundColor: 'transparent',
          }}
        >
          <Calendar
            onChange={date => this.handleDatePicked(date)}
            selected={this.state.curDate}
            minDate={Moment().startOf('day')}
            maxDate={Moment().add(3, 'years').startOf('day')}
            barView={{ backgroundColor: Colors.brandPrimary }}
            dayTodayText={{ backgroundColor: Colors.brandPrimary }}
            daySelectedText={{
              fontWeight: 'bold',
              backgroundColor: Colors.brandPrimary,
              color: Colors.textPrimary,
              borderColor: Colors.brandPrimary,
              borderRadius: 15,
              overflow: 'hidden',
            }}
            style={{
              borderWidth: 1,
              backgroundColor: Colors.backgroundPrimary,
              borderColor: Colors.brandPrimary,
              borderRadius: 5,
              minWidth: Metrics.screenWidth * 0.9,
              width: Metrics.screenWidth * 0.9,
              right: Metrics.screenWidth * 0.035,
            }}
            barText={{
              fontWeight: 'bold',
              color: Colors.textPrimary,
            }}
            dayHeaderView={{
              backgroundColor: '#F5F5F5',
              borderBottomColor: '#BDBDBD',
            }}
            dayRowView={{
              borderColor: '#F5F5F5',
              height: 40,
            }}
            stageView={{
              padding: 0,
            }}
          />
        </Modal>
        <Spinner visible={this.props.globals.spinnerVisible} />
      </View>
    );
  }
}
StartOffer.propTypes = {

};
StartOffer.defaultProps = {

};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    replaceRoute: route => dispatch(replaceRoute(route)),
    setMyOffer: productInfo => dispatch(setMyOffer(productInfo)),
    setProduct: product => dispatch(setProduct(product)),
    setRenderProduct: renderProduct => dispatch(setRenderProduct(renderProduct)),
    setHomeTab: homeTab => dispatch(setHomeTab(homeTab)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  const products = state.get('productinfo');
  return { globals, logins, products };
}
export default connect(mapStateToProps, mapDispatchToProps)(StartOffer);
