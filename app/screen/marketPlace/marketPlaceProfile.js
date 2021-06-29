import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    Linking, Platform,
} from 'react-native';
import { get_uploaded_market_product_list } from '../../redux/actions/marketPlaceAction';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';


class MarketPlaceProfile extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        this.state = {
            uploaded_by: params.uploaded_by,
            show_loading: true,
        }
    }

    componentDidMount() {
        this.props.get_uploaded_market_product_list(this.state.uploaded_by._id);
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }


    render_item = ({ item }) => {
        const user_id = this.props.user._id;
        if (item.product_status == 'AVAILABLE') {
            return (
                <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, marginVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.props.navigation.navigate('MarketPlaceDetail', { 'product_id': item._id })}>
                    <Image
                        source={{ uri: item.image[0] }}
                        style={{ width: 80, height: 80, borderRadius: 40, }} />
                    <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, overflow: 'hidden' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 15 }}>{item.name}</Text><Text style={{ backgroundColor: '#FFF', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.uploaded_date}</Text></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.price} MMK</Text><Text style={{ backgroundColor: 'green', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{item.product_status}</Text></View>
                    </View>
                </TouchableOpacity>
            )
        } else {
            let ordered_info = item.ordered_list.filter(each_order => each_order.ordered_by == user_id)
            if (ordered_info.length) {
                let ordered_status = ordered_info[0].ordered_status;
                return (
                    <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, marginVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }}
                        onPress={() => this.props.navigation.navigate('MarketPlaceDetail', { 'product_id': item._id })}>
                        <Image
                            source={{ uri: item.image[0] }}
                            style={{ width: 80, height: 80, borderRadius: 40, }} />
                        <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, overflow: 'hidden' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 15 }}>{item.name}</Text><Text style={{ backgroundColor: '#FFF', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.uploaded_date}</Text></View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.price} MMK</Text>
                                {/* <Text style={{ backgroundColor: 'green', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{ordered_info[0].ordered_status}</Text> */}
                                {
                                    ordered_status == 'ACCEPTED' ?

                                        <Text style={{ backgroundColor: '#2196f3', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{ordered_status}</Text>

                                        :

                                        ordered_status == 'REJECTED' ?

                                            <Text style={{ backgroundColor: 'red', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{ordered_status}</Text>

                                            :

                                            <Text style={{ backgroundColor: 'green', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{ordered_status}</Text>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }

        }
    }

    _keyExtractor = (item) => item._id;

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

    render() {

        let { uploaded_by, show_loading } = this.state;
        const { uploaded_market_product_list } = this.props;

        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flex: 1 }} >

                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                        < Image
                            source={{ uri: uploaded_by.profileImage }}
                            style={{ width: 100, height: 100, borderRadius: 50, }} />
                        < View style={{ flex: 1, flexDirection: 'column', marginLeft: 10, }}>
                            <Text style={{ color: '#222', padding: 5, marginLeft: 2 }}>{uploaded_by.name}</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }} onPress={() => this.make_call(uploaded_by.phoneNumber)}>
                                <Text style={{ color: '#222' }}>{uploaded_by.phoneNumber}</Text>
                                <PhoneIcon name='phone' color='#f09839' size={20} />
                            </TouchableOpacity>
                            <Text style={{ color: '#222', padding: 5, marginLeft: 2 }}>{uploaded_by.location ? uploaded_by.location.address : 'No Address'}</Text>
                        </View >
                    </View >
                    <View style={{ justifyContent: 'center', margin: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>{uploaded_by.name}'s Product List</Text>
                    </View>

                    {
                        show_loading ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={50} color='#F09839' />
                            </View>

                            :
                            uploaded_market_product_list.length > 0 ?

                                <FlatList
                                    data={uploaded_market_product_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Uploaded Product</Text>
                                </View>
                    }

                </View>

            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    uploaded_market_product_list: state.market_place.uploaded_market_product_list
})

const mapDispatchToProps = dispatch => ({
    get_uploaded_market_product_list: (user_id) => {
        dispatch(get_uploaded_market_product_list(user_id));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlaceProfile);