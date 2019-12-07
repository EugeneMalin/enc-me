import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { YMaps, Map as YMap, Placemark, SearchControl, GeolocationControl } from 'react-yandex-maps';
import { connect } from 'react-redux';
import socket from '../store/socket';
import { array } from 'prop-types';

const mapData = {
  center: [57.631285, 39.840864],
  zoom: 14,
  controls: []
};

const coordinates = [ // заглушка
  [57.631285, 39.840875],
  [57.631260, 39.840864]
];

const API_KEY = "0a2d7a02-6fe0-4f2b-b87b-c6afd3e44764";

class Map extends React.Component {
  constructor(props) {
    super(props);
    socket.emit('calcCoord', this.props.user.teamToken); // запрос на получение координат участников игры (TeamToken)
  }

  state = { 
    teammates: [] 
    // можно добавить имена
  }

  componentDidMount() { 
    // событие, возвращающее координаты игроков
    var self = this;
    socket.on('getTeamCoord', function (teammates) {
      self.setState(teammates) // возвращает массив координат [[], [], [], ...]
    });

  }

  render() {
    return (
      <View style={styles.container}>
        <YMaps enterprise query = {{apikey: API_KEY}}>
          <YMap style={StyleSheet.absoluteFillObject} defaultState={mapData}> 
            <SearchControl options={{ float: 'right', provider: 'yandex#map', noPlacemark: false }} />
            <GeolocationControl options={{ float: 'left', noPlacemark: false }} />
            {this.state.teammates.map(coordinate => <Placemark properties={{balloonContent: 'Some text'}} geometry={coordinate} />)}
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
