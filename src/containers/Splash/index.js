/* Splash Screen */

import { Image } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from 'react-native-simple-store';
import Spinner from '@components/OverlaySpinner';
import { replaceRoute } from '@actions/route';
import { loginSuccess } from '@actions/login';
import { setSpinnerVisible } from '@actions/globals';
import { Styles, Images } from '@theme/';
import Utils from '@src/utils';

class Splash extends Component {
  componentWillMount() {
    store.get('token').then((token) => {
      if (token !== null) {
        this.props.loginSuccess(token);
        this.replaceRoute('home');
      } else {
        this.replaceRoute('login');
      }
    }).catch((error) => {
      Utils.toast(error.toString());
    });
  }
  replaceRoute(route) {
    setTimeout(() => {
      this.props.replaceRoute(route);
    }, 1500);
  }
  render() {
    return (
      <Image
        resizeMode={'stretch'}
        style={[Styles.fullScreen]}
        source={Images.bkgSplash}
      >
        <Spinner visible={this.props.globals.spinnerVisible} />
      </Image>
    );
  }
}

Splash.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    replaceRoute: route => dispatch(replaceRoute(route)),
    loginSuccess: token => dispatch(loginSuccess(token)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(Splash);
