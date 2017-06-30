import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Camera from 'react-native-camera';
import Permissions from 'react-native-permissions';
import I18n from 'react-native-i18n';

import ImageResizer from 'react-native-image-resizer';
import Spinner from '@components/OverlaySpinner';
import Gallery from '@components/Gallery/';
import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { setPreRoute, setSpinnerVisible } from '@actions/globals';
import { Styles, Colors, Global } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

let permissionPhoto = '';
let permissionCamera = '';
class TakeItemPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
      viewLoading: false,
      selected: [],
    };
  }
  componentWillMount() {
    this.checkPemission();
    setTimeout(() => {
      this.setState((previousState) => {
        if (!previousState.viewLoading) {
          return { viewLoading: true };
        }
        return { viewLoading: false };
      });
    }, 300);
  }
  getSelectedImages(images, current) {
    if (images.length > 0) {
      this.setImage(Utils.getUri(images[0].uri));
    } else {
      this.setImage(null);
    }
  }
  setImage(imgUri) {
    this.props.setSpinnerVisible(true);
    if (imgUri === null) {
      this.setState({ imageUri: null });
      this.props.setSpinnerVisible(false);
      return;
    }
    ImageResizer.createResizedImage(imgUri, 800, 600, 'JPEG', 80)
    .then((resizedImageUri) => {
      this.props.setSpinnerVisible(false);
      this.setState({
        imageUri: resizedImageUri,
      });
    }).catch((err) => {
      this.props.setSpinnerVisible(false);
      return Utils.toast('@Unable to resize the photo', err);
    });
    // this.setState({ imageUri: imgUri });
  }
  checkPemission() {
    if (Platform.OS === 'ios') {
      Permissions.getPermissionStatus('photo')
        .then((response) => {
          permissionPhoto = response;
          console.log('---------------', response);
          if (permissionPhoto === 'denied') {
            this.alertForPhotosPermission();
          }
        });
      Permissions.getPermissionStatus('camera')
        .then((response) => {
          permissionCamera = response;
          if (permissionPhoto !== 'denied' && permissionCamera === 'denied') {
            this.alertForPhotosPermission();
          }
        });
    } else {
      permissionCamera = 'authorized';
    }
  }
  alertForPhotosPermission() {
    Alert.alert(
      I18n.t('CAN_ACCESS_PHOTO_TITLE'),
      I18n.t('CAN_ACCESS_PHOTO_BODY'),
      [
        { text: I18n.t('NO_WAY'), onPress: () => console.log('permission denied'), style: 'cancel' },
        { text: I18n.t('OPEN_SETTING'), onPress: Permissions.openSettings },
      ]);
  }
  takePicture() {
    this.camera.capture()
      .then(data => this.setImage(Utils.getUri(data.path)))
      .catch(err => this.setImage(null));
  }

  refreshGallery() {
    Global.OfferImages.splice(Global.OfferImages.length - 1, 1);
    this.setImage(null);
    this.props.setSpinnerVisible(true);
    this.refs['gallery'].refresh();
    this.props.setSpinnerVisible(false);
  }

  popRoute() {
    Global.TMP_NAME = '';
    Global.TMP_DESC = '';
    Global.TMP_DATE = new Date();
    Global.TMP_CATEGORY = 0;
    this.props.popRoute();
  }
  pushNewRoute(route) {
    this.props.pushNewRoute(route);
  }
  replaceRoute(route) {
    this.props.replaceRoute(route);
  }
  gotoStartOffer() {
    Global.OfferImages.push(this.state.imageUri);
    if (Global.OfferImages.length > 1) {
      this.props.setPreRoute('takephoto');
      this.props.popRoute();
    } else {
      this.replaceRoute('startoffer');
    }
  }
  render() {
    const backButton =
      (<TouchableOpacity onPress={() => this.popRoute()} style={Styles.topLeftButton}>
        <Icon
          raised
          name={'ios-arrow-back'}
          type={'font-awesome'}
          color={Colors.brandPrimary}
          size={40}
        />
      </TouchableOpacity>);
    const refreshButton = this.state.imageUri != null ?
      (<TouchableOpacity onPress={() => this.refreshGallery()} style={Styles.topRightButton}>
        <Icon
          raised
          name={'md-sync'}
          type={'font-awesome'}
          color={Colors.brandPrimary}
          size={30}
        />
      </TouchableOpacity>)
      :
      <View />;
    const captureButton = this.state.imageUri == null ?
      (<TouchableOpacity
        onPress={() => this.takePicture()}
        style={[Styles.center, styles.captureButtonContainer]}
      >
        <View style={styles.captureButton} />
      </TouchableOpacity>)
      :
      (<TouchableOpacity
        onPress={() => this.gotoStartOffer()}
        style={[Styles.center, styles.captureButtonContainer]}
      >
        <Icon
          raised
          name={'md-checkmark'}
          type={'font-awesome'}
          color={Colors.brandSecondary}
          size={40}
        />
      </TouchableOpacity>);
    let imageView = <View />;
    if (this.state.imageUri === null && permissionCamera !== 'denied') {
      imageView = (<Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}
      >
        {captureButton}
      </Camera>);
    } else if (this.state.imageUri === null && permissionCamera === 'denied') {
      imageView = <View />;
    } else {
      imageView = (<Image
        source={{ uri: this.state.imageUri }}
        style={styles.preview}
      >
        {captureButton}
      </Image>);
    }
    return (
      <View style={[Styles.fullScreen, { backgroundColor: 'black' }]} >
        <View style={{ flex: 8, backgroundColor: '#3005' }}>
          {
            this.state.viewLoading ? imageView : <View />
          }
          {backButton}
          {refreshButton}
        </View>
        <View style={{ flex: 2, backgroundColor: '#eef5e9' }}>
          {
            this.state.viewLoading ? (
              <Gallery
                ref={'gallery'}
                scrollRenderAheadDistance={500}
                initialListSize={1}
                pageSize={3}
                removeClippedSubviews={false}
                groupTypes={'SavedPhotos'}
                batchSize={5}
                maximum={1}
                selected={this.state.selected}
                assetType={'Photos'}
                imagesPerRow={3}
                imageMargin={5}
                callback={(images, current) => this.getSelectedImages(images, current)}
              />
            ) : null
          }
        </View>
        <Spinner visible={this.props.globals.spinnerVisible} />
      </View>
    );
  }
}

TakeItemPhoto.propTypes = {
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
    setPreRoute: route => dispatch(setPreRoute(route)),
    setSpinnerVisible: spinnerVisible => dispatch(setSpinnerVisible(spinnerVisible)),
  };
}
function mapStateToProps(state) {
  const globals = state.get('globals');
  return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(TakeItemPhoto);
