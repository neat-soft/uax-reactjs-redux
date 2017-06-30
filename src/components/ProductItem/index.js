import React, { Component } from 'react';
import { View, Image, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { Colors } from '@theme/';

export default class ProductItem extends Component {
  getDistance() {
    // TODO: calculate distance between itemCoord and current user position
    return (Math.random() * 5).toFixed(1);
  }
  gotoChat(userId) {
    this.props.navigator.push({
      id: 'chat',
      passProps: {
        userId,
      },
    });
  }
  render() {
    let imagUri = '';
    if (this.props.product.image1 !== '') {
      imagUri = this.props.product.image1;
    } else if (this.props.product.image2 !== '') {
      imagUri = this.props.product.image2;
    } else if (this.props.product.image3 !== '') {
      imagUri = this.props.product.image3;
    }
    return (
      <View style={styles.productItemContainer}>
        <View style={[styles.productItemImage, { overflow: 'hidden' }]}>
          <TouchableHighlight
            style={styles.productItemImage}
            onPress={this.props.onPress}
          >
            <Image
              source={{ uri: imagUri }}
              style={styles.productItemImage}
            />
          </TouchableHighlight>
        </View>
        <View style={[styles.productItemInfo]}>
          <View style={[styles.productTitleTextContainer, { justifyContent: 'center' }]}>
            <Text style={styles.productTitleText}>{this.props.product.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeIcon} onPress={this.props.onDelete}>
          <Icon
            style={{ color: Colors.brandPrimary, fontSize: 26 }}
            name="ios-close-circle"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

ProductItem.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
  picture: React.PropTypes.string,
};
ProductItem.defaultProps = {
  onPress: () => { console.log('button_pressed'); },
  style: null,
  picture: 'https://s3.eu-central-1.amazonaws.com/uxa-develop/0.jpg',
};
