import React, { Fragment } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PermissionsAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapMarkerIcon from 'react-native-vector-icons/FontAwesome';

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// let LATITUDE_DELTA = 0.0922;
// let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let LATITUDE_DELTA = 0.002;
let LONGITUDE_DELTA = 0.005;
let currentRegion = {};

class PinNewLocation extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        let latitude = params.latitude ? params.latitude : 16.9239;
        let longitude = params.longitude ? params.longitude : 96.2270;
        this.state = {
            currentRegion: {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            map_top: 2,
        }
    }

    componentDidMount() {
        const latitude = this.state.currentRegion.latitude;
        if (latitude === 16.9239) {
            if (Platform.OS === 'android')
                this.requestPermission();
            else
                this.get_current_location();
        }

        setTimeout(() => this.setState({ map_top: 0 }), 500);
    }

    //request app permission
    requestPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(result => {
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    // if (!this.state.currentRegion.latitude) {
                    //     this.getCurrentLatLng();
                    // }
                    this.get_current_location();
                }
            });
    }


    // get user current lat and lng
    get_current_location = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                //   console.log(position);
                const { latitude, longitude } = position.coords;
                this.setState({
                    currentRegion: {
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                });
                currentRegion = {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    _onMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        this.setState({
            currentRegion: {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }
        });
    }

    _onRegionChangeComplete = (region) => {
        // console.log(region)
        LATITUDE_DELTA = region.latitudeDelta;
        LONGITUDE_DELTA = region.longitudeDelta;
        currentRegion = region;
    }

    set_location = () => {
        // const { currentRegion } = this.state;
        this.props.navigation.navigate('EditProfile', { currentRegion });
    }

    render() {

        const { currentRegion } = this.state;
        return (
            <View style={styles.container}>
                <View style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -40,
                    marginLeft: -11,
                    elevation: 5,
                    zIndex: 2
                }} >
                    <MapMarkerIcon name='map-pin' color='#222' size={40} />
                </View>
                <Map
                    // provider={PROVIDER_GOOGLE}
                    showsCompass={true}
                    // followsUserLocation={true}
                    showsMyLocationButton={true}
                    // showsScale={true}
                    // showsPointsOfInterest={true}
                    showsBuildings={true}
                    showsUserLocation={true}
                    // mapPadding={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    // zoomControlEnabled={true}
                    // cacheEnabled={true}
                    style={[styles.map, { marginBottom: this.state.map_top }]}
                    region={currentRegion}
                    //customMapStyle={mapStyle}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                    onMapReady={() => this.setState({ map_top: 0 })}
                >
                </Map>

                <TouchableOpacity style={styles.fabBtn} onPress={this.set_location}>
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Set Location</Text>
                </TouchableOpacity>

            </View>
        )

    }

}

export default connect(null)(PinNewLocation);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    textWrapper: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 10,
        width: '100%',
        alignSelf: 'stretch'
    },
    textInput: {
        padding: 10,
        color: '#000',
    },
    fabBtn: {
        width: '90%',
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        zIndex: 1,
        backgroundColor: '#F09839',
        elevation: 3
    }
})
