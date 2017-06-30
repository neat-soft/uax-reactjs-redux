import React, { Component } from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import { View } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

import { Styles, Fonts, Colors } from '@theme/';

export default class CircleButton extends Component {
  render() {
    const textStyle = this.props.titleStyle != null ? this.props.titleStyle :
    { color: this.props.color,
      fontSize: Fonts.size.mini,
      fontFamily: Fonts.type.emphasis,
      textAlign: 'center',
      width: this.props.radius * 2,
      marginBottom: 3,
    };
    const title = this.props.title !== 'none' ?
      (<Text style={textStyle} >
        {this.props.title}
      </Text>)
    :
      null;
    const shadowStyle = this.props.showShadow === true ?
      Styles.circleButtonShadow : null;
    return (
      <TouchableOpacity
        style={[Styles.center, this.props.style,
          { flexDirection: 'column', width: this.props.radius * 1.8, paddingVertical: 5 }]}
        onPress={this.props.onPress}
      >
        <View
          style={[Styles.center, shadowStyle,
            { width: this.props.radius,
              height: this.props.radius,
              borderRadius: this.props.radius / 2,
              backgroundColor: this.props.backColor,
              borderWidth: this.props.hasBorder === true ? 1 : 0,
              borderColor: this.props.color,
              marginTop: 5,
            }]}
        >
          {this.props.image === '' ?
            (<Icon
              name={this.props.icon}
              size={this.props.radius / 1.5}
              color={this.props.color}
            />)
          :
            (<Image
              style={{ width: this.props.radius, height: this.props.radius, borderRadius: this.props.radius / 2 }}
              source={{ uri: this.props.image }}
            />
          )}
        </View>
        {title}
      </TouchableOpacity>
    );
  }
}
CircleButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  radius: React.PropTypes.number,
  backColor: React.PropTypes.string,
  color: React.PropTypes.string,
  icon: React.PropTypes.string,
  title: React.PropTypes.string,
  hasBorder: React.PropTypes.bool,
  titleStyle: React.PropTypes.number,
  style: React.PropTypes.number,
  showShadow: React.PropTypes.bool,
};
CircleButton.defaultProps = {
  onPress: () => { console.log('button_pressed'); },
  radius: 30,
  backColor: Colors.brandSecondary,
  color: Colors.borderPrimary,
  icon: 'md-help',
  image: '',
  title: 'none',
  hasBorder: true,
  titleStyle: null,
  style: null,
  showShadow: true
};
