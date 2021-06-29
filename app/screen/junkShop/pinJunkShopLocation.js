import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    PermissionsAndroid,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LocationIcon from 'react-native-vector-icons/MaterialIcons';
import MapMarkerIcon from 'react-native-vector-icons/FontAwesome';


// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// let LATITUDE_DELTA = 0.0922;
// let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let LATITUDE_DELTA = 0.002;
let LONGITUDE_DELTA = 0.005;
let currentRegion = {};

class PinJunkShopLocation extends React.PureComponent {

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

    _onRegionChangeComplete = (region) => {
        // console.log(region)
        LATITUDE_DELTA = region.latitudeDelta;
        LONGITUDE_DELTA = region.longitudeDelta;
        currentRegion = region;
    }

    set_location = () => {
        // const { currentRegion } = this.state;
        let { from } = this.props.route.params;
        if (from == 'add_junk_shop') {
            this.props.navigation.navigate('AddJunkShop', { currentRegion });
        } else if (from == 'edit_junk_shop') {
            this.props.navigation.navigate('EditJunkShop', { currentRegion });
        }
    }

    render() {

        const { currentRegion, marker } = this.state;
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
                    {/* <Image source={require('../../asset/image/recycle_location_pin.png')} style={{ width: 50, height: 50 }} /> */}
                    <MapMarkerIcon name='map-pin' color='green' size={40} />
                </View>
                <Map
                    // provider={PROVIDER_GOOGLE}
                    showsCompass={true}
                    showsMyLocationButton={true}
                    showsBuildings={true}
                    showsUserLocation={true}
                    // zoomControlEnabled={true}
                    // cacheEnabled={true}
                    style={[styles.map, { marginBottom: this.state.map_top }]}
                    onMapReady={() => this.setState({ map_top: 0 })}
                    region={currentRegion}
                    onRegionChangeComplete={this._onRegionChangeComplete}
                >
                </Map>

                {

                    Platform.OS === 'ios' &&
                    <TouchableOpacity style={{
                        borderRadius: 5,
                        position: 'absolute',
                        right: 10,
                        top: 50,
                        zIndex: 1,
                        backgroundColor: '#fff',
                        elevation: 5,
                        padding: 5
                    }} onPress={() => this.get_current_location()}>
                        <LocationIcon name="my-location" color="#222" size={25} />
                    </TouchableOpacity>
                }

                <TouchableOpacity style={styles.fabBtn} onPress={this.set_location}>
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Set Location</Text>
                </TouchableOpacity>

            </View>
        )
    }

}

export default connect(null)(PinJunkShopLocation);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        backgroundColor: '#f09839',
        elevation: 3
    }
})
