import React, { Component } from 'react';
import { View, Image, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from 'react-native-i18n';
import { Fonts, Colors, Global } from '@theme/';
import RTM from '@src/rtm';
import { Button } from 'react-native-elements';
import styles from './styles';

export default class ProductItem extends Component {
  gotoChat(userId, productId) {
    this.props.spinnerShow(true);
    const formdata = new FormData();
    formdata.append('token', this.props.token);
    formdata.append('UserId', userId);
    formdata.append('ProductId', productId);
    fetch(Global.API_URL + '/channel/_set', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.status_code === 200) {
        this.loadChannel(userId, productId);
      } else {
        console.log('product big item error:', responseData.message);
      }
    }).catch((error) => {
      this.props.spinnerShow(false);
    })
    .done();
  }
  loadChannel(userId, productId) {
    const formdata = new FormData();
    formdata.append('token', this.props.token);
    formdata.append('OtherUserId', userId);
    formdata.append('ProductId', productId);
    fetch(Global.API_URL + '/channel/_get_channel_id', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formdata,
    })
    .then(response => response.json())
    .then((responseData) => {
      this.props.spinnerShow(true);
      if (responseData.status_code === 200) {
        if (responseData.Block === 0) {
          Global.channelId = responseData.channelId.toString();
          if (Global.RTM_CONNECTED === true) {
            RTM.RTIsSubscribed(Global.channelId, function (result) {
              if (result === true) {
                console.log(Global.channelId + ' is subscribed');
              } else {
                RTM.RTSubscribe(Global.channelId, true);
              }
            });
          } else {
            this.props.spinnerShow(false);
            return;
          }
          this.gotoChatDetail(userId, this.props.product.user_name, this.props.product.user_image, this.props.product.id);
        } else {
          this.props.spinnerShow(false);
        }
      } else {
        this.props.spinnerShow(false);
        console.log('error--productItemBig.js-1-');
      }
    }).catch((error) => {
      this.props.spinnerShow(false);
      console.log('error--productItemBig.js-2-', error);
    })
    .done();
  }
  gotoChatDetail(userId, userName, userAvatar, productId) {
    this.props.spinnerShow(false);
    this.props.navigator.push({
      id: 'chat',
      passProps: {
        userId,
        userName,
        userAvatar,
        productId,
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
        <View style={styles.productItemInfo}>
          <View style={styles.productTitleTextContainer}>
            <Text style={styles.productTitleText} numberOfLines={1}>{this.props.product.name}</Text>
          </View>
          {this.props.userId !== this.props.product.user_id ?
            (
              <View style={styles.bottomArea}>
                <View style={styles.kmView}>
                  <Icon
                    name="md-pin"
                    size={16}
                    color={Colors.textDisabled}
                    style={{ color: Colors.textSecondary }}
                  />
                  <Text style={styles.kmText}>
                    {Math.floor(this.props.product.distance * 10) / 10}{I18n.t('KM')}
                  </Text>
                </View>
                <Button
                  title={I18n.t('SEND_MESSAGE')}
                  fontSize={Fonts.size.mini}
                  fontFamily={Fonts.type.base}
                  borderRadius={20}
                  buttonStyle={styles.sendMsgBtn}
                  onPress={() => this.gotoChat(this.props.product.user_id, this.props.product.id)}
                />
              </View>
            ) : (<View style={styles.bottomArea} />)
          }
        </View>
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
