import React, { Component } from 'react';
import { Text, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, FormInput, FormLabel } from 'react-native-elements';
import Modal from 'react-native-root-modal';
import store from 'react-native-simple-store';
import Communications from 'react-native-communications';
// https://github.com/poberwong/react-native-switch-pro
import Switch from '@components/Switch';
import { popAgentModal, setUser, showShareView, setSpinnerVisible } from '@actions/globals';
import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { Styles, Fonts, Colors, Global } from '@theme/';
import styles from './styles';

let _this;
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      newOfferNear: false,
      newMessage: false,
      dataSource: [],
      dialogVisible: false,
    };
    _this = this;
  }
  componentWillMount() {
    this.setAgentArray(this.props.globals.user.user);
  }
  onOpenDialog(item) {
    this.props.popAgentModal(item);
    this.setState({ dialogVisible: true });
  }
  onContact() {
    Communications.email(['foodsaver@uxa-app.com'], null, null, 'UXA CONTACT', null);
  }
  onShare() {
    this.props.showShareView(true);
  }
  onCloseDialog(flag) {
    if (flag) {
      this.props.setSpinnerVisible(true);
      this.onDeleteAgent();
    }
    this.setState({ dialogVisible: false });
  }
  onDeleteAgent() {
    fetch(Global.API_URL + '/auth/del_agent', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        token: this.props.logins.token,
        agent: this.props.globals.agentModal,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    })
    .then((responseData) => {
      this.props.setSpinnerVisible(false);
      if (responseData === null) {
        this.props.setUser({});
      }
      this.props.setUser(responseData);
      this.setAgentArray(responseData.user)
    }).catch((error) => {
      console.log(error);
    })
    .done();
  }
  onLinking(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }
  setAgentArray(userProps) {
    const agentArray = [];
    if (userProps.search_agent1 !== '') {
      agentArray.push(userProps.search_agent1);
    }
    if (userProps.search_agent2 !== '') {
      agentArray.push(userProps.search_agent2);
    }
    if (userProps.search_agent3 !== '') {
      agentArray.push(userProps.search_agent3);
    }
    this.setState({
      dataSource: agentArray,
      name: userProps.name,
      email: userProps.email,
      newOfferNear: userProps.notification_offer === 1 ? true : false,
      newMessage: userProps.notification_message === 1 ? true : false,
    });
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
  logout() {
    this.props.setSpinnerVisible(true);
    store.get('device').then((device) => {
      fetch(Global.API_URL + '/auth/del_device', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          token: this.props.logins.token,
          device_id: device.userId,
        }),
      })
      .then(response => response.json())
      .then((responseData) => {
        this.props.setSpinnerVisible(false);
        if (responseData.status === 200) {
          console.log('device information was deleted');
        } else {
          console.log('device information was not deleted');
        }
        store.delete('token').then(() => {
          this.replaceRoute('login');
        });
      }).catch((error) => {
        this.props.setSpinnerVisible(false);
        console.log(error);
      })
      .done();
    }).catch((error) => {
      this.props.setSpinnerVisible(false);
      console.log(error);
      store.delete('token').then(() => {
        // this.props.setUser({});
        this.replaceRoute('login');
      });
    });
  }
  render() {
    const userProps = this.props.globals.user.user;
    userProps.name = this.state.name;
    userProps.notification_message = this.state.newMessage === true ? 1 : 0;
    userProps.notification_offer = this.state.newOfferNear === true ? 1 : 0;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.brandSecondary }}>
        <View style={styles.profileRowContainer}>
          <FormLabel labelStyle={styles.profileRowTitleText}>
            {I18n.t('NAME')}
          </FormLabel>
          <View style={styles.viewInputStyle}>
            <FormInput
              inputStyle={styles.profileRowContentText}
              containerStyle={styles.formInputStyle}
              underlineColorAndroid={'transparent'}
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
          </View>
        </View>
        <View style={styles.profileRowContainer}>
          <FormLabel labelStyle={styles.profileRowTitleText}>
            {I18n.t('EMAIL_ADDRESS')}
          </FormLabel>
          <FormInput
            inputStyle={styles.profileRowContentText}
            containerStyle={{ borderBottomWidth: 0 }}
            value={this.state.email}
            editable={false}
          />
        </View>
        <View style={styles.profileRowSeparatorContainer}>
          <Text style={styles.profileSeparatorText} >
            {I18n.t('ACTIVE_SEARCH_AGENTS')}
          </Text>
        </View>
        <View style={[styles.profileRowContainer, Styles.center, { flexDirection: 'row' }]}>
          {
            this.state.dataSource.length !== 0 ?
              this.state.dataSource.map(function (item) {
                return (
                  <View
                    style={[Styles.center, styles.agentListItem]}
                    key={item}
                  >
                    <Text style={[Fonts.style.description, { color: 'white' }]}>
                      {item}
                    </Text>
                    <Icon
                      raised
                      name={'md-close-circle'}
                      type={'font-awesome'}
                      color={Colors.brandSecondary}
                      size={20}
                      style={{ marginLeft: 5, marginTop: 2 }}
                      onPress={() => _this.onOpenDialog(item)}
                    />
                  </View>
                );
              })
              :
              (<Text style={styles.profileRowContentText}>{I18n.t('NO_AGENT')}</Text>)
          }
        </View>
        <View style={[styles.profileRowSeparatorContainer]}>
          <Text style={styles.profileSeparatorText} >
            {I18n.t('NOTIFICATIONS')}
          </Text>
        </View>
        <View style={[styles.profileRowContainer, styles.switchRowContainer, styles.underline]}>
          <Text style={styles.profileRowContentText}>
            {I18n.t('NEW_OFFER_NEAR')}
          </Text>
          <Switch
            backgroundActive={Colors.brandPrimary}
            onSyncPress={state => this.setState({ newOfferNear: state })}
            value={this.state.newOfferNear}
          />
        </View>
        <View style={[styles.profileRowContainer, styles.switchRowContainer]}>
          <Text style={styles.profileRowContentText}>
            {I18n.t('NEW_OFFER_MESSAGE')}
          </Text>
          <Switch
            backgroundActive={Colors.brandPrimary}
            onSyncPress={state => this.setState({ newMessage: state })}
            value={this.state.newMessage}
          />
        </View>
        <View style={[styles.profileRowSeparatorContainer]}>
          <Text style={styles.profileSeparatorText} >
            {I18n.t('ABOUT_UXA')}
          </Text>
        </View>

        <View style={[styles.profileRowContainer, styles.switchRowContainer, styles.underline]}>
          <Text style={styles.profileRowContentText}>
            {I18n.t('SHARE_UXA_APP')}
          </Text>
          <TouchableOpacity onPress={() => this.onShare()}>
            <Icon
              raised
              name={'md-share'}
              type={'font-awesome'}
              color={Colors.textDisabled}
              size={30}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.profileRowContainer, styles.switchRowContainer, styles.underline]}>
          <Text style={styles.profileRowContentText}>
            {I18n.t('FAQ')}
          </Text>
          <TouchableOpacity onPress={() => this.onLinking('http://uxa-app.com/faq.html')}>
            <Icon
              raised
              name={'ios-help-circle-outline'}
              type={'font-awesome'}
              color={Colors.textDisabled}
              size={30}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.profileRowContainer, styles.switchRowContainer, styles.underline]}>
          <Text style={styles.profileRowContentText}>
            {I18n.t('CONTACT_UXA')}
          </Text>
          <TouchableOpacity onPress={() => this.onContact()}>
            <Icon
              raised
              name={'ios-at-outline'}
              type={'font-awesome'}
              color={Colors.textDisabled}
              size={30}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.profileRowContainer, styles.switchRowContainer, styles.underline]}>
          <Text style={styles.profileRowContentText}>
            {I18n.t('TERMS_OF_USE')}
          </Text>
          <TouchableOpacity onPress={() => this.onLinking('http://uxa-app.com/datenschutz.html')}>
            <Icon
              raised
              name={'ios-create-outline'}
              type={'font-awesome'}
              color={Colors.textDisabled}
              size={30}
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 10 }} />
        <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 20 }} onPress={() => this.logout()}>
          <Text style={[Fonts.style.buttonText, { color: Colors.textDisabled }]}>
            {I18n.t('LOG_OUT')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>
          version 1.0
        </Text>
        <View style={{ height: 100 }} />
        <Modal visible={this.state.dialogVisible}>
          <View style={styles.modal}>
            <Text style={{ fontFamily: Fonts.type.bold }}>{I18n.t('SORRY')}</Text>
            <View style={{ height: 10 }} />
            <Text style={{ fontFamily: Fonts.type.bold }}>{I18n.t('DELETE_AGENT')}</Text>
            <View style={{ height: 20 }} />
            <View style={{ flexDirection: 'row' }}>
              <Button
                title={I18n.t('YES')}
                fontFamily={Fonts.type.bold}
                buttonStyle={{ borderRadius: 6, height: 30, backgroundColor: Colors.brandPrimary }}
                onPress={() => this.onCloseDialog(true)}
              />
              <Button
                title={I18n.t('NO')}
                fontFamily={Fonts.type.bold}
                buttonStyle={{ borderRadius: 6, height: 30 }}
                onPress={() => this.onCloseDialog(false)}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: route => dispatch(pushNewRoute(route)),
    replaceRoute: route => dispatch(replaceRoute(route)),
    popAgentModal: agentModal => dispatch(popAgentModal(agentModal)),
    setUser: user => dispatch(setUser(user)),
    showShareView: share => dispatch(showShareView(share)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  const logins = state.get('login');
  return { globals, logins };
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
