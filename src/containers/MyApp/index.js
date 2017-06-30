import React, { Component } from 'react';
import { Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Spinner from '@components/OverlaySpinner';
import MyAppTabBar from '@components/MyAppTabBar';
import ActionSheet from '@components/ActionSheet/';
import { popRoute, pushNewRoute } from '@actions/route';
import { setMyAppTab, setUser, setSpinnerVisible } from '@actions/globals';
import Utils from '@src/utils';
import { Styles, Fonts, Images, Colors, Global } from '@theme/';
import Messages from './messages';
import MyOffers from './myoffers';
import Profile from './profile';
import Favorite from './favorite';

import styles from './styles';

const buttonInfo = [
  { key: 0, label: I18n.t('TAKE_PHOTO') },
  { key: 1, label: I18n.t('PICK_FROM_LIBRARY') },
  { key: 2, label: I18n.t('CANCEL') },
];
class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarImage: '',
    };
    this.avatarImage = '';
  }
  componentWillMount() {
    this.setState({ avatarImage: this.props.globals.user.user.image });
    this.avatarImage = this.props.globals.user.user.image;
  }
  onActionSheetMenu(index) {
    const options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    switch (index) {
      case 0:
        ImagePicker.launchCamera(options, (response) => {
          this.onImagePicker(response);
        });
        break;
      case 1:
        ImagePicker.launchImageLibrary(options, (response) => {
          this.onImagePicker(response);
        });
        break;
      default:
    }
  }
  onImagePicker(response) {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      let source = '';
      if (Platform.OS === 'android') {
        source = { uri: response.uri };
      } else {
        source = { uri: response.uri.replace('file://', ''), isStatic: true };
      }
      ImageResizer.createResizedImage(source.uri, 800, 600, 'JPEG', 80)
      .then((resizedImageUri) => {
        this.setState({
          avatarImage: resizedImageUri,
        });
        this.props.globals.user.user.image = resizedImageUri;
      }).catch((err) => {
        console.log(err);
        return Utils.toast('Unable to resize the photo');
      });
    }
  }
  onUpdateProfile() {
    this.props.setSpinnerVisible(true);
    const userProps = this.props.globals.user.user;
    const formdata = new FormData();
    formdata.append('token', this.props.logins.token);
    formdata.append('name', userProps.name);
    if (this.state.avatarImage !== '' && this.state.avatarImage !== this.avatarImage) {
      formdata.append('image', { uri: this.state.avatarImage, name: 'avatar.jpg', type: 'image/jpg' });
    }
    formdata.append('notification_message', userProps.notification_message);
    formdata.append('notification_offer', userProps.notification_offer);
    fetch(Global.API_URL + '/auth/set_user', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      if (responseData.error) {
        Utils.toast(responseData.error.message);
        return;
      }
      this.props.setUser(responseData);
      Utils.toast(I18n.t('TOAST_UPDATE_PROFILE'));
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      Utils.toast(error);
    })
    .done();
  }
  setMyAppTab() {
    this.props.setMyAppTab('messages');
  }
  setAppTab(tab) {
    this.props.setMyAppTab(tab);
  }
  showActionSheetMenu() {
    this.ActionSheet.show();
  }
  popRoute() {
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  render() {
    let myAppTabPage = null;
    if (this.props.globals.myAppTab === 'messages') {
      myAppTabPage = <Messages navigator={this.props.navigator} />;
    } else if (this.props.globals.myAppTab === 'myoffers') {
      myAppTabPage = <MyOffers navigator={this.props.navigator} />;
    } else if (this.props.globals.myAppTab === 'profile') {
      myAppTabPage = <Profile navigator={this.props.navigator} />;
    } else if (this.props.globals.myAppTab === 'favorite') {
      myAppTabPage = <Favorite navigator={this.props.navigator} />;
    }
    const updateProBtn = this.props.globals.myAppTab === 'profile' ?
      (<TouchableOpacity onPress={() => this.onUpdateProfile()}>
        <Text style={[Fonts.style.buttonText, { color: Colors.textDisabled, marginRight: 20 }]}>
          {I18n.t('UPDATE_PROFILE')}
        </Text>
      </TouchableOpacity>)
        :
        null;
    const avatarImgSrc = this.state.avatarImage === '' ?
      (<Image
        style={styles.avatarStyle}
        source={Images.imgAvatar}
      />)
      :
      (<Image
        style={styles.avatarStyle}
        source={{ uri: this.state.avatarImage }}
      />);
    return (
      <View style={{ flex: 1, backgroundColor: Colors.brandSecondary }}>
        <View style={{ flex: 1.6 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {updateProBtn}
          </View>
          <View style={[Styles.center, { flex: 4 }]}>
            <View>
              {avatarImgSrc}
              {
                this.props.globals.myAppTab === 'profile' ?
                  <Icon
                    raised
                    name={'ios-add-circle'}
                    type={'font-awesome'}
                    color={Colors.brandPrimary}
                    onPress={() => this.showActionSheetMenu()}
                    size={35}
                    style={{ position: 'absolute', right: -5, top: -5, backgroundColor: 'transparent' }}
                  /> : null
              }
            </View>
            <Text style={styles.nameText}>
              {this.props.globals.user.user.name}
            </Text>
            {/* productQuantityLabel*/}
          </View>
        </View>
        <View style={{ flex: 3.2 }}>
          <MyAppTabBar
            badgeVisible={this.props.globals.badgeVisible}
            onPressTabButton={tab => this.setAppTab(tab)}
          />
          {myAppTabPage}
        </View>
        <Spinner visible={this.props.globals.spinnerVisible} />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={buttonInfo}
          cancelButtonIndex={buttonInfo.length - 1}
          onPress={this.onActionSheetMenu.bind(this)}
          tintColor={Colors.textSecondary}
        />
      </View>
    );
  }
}
MyApp.propTypes = {

};
MyApp.defaultProps = {

};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    setMyAppTab: homeTab => dispatch(setMyAppTab(homeTab)),
    setUser: user => dispatch(setUser(user)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  return { globals, logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(MyApp);
