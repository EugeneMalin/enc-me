import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { YMaps, Map as YMap, Placemark } from 'react-yandex-maps';
import { connect } from 'react-redux';

const mapData = {
  center: [57.631285, 39.840864],
  zoom: 14,
};

const coordinates = [
  [57.631285, 39.840875],
  [57.631260, 39.840864]
];

class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <YMaps>
          <YMap style={StyleSheet.absoluteFillObject} defaultState={mapData}>
            {coordinates.map(coordinate => <Placemark properties={{balloonContent: 'Some text'}} geometry={coordinate} />)}
          </YMap>
        </YMaps>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});


const mapState = (state) => ({
  user: state.user
});

export default connect(mapState)(Map);
