import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { Metrics, Images, Styles, Colors, Fonts } from '@theme/';

const alignItemsMap = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
};

const shadowHeight = 12;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  actionBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  btnShadow: {
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0, height: 8,
    },
    shadowColor: '#53ad44',
    shadowRadius: 4,
  },
  actionsVertical: {
    flex: 1,
  },
  title: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    fontSize: 10,
    color: Colors.textSecondary,
  },
});

export default class FloatButton extends Component {

  componentWillUnmount() {

  }

  getContainerStyles() {
    return [styles.overlay, this.getOrientation(), this.getOffsetXY()];
  }

  getActionButtonStyles() {
    const actionButtonStyles = [styles.actionBarItem, this.getButtonSize()];
    return actionButtonStyles;
  }

  getOrientation() {
    return { alignItems: alignItemsMap[this.props.position] };
  }

  getButtonSize() {
    return {
      width: this.props.size + 16,
      height: this.props.size + shadowHeight,
    };
  }

  getOffsetXY() {
    return {
      paddingHorizontal: this.props.offsetX - 8,
      paddingBottom: this.props.offsetY,
      paddingTop: this.props.offsetY,
    };
  }

  _renderButton() {
    const combinedStyle = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      backgroundColor: this.props.buttonColor,
    };
    const actionButtonStyles = [this.getActionButtonStyles(), combinedStyle];

    return (
      <View>
        <TouchableOpacity
          style={[styles.btnShadow, combinedStyle]}
          onPress={() => this.props.onPress()}
        >
          <View style={actionButtonStyles}>
            {this._renderButtonIcon()}
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>
          {this.props.title ? this.props.title : ' '}
        </Text>
      </View>
    );
  }

  _renderButtonIcon() {
    return (
      <View
        style={[Styles.center, {
          width: this.props.size * 0.6,
          height: this.props.size * 0.6,
          backgroundColor: 'transparent',
          borderRadius: this.props.size * 0.35 }]}
      >
        <Image
          source={Images.imgApple}
          style={{ width: this.props.size * 0.65, height: this.props.size * 0.65 }}
          resizeMode={'contain'}
        />
      </View>
    );
  }


  render() {
    return (
      <View pointerEvents="box-none" style={styles.overlay}>
        <View pointerEvents="box-none" style={this.getContainerStyles()}>
          {this._renderButton()}
        </View>
      </View>
    );
  }
}

FloatButton.propTypes = {
  position: PropTypes.string,
  title: PropTypes.string,
  hideShadow: PropTypes.bool,
  bgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  size: PropTypes.number,
  onPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
};

FloatButton.defaultProps = {
  active: false,
  title: '',
  bgColor: 'transparent',
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextColor: 'rgba(255,255,255,1)',
  outRangeScale: 1,
  onPress: () => {},
  backdrop: false,
  position: 'center',
  offsetX: 30,
  offsetY: 0,
  size: Metrics.screenWidth / 5,
};
