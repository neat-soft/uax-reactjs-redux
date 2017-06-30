import React, { Component } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { Images } from '@theme/';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  marker: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 43,
  },
  selectedView: {
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ImageItem extends Component {

  componentWillMount() {
    let { width } = Dimensions.get('window');
    const { imageMargin, imagesPerRow, containerWidth } = this.props;

    if (typeof containerWidth !== 'undefined') {
      width = containerWidth;
    }
    this._imageSize = (width - ((imagesPerRow + 1) * imageMargin)) / imagesPerRow;
  }
  _handleClick(item) {
    this.props.onClick(item);
  }
  render() {
    const { item, selected, selectedMarker, imageMargin } = this.props;
    const marker = selectedMarker ? selectedMarker :
      (<View style={[styles.selectedView, { height: this._imageSize, width: this._imageSize }]}>
        <Icon
          style={styles.marker}
          name="ios-checkmark-circle-outline"
        />
      </View>);

    const image = item.node.image;

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={() => this._handleClick(image)}
      >
        <Image
          source={{ uri: image.uri }}
          style={{ height: this._imageSize, width: this._imageSize }}
        >
          { (selected) ? marker : null }
        </Image>
      </TouchableOpacity>
    );
  }
}

ImageItem.defaultProps = {
  item: {},
  selected: false,
};

ImageItem.propTypes = {
  item: React.PropTypes.object,
  selected: React.PropTypes.bool,
  selectedMarker: React.PropTypes.element,
  imageMargin: React.PropTypes.number,
  imagesPerRow: React.PropTypes.number,
  onClick: React.PropTypes.func,
};

export default ImageItem;
