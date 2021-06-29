import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    PermissionsAndroid,
    TouchableOpacity,
    TextInput,
    Button,
    Text
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import Map, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import Icons from 'react-native-vector-icons/FontAwesome';

export default class AttachLocation extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Add Location",
            headerStyle: {
                elevation: 0,
                backgroundColor: '#f09839',
            },
            headerTitleStyle: {
                fontWeight: '700',
            },
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            latitude: 16.9239,
            longitude: 96.2270,
            latitudeDelta: 1,
            longitudeDelta: 1,
            search: "",
            places: []
        }
    }

    componentDidMount() {
        this.requestPermission();
    }

    //request app permission
    requestPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(result => {
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getCurrentLatLng();
                }
            });
    }

    //get user current lat and lng
    getCurrentLatLng = () => {
        RNGooglePlaces.getCurrentPlace()
            .then((results) => {
                const { latitude, longitude } = results.location;
                this.setState({ latitude, longitude });
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    onSearchChange = (text) => {
        this.setState({
            search: text
        }, () => this.getAutoComplete(text));
    }

    //get autocomplete data
    getAutoComplete = (text) => {
        RNGooglePlaces.getAutocompletePredictions(text)
            .then((results) => {
                console.log("res", results)
                this.setState({ places: results });
            })
            .catch((error) => console.log(error.message));
    }

    //render Places
    renderPlaces() {
        RNGooglePlaces
            .openAutocompleteModal()
            .then((places) => {
                console.log(places)
                this.setState({ places: places });
            }).catch(error => console.log(error.message))
    }

    getPlacesByLatAndLng = (lat, lng) => {
        Geocoder.geocodePosition({ lat, lng })
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    onMapPress = (e) => {
        const latitude = e.nativeEvent.coordinate.latitude;
        const longitude = e.nativeEvent.coordinate.longitude;

        this.setState({
            latitude: latitude,
            longitude: longitude
        }, () => this.getPlacesByLatAndLng(latitude, longitude));
    }

    render() {
        const { latitude, longitude, latitudeDelta, longitudeDelta, search, places } = this.state;

        var mapStyle = [
            {
                "elementType": "geometry",
                "stylers": [{ "color": "#242f3e" }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#746855" }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#242f3e" }]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry", "stylers": [{ "color": "#263c3f" }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry", "stylers": [{ "color": "#38414e" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }]
            },
            {
                "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }]
            },
            {
                "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }]
            },
            {
                "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }]
            },
            {
                "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }]
            },
            {
                "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }]
            },
            {
                "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }]
            },
            {
                "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }]
            },
            {
                "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }]
            },
            {
                "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }]
            }
        ];

        return (
            <View style={styles.container}>
                <Map
                    style={styles.map}
                    region={{
                        latitude,
                        longitude,
                        latitudeDelta,
                        longitudeDelta
                    }}
                    //customMapStyle={mapStyle}
                    onPress={this.onMapPress}>
                    <Marker
                        draggable={true}
                        coordinate={{ latitude, longitude }}
                    />
                </Map>

                <TouchableOpacity style={styles.fabBtn} onPress={this.renderPlaces}>
                    <Icons name="search" color="#000" size={20} />
                </TouchableOpacity>
            </View>
        )
    }
};



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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        zIndex: 1,
        backgroundColor: '#FFF',
        elevation: 3
    }
})



