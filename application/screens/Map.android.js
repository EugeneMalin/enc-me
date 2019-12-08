import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions, 
} from 'react-native';
import { connect } from 'react-redux';
import socket from '../store/socket';
import Header from '../components/Header';
import MapView from 'react-native-maps';
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
    socket.emit('findTeammates', {sender: this.props.user}); // запрос на получение координат участников игры
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Header title='Game is active' subtitle='You can call help 8 (485) 230-85-49'/>
    };
  };

  state = { 
    teammates: [] 
    // можно добавить имена
  }

  componentDidMount() { // событие, возвращающее координаты игроков
    var self = this;
    socket.on('nearTeammates', function (teammates) {
      self.setState({teammates})
    });
  }

  render() {
    return ( // state.teammates вместо coordinates (done)
      <View style={styles.container}>
        <MapView style={styles.mapStyle}
          initialRegion={{
            latitude: 57.6305904,
            longitude: 39.8408816,
            latitudeDelta: 0.0231,
            longitudeDelta: 0.0111,
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: 57.6311242,
              longitude: 39.8409668
            }}
            pinColor={'red'}
            title={"jack"}
            description={"Jack Sparrow"}
          />
          <MapView.Marker
            coordinate={{
              latitude: 57.6311252,
              longitude: 39.8409658
            }}
            pinColor={'blue'}
            title={"kokuz"}
            description={"Николай"}
          />
        </MapView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const mapState = (state) => ({
  user: state.user
});

export default connect(mapState)(Map);
