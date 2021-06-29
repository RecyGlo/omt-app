import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Text,
    Modal,
    StatusBar,
    StyleSheet,
    Button,
    Linking, Platform,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import AddressIcon from 'react-native-vector-icons/Entypo';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import PersonIcon from 'react-native-vector-icons/MaterialIcons';
import AccountIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import { get_junk_shop_detail, change_approve_status, delete_junk_shop } from '../../redux/actions/junkShopAction';

class JunkShopDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        let junk_shop = this.props.route.params.item;
        this.state = {
            junk_shop_id: junk_shop._id,
            show_loading: true,
            added_by_details_modal: false,
            delete_junk_shop_modal_visibility: false,
        }
    }

    componentDidMount() {
        this.props.get_junk_shop_detail(this.state.junk_shop_id);
        setTimeout(() => this.setState({ show_loading: false }), 500);
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

    change_status = (status) => {
        const { junk_shop_detail, user } = this.props;
        let previous_status = junk_shop_detail.approve_status;

        junk_shop_detail.added_by = junk_shop_detail.added_by._id;
        junk_shop_detail.approve_status = status;
        junk_shop_detail.approve_by = user._id;
        let data = new FormData();
        data.append('data', JSON.stringify(junk_shop_detail));

        this.props.change_approve_status(junk_shop_detail._id, data, previous_status);
    }

    delete_junk_shop() {
        const { junk_shop_detail, user } = this.props;
        let previous_status = junk_shop_detail.approve_status;

        this.toggle_delete_junk_shop();

        if (user.type === 'ADMIN') {
            this.props.delete_junk_shop(junk_shop_detail._id, previous_status, () => this.props.navigation.goBack());
        } else {
            this.props.delete_junk_shop(junk_shop_detail._id, 'ADDED', () => this.props.navigation.goBack());
        }


    }

    toggle_delete_junk_shop = () => {
        this.setState(state => {
            return {
                delete_junk_shop_modal_visibility: !state.delete_junk_shop_modal_visibility
            }
        });
    }

    render() {

        const { added_by_details_modal, show_loading } = this.state;
        const { junk_shop_detail } = this.props;

        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                {
                    show_loading ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={50} color='#F09839' />
                        </View>

                        :
                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ margin: 10, borderRadius: 5, borderWidth: 1, borderColor: '#f09839', padding: 10 }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ color: '#222', flex: 0.7 }}>Added By</Text>
                                    <View style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: '#222', flex: 1.3, fontSize: 17, fontWeight: '600' }}>{junk_shop_detail.added_by.name}</Text>
                                        <TouchableOpacity onPress={this.toggle_added_by_details_modal}>
                                            <AccountIcon name='card-account-details-outline' color='#f09839' size={25} style={{ textAlign: "right" }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ color: '#222', flex: 0.7 }}>Status</Text>
                                    <View style={{ flex: 1.3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ backgroundColor: '#009688', color: '#FFF', fontWeight: 'bold', padding: 5, borderRadius: 5 }}>{junk_shop_detail.approve_status}</Text>
                                        {
                                            junk_shop_detail.approve_status != 'APPROVED' || this.props.user.type == 'ADMIN' ?
                                                <TouchableOpacity style={{ textAlign: "right" }} onPress={this.toggle_delete_junk_shop}>
                                                    <DeleteIcon name='delete' color='red' size={20} />
                                                </TouchableOpacity>

                                                :
                                                null
                                        }
                                    </View>
                                </View>
                                <View style={{ borderColor: '#E0E0E0', borderTopWidth: 1, }} />
                                <View style={{ flexDirection: 'row', marginVertical: 20, }}>
                                    <Image
                                        source={{ uri: junk_shop_detail.image }}
                                        style={{ width: 80, height: 120, borderRadius: 10 }} />
                                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, justifyContent: 'space-between', padding: 5 }}>
                                        <Text style={{ color: '#f09839', fontSize: 17, fontWeight: '700' }}>{junk_shop_detail.name}</Text>
                                        {
                                            junk_shop_detail.phoneNumber &&
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => this.make_call(junk_shop_detail.phoneNumber)}><Text style={{ color: '#222', fontSize: 14 }}>{junk_shop_detail.phoneNumber}</Text><PhoneIcon name='phone' color='#f09839' size={20} /></TouchableOpacity>
                                        }
                                        <Text style={{ color: '#222', fontStyle: 'italic', fontSize: 14 }}>{junk_shop_detail.location.address}</Text>
                                    </View>
                                </View>
                                <MapView
                                    // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                    style={styles.map}
                                    region={{
                                        latitude: junk_shop_detail.location.coordinate.lat,
                                        longitude: junk_shop_detail.location.coordinate.lng,
                                        latitudeDelta: 0.00315,
                                        longitudeDelta: 0.00421,
                                    }}
                                >
                                    <Marker
                                        draggable={false}
                                        coordinate={{
                                            latitude: junk_shop_detail.location.coordinate.lat,
                                            longitude: junk_shop_detail.location.coordinate.lng,
                                        }}
                                    >
                                        <Image source={require('../../asset/image/recycle_location_pin.png')} style={{ width: 40, height: 40 }} />
                                    </Marker>
                                </MapView>

                            </View>

                            {
                                this.props.user.type === 'ADMIN' ?

                                    <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity style={{
                                            height: 45,
                                            elevation: 5,
                                            backgroundColor: '#fff',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                        }} onPress={() => this.props.navigation.navigate('EditJunkShop', { 'item': junk_shop_detail, })}>
                                            <Text style={{ color: '#f09839', fontSize: 15 }}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            height: 45,
                                            borderWidth: 1,
                                            borderColor: '#f09839',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            marginHorizontal: 10
                                        }} onPress={() => this.change_status('REJECTED')}>
                                            <Text style={{ color: '#f09839', fontSize: 15 }}>Reject</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            height: 45,
                                            backgroundColor: '#f09839',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1
                                        }} onPress={() => this.change_status('APPROVED')}>
                                            <Text style={{ color: '#FFF', fontSize: 15 }}>Approve</Text>
                                        </TouchableOpacity>
                                    </View>

                                    :

                                    junk_shop_detail.approve_status != 'APPROVED' ?

                                        <TouchableOpacity style={{
                                            height: 45,
                                            backgroundColor: '#f09839',
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            margin: 10
                                        }} onPress={() => this.props.navigation.navigate('EditJunkShop', { 'item': junk_shop_detail, })}>
                                            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Edit</Text>
                                        </TouchableOpacity>

                                        :

                                        null

                            }
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={added_by_details_modal}
                                onRequestClose={this.toggle_added_by_details_modal}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ borderRadius: 15, backgroundColor: '#222', padding: 20, width: 300 }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                            <Image
                                                source={{ uri: junk_shop_detail.added_by.profileImage }}
                                                style={{ width: 150, height: 150, borderRadius: 30 }} />
                                        </View>
                                        <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}><PersonIcon name='person' color='#4CAF50' size={22} /><Text style={{ color: '#FFF', padding: 5, marginLeft: 2, fontSize: 15 }}>{junk_shop_detail.added_by.name}</Text></View>
                                            <TouchableOpacity onPress={() => this.make_call(junk_shop_detail.added_by.phoneNumber)}><View style={{ flexDirection: 'row', alignItems: 'center' }}><PhoneIcon name='phone' color='#4CAF50' size={20} /><Text style={{ color: '#FFF', padding: 5, marginLeft: 5, fontSize: 15 }}>{junk_shop_detail.added_by.phoneNumber}</Text><PhoneIcon name='mobile-phone' color='#2196F3' size={20} style={{ position: 'absolute', right: 5 }} /></View></TouchableOpacity>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}><AddressIcon name='address' color='#4CAF50' size={20} /><Text style={{ color: '#FFF', padding: 5, marginLeft: 5, fontSize: 15 }}>{junk_shop_detail.added_by.location.address}</Text></View>
                                        </View>
                                        <View style={{ borderColor: '#FFF', borderTopWidth: 1, marginBottom: 10 }} />
                                        <Button style={{ width: 20, textAlign: 'right' }} title="OK" onPress={this.toggle_added_by_details_modal} />
                                    </View>
                                </View>
                            </Modal>
                            <Modal animationType="none" visible={this.state.delete_junk_shop_modal_visibility} transparent={true} onRequestClose={this.toggle_delete_junk_shop} >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                                        <View style={{ marginBottom: 20, }}>
                                            <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Confirm Delete!</Text>
                                        </View>
                                        <View style={{ marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 16 }}>Are you sure you want to delete this junk shop?</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', height: 50 }}>
                                            <TouchableHighlight onPress={this.toggle_delete_junk_shop} style={{ width: '50%', justifyContent: 'center', padding: 5 }} underlayColor={'#f1f1f1'}>
                                                <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>CANCEL</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight onPress={() => this.delete_junk_shop()} style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end', padding: 5 }} underlayColor={'#f1f1f1'}>
                                                <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </ScrollView>
                }
            </Fragment >
        )
    }


    toggle_added_by_details_modal = () => {
        this.setState(state => {
            return {
                added_by_details_modal: !state.added_by_details_modal
            }
        });
    }

}


const mapStateToProps = state => ({
    user: state.user.user,
    junk_shop_detail: state.junk_shop.junk_shop_detail
})

const mapDispatchToProps = dispatch => ({
    get_junk_shop_detail: (junk_shop_id) => {
        dispatch(get_junk_shop_detail(junk_shop_id));
    },
    change_approve_status: (junk_shop_id, data, previous_status) => {
        dispatch(change_approve_status(junk_shop_id, data, previous_status));
    },
    delete_junk_shop: (junk_shop_id, previous_status, callback) => {
        dispatch(delete_junk_shop(junk_shop_id, previous_status, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(JunkShopDetail);

let styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    txtInput: {
        height: 45,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#222222",
        borderRadius: 3,
        marginBottom: 10
        // backgroundColor: 'rgba(25, 30, 31,0.5)',
    },
    iconStyle: {
        fontSize: 25,
        marginLeft: 25,
        color: '#ffffff'
    },
    circleIcon: {
        fontSize: 25,
        color: '#FFEB3B'
    },
    image: {
        resizeMode: 'cover',
        marginBottom: 10,
        width: 200,
        height: 200,
        borderRadius: 250
    },
    container: {
        paddingHorizontal: 17,
        paddingBottom: 22,
        flex: 1

    },
    footer: {
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: 15
    },
    loginBtn: {
        height: 45,
        backgroundColor: '#222222',
        borderWidth: 1,
        borderBottomWidth: 1,
        color: '#ffffff',
        borderRadius: 5,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginTxt: {
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFEB3B'
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginTop: 16
    },
    button: {
        marginHorizontal: 14
    },
    textRow: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imgBackground: {
        flex: 1,
        width: null,
        height: null
    },
    modalStyle: {
        flex: 1,
        justifyContent: "center",

    },
    modalBtnStyle: {
        backgroundColor: '#191e1f',
        borderRadius: 0,
        height: 60
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        // flex:1,
        // height: "100%",
        width: '100%',
        height: 200,
    },
});