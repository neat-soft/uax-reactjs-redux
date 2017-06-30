import React, { Component } from 'react';
import { View, Text, NetInfo, Platform, TouchableOpacity, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import I18n from 'react-native-i18n';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import store from 'react-native-simple-store';
import Spinner from '@components/OverlaySpinner';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import Utils from '@src/utils';
import { replaceRoute, pushNewRoute } from '@actions/route';
import { fbloginAttempt } from '@actions/login';
import { Styles, Fonts, Colors, Metrics } from '@theme/';
import styles from './styles';

const LoginBehavior = {
  'ios': FBLoginManager.LoginBehaviors.Browser,
  'android': FBLoginManager.LoginBehaviors.Native
};
const None = Platform.OS === 'ios' ? 'none' : 'NONE';

class LoginMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
    };
    this.connectionInfo = null;
  }
  componentWillMount() {
    const permissions = {
      alert: true,
      badge: true,
      sound: true,
    };
    OneSignal.configure();
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);
    if (Platform.OS === 'ios') OneSignal.requestPermissions(permissions);
  }
  componentDidMount() {
    NetInfo.addEventListener('change', this.handleConnectionInfoChange.bind(this));
    NetInfo.fetch().done(
      (connectionInfo) => {
        this.connectionInfo = connectionInfo;
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.logins.loggedIn) {
      this.setState({ spinnerVisible: false });
      this.replaceRoute('home');
    } else if (nextProps.logins.error && !nextProps.logins.loggedIn) {
      this.setState({ spinnerVisible: false });
      Utils.toast(I18n.t('ALERT_LOGIN_ERROR'));
    }
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
  }
  onIds(device) {
    if (device) {
      store.save('device', device).then(() => {
      }).catch((error) => {
        Utils.toast(error.toString());
      });
    }
  }
  // login facebook
  loginWithFacebook() {
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    const _this = this;
    FBLoginManager.loginWithPermissions(['email', 'public_profile'], function (error, data) {
      if (!error) {
        _this.setState({ spinnerVisible: true });
        _this.props.fbloginAttempt(data.credentials.token);
      } else {
        console.log(error);
      }
    });
  }
  gotoRegister() {
    this.replaceRoute('register');
  }
  gotoHome() {
    this.replaceRoute('home');
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  replaceRoute(route) {
    this.props.replaceRoute(route);
  }
  loginSaga() {
    this.replaceRoute('loginemail');
  }
  handleConnectionInfoChange(connectionInfo) {
    this.connectionInfo = connectionInfo;
  }
  render() {
    return (
      <KeyboardAwareScrollView automaticallyAdjustContentInsets={false}>
        <View style={[Styles.fullScreen, { backgroundColor: Colors.brandSecondary }]}>
          <View style={{ flex: 0.8 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.appTitle, { color: Colors.textSecondary }]}>
              {I18n.t('APP_NAME_SPACE')}
            </Text>
            <Text style={[styles.appDescription, { color: Colors.textDisabled }]}>
              {I18n.t('FOOD_FOR_EVERYONE')}
            </Text>
          </View>
          <View style={{ flex: 1.2 }}>
            <View style={[Styles.center, { flex: 1, marginVertical: 5 }]}>
              <Button
                large
                title={I18n.t('LOGIN_FB')}
                buttonStyle={{
                  width: Metrics.screenWidth * 0.85,
                  height: Metrics.screenHeight * 0.085,
                  backgroundColor: Colors.buttonPrimary,
                  borderRadius: 35 }}
                textStyle={Fonts.style.buttonText}
                onPress={() => this.loginWithFacebook()}
              />
            </View>
            <View style={[Styles.center, { flex: 1, marginVertical: 5 }]}>
              <Button
                large
                title={I18n.t('LOGIN')}
                buttonStyle={{
                  width: Metrics.screenWidth * 0.85,
                  height: Metrics.screenHeight * 0.085,
                  backgroundColor: Colors.buttonPrimary,
                  borderRadius: 35 }}
                textStyle={Fonts.style.buttonText}
                onPress={() => this.loginSaga()}
              />
            </View>
            <View style={[Styles.center, { flex: 1, marginVertical: 5 }]}>
              <Button
                large
                title={I18n.t('SIGN_UP')}
                buttonStyle={[styles.buttonContainer, {
                  width: Metrics.screenWidth * 0.85, height: Metrics.screenHeight * 0.085 },
                ]}
                textStyle={[Fonts.style.buttonText]}
                onPress={() => this.gotoRegister()}
              />
            </View>
            <View style={[Styles.center, { flex: 0.6, marginBottom: 3 }]}>
              <Text style={[Fonts.style.description, styles.labelText, { color: Colors.textDisabled }]}>
                {I18n.t('BY_USING_APP')}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL('http://uxa-app.com/datenschutz.html').catch(err => console.error('An error occurred', err))}>
                <Text style={styles.underlineText}>
                  {I18n.t('TERMS')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.2 }} />
          </View>
          <Spinner visible={this.state.spinnerVisible} />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    replaceRoute: route => dispatch(replaceRoute(route)),
    fbloginAttempt: fbtoken => dispatch(fbloginAttempt(fbtoken)),
  };
}
function mapStateToProps(state) {
  const logins = state.get('login');
  return { logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginMain);
