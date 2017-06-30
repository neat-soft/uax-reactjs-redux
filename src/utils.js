import React, { Component } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-simple-toast';

const Utils = {
  getUri(uriString) {
    let retUri;
    if (Platform.OS === 'android') {
      retUri = { uri: uriString, isStatic: true };
    } else {
      retUri = { uri: uriString.replace('file://', ''), isStatic: true };
    }
    return retUri.uri;
  },
  getStringFromDate(date) {
    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return day + '/' + month + '/' + year;
  },
  getDateFromString(date) {
    const tmpForDate = date.split('/');
    // const tmpForMonth = tmpForDate[1].split('.');
    return new Date(tmpForDate[2], tmpForDate[1], tmpForDate[0]);
  },
  clone(obj) {
    if (obj == null || typeof obj !== 'object') return obj;
    const copy = obj.constructor();
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  },
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  getDateByConvertingFormat(dateString) {
    // 2016-10-04 14:53:15
    // yyyy/MM/dd HH:mm:ss
    let tmpArr = [];
    let tmpDate = [];
    tmpArr = dateString.split(' ');
    tmpDate = tmpArr[0].split('-');
    // tmpTime = tmpArr[1].split(':');
    return new Date(tmpDate[0] + '/' + tmpDate[1] + '/' + tmpDate[2] + ' ' + tmpArr[1]);
  },
  toast(message) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Toast.show(message);
    }
  },
};

export default Utils;
