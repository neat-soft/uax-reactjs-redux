import React, { Component, PropTypes } from 'react';
import { Text, View, Modal, ScrollView, TouchableHighlight, Animated } from 'react-native';

import styles, { btnStyle, sheetStyle, hairlineWidth } from './styles';
import { Metrics, Images, Colors, Styles } from '@theme/';

const TITLE_H = 40;
const CANCEL_MARGIN = 6;
const BUTTON_H = 50 + hairlineWidth;
const WARN_COLOR = '#ff3b30';
const MAX_HEIGHT = Metrics.screenHeight * 0.7;

let _this;
class ActionSheet extends Component {
  constructor(props) {
    super(props);
    this.scrollEnabled = false;
    this.translateY = this._calculateHeight();
    this.state = {
      visible: false,
      sheetAnim: new Animated.Value(this.translateY),
    };
    this._cancel = this._cancel.bind(this);
    _this = this;
  }

  show() {
    this.setState({ visible: true });
    this._showSheet();
  }

  hide(index) {
    this._hideSheet(() => {
      this.setState({ visible: false });
    });
    setTimeout(() => {
      _this.props.onPress(index);
    }, 300)
  }

  _cancel() {
    const { cancelButtonIndex } = this.props;
    if (cancelButtonIndex > -1) {
      // this.hide(cancelButtonIndex);
      this._hideSheet(() => {
        this.setState({ visible: false });
      });
    }
  }

  _showSheet() {
    Animated.timing(this.state.sheetAnim, {
      toValue: 0,
      duration: 250,
    }).start();
  }

  _hideSheet(callback) {
    Animated.timing(this.state.sheetAnim, {
      toValue: this.translateY,
      duration: 150,
    }).start(callback || function() {});
  }

  _calculateHeight() {
    let count = this.props.options.length;
    let height = BUTTON_H * count + CANCEL_MARGIN;
    if (this.props.title) height += TITLE_H;
    if (height > MAX_HEIGHT) {
      this.scrollEnabled = true;
      return MAX_HEIGHT;
    } else {
      this.scrollEnabled = false;
      return height;
    }
  }

  _renderTitle() {
    if (this.props.title) {
      return (
        <View style={sheetStyle.title}>
          <Text style={sheetStyle.titleText}>{this.props.title}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  _renderCancelButton() {
    const { options, cancelButtonIndex, tintColor } = this.props;
    if (cancelButtonIndex > -1 && options[cancelButtonIndex]) {
      return (
        <TouchableHighlight
          activeOpacity={1}
          underlayColor="#f4f4f4"
          style={[btnStyle.wrapper, { marginTop: 6, backgroundColor: Colors.brandPrimary }]}
          onPress={this._cancel}
        >
          <Text style={[btnStyle.title, { fontWeight: '700', color: 'white' }]}>
            {options[cancelButtonIndex].label}
          </Text>
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  }

  _createButton(title, fontColor, index, style) {
    return (
      <TouchableHighlight
        key={index}
        activeOpacity={1}
        underlayColor="#f4f4f4"
        style={[btnStyle.wrapper, style || {}]}
        onPress={this.hide.bind(this, index)}
      >
        <Text style={[btnStyle.title, { color: fontColor }]}>
          {title}
        </Text>
      </TouchableHighlight>
    );
  }

  _renderOptions() {
    const { options, tintColor, cancelButtonIndex, destructiveButtonIndex } = this.props;
    return options.map((title, index) => {
      const fontColor = destructiveButtonIndex === index ? WARN_COLOR : tintColor;
      return index === cancelButtonIndex ? null : this._createButton(title.label, fontColor, index);
    });
  }

  render() {
    const { cancelButtonIndex } = this.props;
    const { visible, sheetAnim } = this.state;
    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => {}}
      >
        <View style={sheetStyle.wrapper}>
          <Text style={styles.overlay} onPress={this._cancel} />
          <Animated.View
            style={[sheetStyle.bd, { height: this.translateY, transform: [{ translateY: sheetAnim }] }]}
          >
            {this._renderTitle()}
            <ScrollView
              scrollEnabled={this.scrollEnabled}
              contentContainerStyle={sheetStyle.options}>
              {this._renderOptions()}
            </ScrollView>
            {this._renderCancelButton()}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}


ActionSheet.propTypes = {
  title: PropTypes.string,
  options: PropTypes.array.isRequired,
  tintColor: PropTypes.string,
  cancelButtonIndex: PropTypes.number,
  destructiveButtonIndex: PropTypes.number,
  onPress: PropTypes.func,
};


ActionSheet.defaultProps = {
  tintColor: '#007aff',
  onPress: () => {},
};


export default ActionSheet;
