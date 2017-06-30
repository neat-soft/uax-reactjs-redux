import React, { Component } from 'react';
import { View, Text, TouchableOpacity, NetInfo, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Button, FormInput, FormLabel } from 'react-native-elements';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import { signupAttempt } from '@actions/signup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { popRoute, replaceRoute } from '@actions/route';
import { Styles, Fonts, Colors } from '@theme/';
import Utils from '../../utils';
import styles from './styles';

const None = Platform.OS === 'ios' ? 'none' : 'NONE';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    };
    _this = this;
    this.connectionInfo = null;
  }
  componentDidMount() {
    NetInfo.addEventListener('change', this.handleConnectionInfoChange.bind(this));
    NetInfo.fetch().done(
      (connectionInfo) => {
        this.connectionInfo = connectionInfo;
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userProps.signedUp) {
      Utils.toast(I18n.t('SIGNUP_SUCCESS'));
      this.replaceRoute('loginemail');
    } else if (nextProps.userProps.error) {
      Utils.toast(I18n.t('ALERT_LOGIN_ERROR'));
    } else if (!nextProps.userProps.signedUp && !nextProps.userProps.attempting) {
      Utils.toast(I18n.t('ALERT_REGISTER_EXIST'));
    }
  }
  popRoute() {
    this.props.popRoute();
  }
  replaceRoute(route) {
    this.props.replaceRoute(route);
  }
  signupAttempt() {
    if (this.connectionInfo === None) {
      Utils.toast(I18n.t('NETWORK_NOT_AVAILABLE'));
      return;
    }
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    store.save('email', email);
    store.save('password', password);
    if (password === '' || email === '' || name === '') {
      Utils.toast(I18n.t('ALERT_LOGIN_EMPTY'));
    } else if (Utils.validateEmail(email)) {
      this.props.signupAttempt({ user: {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      } });
    } else {
      Utils.toast(I18n.t('ALERT_LOGIN_INVALID_EMAIL'));
    }
  }
  handleConnectionInfoChange(connectionInfo) {
    this.connectionInfo = connectionInfo;
  }
  render() {
    const spacer = (<View style={{ height: 10 }} />);
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
            style={{ marginLeft: 20, marginTop: 30 }}
          />
          <View style={[Styles.center, { flex: 0.7 }]}>
            <Text style={[styles.appTitle, { color: Colors.textSecondary }]}>
              {I18n.t('APP_NAME_SPACE')}
            </Text>
            <Text style={[styles.appDescription, { color: Colors.textDisabled }]}>
              {I18n.t('FOOD_FOR_EVERYONE')}
            </Text>
          </View>
          <View style={{ flex: 1.2, alignItems: 'center' }}>
            <View>
              <FormLabel
                labelStyle={styles.placeHolderText}
              >
                {I18n.t('NAME')}
              </FormLabel>
              <View style={styles.viewInputStyle}>
                <FormInput
                  ref={'regname'}
                  textInputRef={'regname'}
                  containerStyle={styles.formInputStyle}
                  inputStyle={{ color: Colors.textSecondary, fontFamily: Fonts.type.base }}
                  underlineColorAndroid={'transparent'}
                  returnKeyType={'go'}
                  value={this.state.name}
                  onChangeText={name => this.setState({ name })}
                />
              </View>
              <FormLabel
                labelStyle={styles.placeHolderText}
              >
                {I18n.t('EMAIL')}
              </FormLabel>
              <View style={styles.viewInputStyle}>
                <FormInput
                  containerStyle={styles.formInputStyle}
                  inputStyle={{ color: Colors.textSecondary, fontFamily: Fonts.type.base }}
                  returnKeyType={'next'}
                  keyboardType="email-address"
                  underlineColorAndroid={'transparent'}
                  onSubmitEditing={() => this.refs.regpwd.refs.regpwd.focus()}
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                />
              </View>
              <FormLabel
                labelStyle={styles.placeHolderText}
              >
                {I18n.t('PASSWORD')}
              </FormLabel>
              <View style={styles.viewInputStyle}>
                <FormInput
                  ref={'regpwd'}
                  textInputRef={'regpwd'}
                  secureTextEntry
                  containerStyle={styles.formInputStyle}
                  inputStyle={{ color: Colors.textSecondary, fontFamily: Fonts.type.base }}
                  underlineColorAndroid={'transparent'}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.refs.regname.refs.regname.focus()}
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                />
              </View>
            </View>
            {/*
              <Avatar
                placeholder={Images.imgAvatar}
                size={'default'}
                interactive={true}
                onChange={this.handleAvatarChange}
              /> */}
            <View style={[Styles.center, { flex: 1.1 }]}>
              <Button
                large
                title={I18n.t('FREE_REGISTRATION')}
                buttonStyle={[Styles.buttonShadow, styles.loginBtn]}
                textStyle={Fonts.style.buttonText}
                onPress={() => this.signupAttempt()}
              />
              {spacer}
              <View style={[Styles.center, { alignItems: 'center', flexDirection: 'row', marginTop: 15 }]}>
                <Text style={[Fonts.style.description, { color: Colors.textDisabled }]}>
                  {I18n.t('IF_YOU_HAVE')}
                </Text>
                <TouchableOpacity onPress={() => this.replaceRoute('loginemail')}>
                  <Text style={styles.underlineText1}>
                    {I18n.t('LOGIN_HERE')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

Register.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    replaceRoute: route => dispatch(replaceRoute(route)),
    signupAttempt: user => dispatch(signupAttempt(user)),
  };
}
function mapStateToProps(state) {
  const userProps = state.get('signup');
  return { userProps };
}
export default connect(mapStateToProps, mapDispatchToProps)(Register);
