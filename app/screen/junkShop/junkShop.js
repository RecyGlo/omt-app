import React, { Fragment } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StatusBar,
    StyleSheet,
    PermissionsAndroid,
    Modal,
    Linking, Platform,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Map, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AddIcon from 'react-native-vector-icons/MaterialIcons';
import LocationIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from "react-native-vector-icons/FontAwesome";
import { get_junk_shop_list } from '../../redux/actions/junkShopAction';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';

let CURRENT_REGION = {};

class JunkShop extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentRegion: {
                latitude: 16.9239,
                longitude: 96.2270,
                latitudeDelta: 0.002,
                longitudeDelta: 0.005,
            },
            current_junk_shop: {},
            junk_shop_detail_modal: false,
            map_top: 0,
            toolbarHackHeight: 0,
            junk_shop_permission: false,
            selected_town: '',
            selected_ward: '',
            town_list: [],
            selected_category_contact_list: []
        }
    }

    componentDidMount() {
        if (this.props.user.type === 'ADMIN') {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminJunkShop')} >
                        <AddIcon name="history" size={25} color='#FFF' style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                ),
            });
        } else if (this.props.user.permission.junk_shop) {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('JunkShopAddedList')} >
                        <AddIcon name="history" size={25} color='#FFF' style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                ),
            });
        }
        if (Platform.OS === 'android')
            this.requestPermission();
        else
            this.get_current_location();
        this.props.get_junk_shop_list();
        // setTimeout(() => this.setState({ map_top: 0 }), 500);
    }

    filter_town(selected_town) {

        if (selected_town == '') {
            this.setState({
                currentRegion: {
                    latitude: 21.9162,
                    longitude: 95.9560,
                    latitudeDelta: 10,
                    longitudeDelta: 10,
                }, selected_town: selected_town, selected_ward: ''
            })
        } else {
            const { junk_shop_list } = this.props;
            const filtered_list = junk_shop_list.filter(i => {
                return i.town == selected_town
            });
            const region = filtered_list[0].list[0];


            this.setState({
                currentRegion: {
                    latitude: region.location.coordinate.lat,
                    longitude: region.location.coordinate.lng,
                    latitudeDelta: 0.3,
                    longitudeDelta: 0.3,
                }, selected_town: selected_town, selected_ward: ''
            })
        }
    }

    filter_ward(selected_ward) {
        const { selected_town } = this.state;
        const { junk_shop_list } = this.props;
        const filtered_list = junk_shop_list.filter(i => {
            return i.town == selected_town
        });
        const region = filtered_list[0].list.filter(i => {
            return i.ward == selected_ward
        });
        const ward_region = region[0];

        this.setState({
            currentRegion: {
                latitude: ward_region.location.coordinate.lat,
                longitude: ward_region.location.coordinate.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }, selected_ward: selected_ward
        })
    }

    //request app permission
    requestPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(result => {
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    this.get_current_location();
                } else {
                    alert('Please provide the location access to get nearby junk shops.')
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
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }
                });
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    make_call = (number) => {

        let phone_number = '';

        if (Platform.OS === 'android') {
            // phone_number = 'tel:${' + number + '}';
            phone_number = 'tel:' + number;
        } else {
            // phone_number = 'telprompt:${' + number + '}';
            phone_number = 'telprompt:' + number;
        }

        Linking.openURL(phone_number);
    }

    _onRegionChangeComplete = (region) => {
        // console.log(region)
        CURRENT_REGION = region;
    }

    junk_shop_detail = (junk_shop) => {
        // console.log(CURRENT_REGION);
        this.setState({ junk_shop_detail_modal: true, current_junk_shop: junk_shop, currentRegion: CURRENT_REGION });
        var heightDiff = 0.5 // we don't want to change the height too much so keep it small. I've noticed 0.5 works best, as opposed to 0.1 doesn't work at all, and 0.5 is barely noticeable to the user.
        // switch the height between 0 and 0.5 and back.
        this.setState({
            toolbarHackHeight: this.state.toolbarHackHeight == heightDiff ? this.state.toolbarHackHeight - heightDiff : this.state.toolbarHackHeight + heightDiff
        })
    }

    add_junk_shop() {
        this.props.navigation.navigate('AddJunkShop');
    }

    _toggleModel = () => {
        this.setState(state => {
            return {
                junk_shop_detail_modal: !state.junk_shop_detail_modal
            }
        });
    }

    render() {

        const { currentRegion, current_junk_shop, selected_town, selected_ward } = this.state;
        const { junk_shop_list } = this.props;
        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={styles.container}>
                    <Map
                        // provider={PROVIDER_GOOGLE}
                        showsCompass={true}
                        // followsUserLocation={true}
                        showsMyLocationButton={false}
                        showsScale={true}
                        // showsPointsOfInterest={true}
                        showsBuildings={true}
                        showsUserLocation={true}
                        toolbarEnabled={true}
                        // zoomControlEnabled={true}
                        // cacheEnabled={true}
                        // style={[styles.map, { marginBottom: this.state.map_top, marginTop: 0 - this.state.toolbarHackHeight }]}
                        style={[styles.map, { top: 0 - this.state.toolbarHackHeight }]}
                        // onMapReady={() => this.setState({ map_top: 0 })}
                        region={currentRegion}
                        onRegionChangeComplete={this._onRegionChangeComplete}
                    >

                        {
                            junk_shop_list.map((each_junk_shop) => {

                                return (

                                    selected_town == each_junk_shop.town || selected_town == '' ?


                                        each_junk_shop.list.map((m, index) => {

                                            return (

                                                <Marker
                                                    key={index}
                                                    draggable={false}
                                                    coordinate={{ latitude: m.location.coordinate.lat, longitude: m.location.coordinate.lng }}
                                                    title={m.name}
                                                    description={m.location.address}
                                                    onPress={() => this.junk_shop_detail(m)}
                                                    image={require('../../asset/image/recycle_location_pin.png')}
                                                // onDragEnd={(e) => alert(e.nativeEvent.coordinate)}
                                                >
                                                    {/* <Callout onPress={() => this.make_call(m.phoneNumber)}>
                                                        <View style={{ backgroundColor: '#FFF' }}>
                                                            {
                                                                m.image &&
        
                                                                <Image
                                                                    source={{ uri: m.image }}
                                                                    style={{ height: 200, width: 300, borderRadius: 10, marginBottom: 10 }} />
                                                            }
                                                            {
                                                                console.log(m.image)
                                                            }
                                                            <Text style={{ color: '#f09839', fontSize: 17, fontWeight: '700', marginBottom: 10 }}>{m.name}</Text>
                                                            {
                                                                m.phoneNumber &&
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }} >
                                                                    <Text style={{ color: '#222', fontSize: 15 }}>{m.phoneNumber}</Text>
                                                                    <PhoneIcon name='phone' color='#f09839' size={20} />
                                                                </View>
                                                            }
                                                            <Text style={{ color: '#222', fontStyle: 'italic', fontSize: 15, marginBottom: 20 }}>{m.location.address}</Text>
                                                        </View>
                                                    </Callout> */}
                                                </Marker>
                                            )
                                        })
                                        :
                                        null
                                )
                            })

                        }
                    </Map>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        style={{
                            position: 'absolute',
                            left: 10,
                            top: 10,
                            zIndex: 1,
                        }}>
                        {
                            selected_town == '' ?

                                <View key={0} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginRight: 10, height: 35 }}>
                                    <Text style={{ fontSize: 15, color: '#FFF', }}>All</Text>
                                </View>

                                :

                                <TouchableOpacity key={0} onPress={() => this.filter_town('')} style={{ backgroundColor: '#FFF', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, padding: 10, marginRight: 10, height: 35, elevation: 10 }}>
                                    <Text style={{ fontSize: 15, color: '#9E9E9E', }}>All</Text>
                                </TouchableOpacity>

                        }
                        {
                            junk_shop_list.length > 0 ?

                                junk_shop_list.map((each_junk_shop,) => {

                                    if (selected_town == each_junk_shop.town) {

                                        return (
                                            <View key={each_junk_shop.id} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginRight: 10, height: 35 }}>
                                                <Text style={{ fontSize: 15, color: '#FFF', }}>{each_junk_shop.town}</Text>
                                            </View>
                                        )

                                    } else {
                                        return (
                                            <TouchableOpacity key={each_junk_shop.id} onPress={() => this.filter_town(each_junk_shop.town)} style={{ backgroundColor: '#FFF', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, padding: 10, marginRight: 10, height: 35, elevation: 10 }}>
                                                <Text style={{ fontSize: 15, color: '#9E9E9E', }}>{each_junk_shop.town}</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                })
                                :
                                null

                        }

                    </ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
                        position: 'absolute',
                        left: 10,
                        top: 50,
                        zIndex: 1,
                    }}>
                        {
                            junk_shop_list.length > 0 ?

                                junk_shop_list.map((each_junk_shop,) => {

                                    if (selected_town == each_junk_shop.town) {

                                        if (each_junk_shop.ward.length > 1)

                                            return (
                                                each_junk_shop.ward.map((each_ward, index) => {
                                                    if (selected_ward == each_ward) {

                                                        return (
                                                            <View key={index} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginRight: 10, height: 35 }}>
                                                                <Text style={{ fontSize: 15, color: '#FFF', }}>{each_ward}</Text>
                                                            </View>
                                                        )

                                                    } else {
                                                        return (
                                                            <TouchableOpacity key={index} onPress={() => this.filter_ward(each_ward)} style={{ backgroundColor: '#FFF', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, padding: 10, marginRight: 10, height: 35, elevation: 10 }}>
                                                                <Text style={{ fontSize: 15, color: '#9E9E9E', }}>{each_ward}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                })
                                            )
                                    }

                                })
                                :
                                null

                        }

                    </ScrollView>
                    {/* {

                        Platform.OS === 'ios' && */}
                    <TouchableOpacity style={{
                        borderRadius: 5,
                        position: 'absolute',
                        left: 20,
                        bottom: 30,
                        zIndex: 1,
                        backgroundColor: '#fff',
                        elevation: 5,
                        padding: 5
                    }} onPress={() => this.get_current_location()}>
                        <LocationIcon name="my-location" color="#222" size={25} />
                    </TouchableOpacity>
                    {/* } */}
                    {

                        this.props.user.permission.junk_shop &&
                        <TouchableOpacity style={{
                            height: 50,
                            borderRadius: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: 15,
                            zIndex: 1,
                            backgroundColor: '#f09839',
                            padding: 10,
                            flexDirection: 'row',
                            elevation: 5
                        }} onPress={() => this.add_junk_shop()}>
                            <Icon name="plus-circle" color="#fff" size={25} />
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 10 }}>Add Junk Shop</Text>
                        </TouchableOpacity>
                    }
                    <Modal
                        animationType='none' visible={this.state.junk_shop_detail_modal} transparent onRequestClose={this._toggleModel} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 55, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, paddingHorizontal: 20, paddingVertical: 10 }} >
                                {
                                    current_junk_shop.image &&
                                    <Image
                                        source={{ uri: current_junk_shop.image }}
                                        style={{ height: 200, borderRadius: 10, marginBottom: 10 }} />
                                }
                                <Text style={{ color: '#f09839', fontSize: 17, fontWeight: '700', marginBottom: 10 }}>{current_junk_shop.name}</Text>
                                {
                                    this.props.user.type != 'CUSTOMER' &&
                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }} onPress={() => this.make_call(current_junk_shop.phoneNumber)}>
                                        <Text style={{ color: '#222', fontSize: 15 }}>{current_junk_shop.phoneNumber}</Text>
                                        <PhoneIcon name='phone' color='#f09839' size={20} />
                                    </TouchableOpacity>
                                }
                                <Text style={{ color: '#222', fontStyle: 'italic', fontSize: 15, marginBottom: 20 }}>{current_junk_shop.location?.address}</Text>
                                <TouchableHighlight onPress={this._toggleModel} style={{ alignSelf: 'flex-end', padding: 10 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Fragment >
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    junk_shop_list: state.junk_shop.junk_shop_list,
})

const mapDispatchToProps = dispatch => ({
    get_junk_shop_list: () => {
        dispatch(get_junk_shop_list());
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(JunkShop);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        // justifyContent: 'flex-end',
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
    fabSearchBtn: {
        // width: 150,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        // left: 50,
        top: 10,
        zIndex: 1,
        backgroundColor: '#F09839',
        elevation: 3,
        flexDirection: 'row',
        padding: 10
    },
    fabAddBtn: {
        width: 150,
        height: 50,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        // right: '50%',
        bottom: 10,
        zIndex: 1,
        backgroundColor: '#FFF',
        elevation: 3,
        padding: 10
    },
    modal: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        left: 20,
        elevation: 3,
        padding: 10
    }
})
