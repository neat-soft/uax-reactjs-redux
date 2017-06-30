/* Splash Screen */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, NetInfo, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { Button, FormInput, FormLabel } from 'react-native-elements';
import I18n from 'react-native-i18n';
import Spinner from '@components/OverlaySpinner';
import Icon from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';

import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { loginAttempt } from '@actions/login';
import { Styles, Fonts, Colors } from '@theme/';
import utils from '../../utils';
import styles from './styles';

var Analytics = require('react-native-firebase-analytics');

const None = Platform.OS === 'ios' ? 'none' : 'NONE';

class LoginEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      spinnerVisible: false,
    };
    this.connectionInfo = null;
    this.isLoading = false;
  }
  componentWillMount() {
    store.get('email').then((email) => {
      this.setState({ email });
    }).catch(() => {
      this.setState({ email: '' });
    });
    store.get('password').then((password) => {
      this.setState({ password });
    }).catch(() => {
      this.setState({ password: '' });
    });
  }
  componentDidMount() {
    NetInfo.addEventListener('change', this.handleConnectionInfoChange.bind(this));
    NetInfo.fetch().done(
      (connectionInfo) => {
        this.connectionInfo = connectionInfo;
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.logins.loggedIn && !this.isLoading) {
      this.isLoading = true;
      Analytics.setUserId(nextProps.globals.user.user.id.toString());
      Analytics.setUserProperty('email', nextProps.globals.user.user.email);
      Analytics.setUserProperty('name', nextProps.globals.user.user.name);
      Analytics.logEvent('login', {'id': nextProps.globals.user.user.id.toString()});

      this.setState({ spinnerVisible: false });
      this.replaceRoute('home');
    } else if (nextProps.logins.error != null) {
      this.setState({ spinnerVisible: false });
      utils.toast(I18n.t('ALERT_LOGIN_WRONG_INFO'));
    } else if (!nextProps.logins.loggedIn && !nextProps.logins.attempting) {
      this.setState({ spinnerVisible: false });
      utils.toast(I18n.t('ALERT_LOGIN_WRONG_INFO'));
    }
  }
  attemptLogin() {
    if (this.connectionInfo === None) {
      utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    const email = this.state.email;
    const password = this.state.password;
    if (password === null || password === '' || email === '' || email === null) {
      this.setState({ spinnerVisible: false });
      utils.toast(I18n.t('ALERT_LOGIN_EMPTY'));
    } else if (utils.validateEmail(email)) {
      this.setState({ spinnerVisible: true });
      this.props.loginAttempt({ user: {
        email: this.state.email,
        password: this.state.password,
      } });
    } else {
      utils.toast(I18n.t('ALERT_LOGIN_INVALID_EMAIL'));
    }
  }
  popRoute() {
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  replaceRoute(route) {
    this.props.replaceRoute(route);
  }
  handleConnectionInfoChange(connectionInfo) {
    this.connectionInfo = connectionInfo;
  }
  render() {
    const spacer = (<View style={{ height: 15 }} />);
    return (
      <KeyboardAwareScrollView automaticallyAdjustContentInsets={false}>
        <View style={[Styles.fullScreen, { backgroundColor: Colors.brandSecondary }]}>
          <Icon
            raised
            name="md-close"
            type={'font-awesome'}
            size={25}
            color={Colors.textSecondary}
            onPress={() => this.replaceRoute('login')}
            style={{ marginLeft: 20, marginTop: 30, flex: 0.1 }}
          />
          <View style={[Styles.center, { flex: 0.8 }]}>
            <Text style={[styles.appTitle, { color: Colors.textSecondary }]}>
              {I18n.t('APP_NAME_SPACE')}
            </Text>
            <Text style={[styles.appDescription, { color: Colors.textDisabled }]}>
              {I18n.t('FOOD_FOR_EVERYONE')}
            </Text>
          </View>
          <View style={[Styles.center, { flex: 1 }]}>
            <View>
              <View>
                <FormLabel
                  labelStyle={styles.placeHolderText}
                >
                  {I18n.t('EMAIL')}
                </FormLabel>
              </View>
              <View style={styles.viewInputStyle}>
                <FormInput
                  autoCapitalize="none"
                  containerStyle={styles.formInputStyle}
                  inputStyle={{ color: Colors.textSecondary, fontFamily: Fonts.type.base }}
                  underlineColorAndroid={'transparent'}
                  returnKeyType={'next'}
                  keyboardType="email-address"
                  value={this.state.email}
                  onSubmitEditing={() => this.refs.loginpwd.refs.loginpwd.focus()}
                  onChangeText={email => this.setState({ email })}
                />
              </View>
              <FormLabel
                labelStyle={styles.placeHolderText}
              >
                {I18n.t('PASSWORD')}
              </FormLabel>
              <View style={styles.viewInputStyle}>
                <FormInput
                  ref={'loginpwd'}
                  textInputRef={'loginpwd'}
                  secureTextEntry
                  underlineColorAndroid={'transparent'}
                  containerStyle={styles.formInputStyle}
                  value={this.state.password}
                  inputStyle={{ color: Colors.textSecondary, fontFamily: Fonts.type.base }}
                  onChangeText={password => this.setState({ password })}
                  returnKeyType={'go'}
                />
              </View>
            </View>
            {spacer}
            <Button
              large
              title={I18n.t('LOGIN')}
              buttonStyle={[Styles.buttonShadow, styles.loginBtn]}
              textStyle={Fonts.style.buttonText}
              onPress={() => this.attemptLogin()}
            />
            {spacer}
            <View style={[Styles.center, { flexDirection: 'row' }]}>
              <TouchableOpacity onPress={() => this.replaceRoute('register')}>
                <Text style={styles.underlineText}>
                  {I18n.t('HERE')}
                </Text>
              </TouchableOpacity>
              <Text style={[Fonts.style.description, { color: Colors.textDisabled }]}>
                {I18n.t('IF_YOU_DONT1')}
              </Text>
            </View>
            <Text style={[Fonts.style.description, { color: Colors.textDisabled, alignSelf: 'center' }]}>
              {I18n.t('IF_YOU_DONT2')}
            </Text>
          </View>
        </View>
        <Spinner visible={this.state.spinnerVisible} />
      </KeyboardAwareScrollView>
    );
  }
}

LoginEmail.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  pushNewRoute: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    replaceRoute: route => dispatch(replaceRoute(route)),
    loginAttempt: user => dispatch(loginAttempt(user)),
  };
}
function mapStateToProps(state) {
  const logins = state.get('login');
  const globals = state.get('globals');
  return { logins, globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginEmail);
