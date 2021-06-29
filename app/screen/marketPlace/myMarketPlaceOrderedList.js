import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    Text,
    StatusBar,
    FlatList,
    TouchableHighlight
} from 'react-native';
import { get_my_market_product_ordered_list } from '../../redux/actions/marketPlaceAction';

class MyMarketPlaceOrderedList extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            // selected_product_view_modal_visibility: false,
            // selected_product: null,
            // selected_product_user: null,
            show_loading: true,

        }
    }

    componentDidMount() {
        this.props.get_my_market_product_ordered_list(this.props.user._id);
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }

    // select_product = (item) => {
    //     this.setState({ selected_product: item })
    //     this.toggle_select_product();
    // }

    // select_user = (order_detail) => {
    //     this.setState({ selected_product_user: order_detail })
    // }

    // update_product_status(product_status) {
    //     let { selected_product, token, selected_product_user } = this.state;

    //     const index = selected_product.ordered_list.indexOf(selected_product_user);
    //     if (product_status == 'ACCEPTED') {
    //         selected_product.ordered_list.map(each_order => {
    //             each_order.ordered_status = 'REJECTED'
    //         })
    //     }
    //     selected_product.ordered_list[index].ordered_status = product_status;
    //     const ordered_list = [...selected_product.ordered_list];

    //     let data = new FormData();
    //     data.append("ordered_list", JSON.stringify(ordered_list));

    //     axios.patch(my_product_ordered + "/" + selected_product._id, data, {

    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //             'Authorization': `Bearer ${token}`
    //         },
    //     }
    //     )
    //         .then(response => {
    //             console.log(response);
    //             this.toggle_select_product();
    //             this.setState({ selected_product: null, selected_product_user: null })
    //             this.get_my_market_product_ordered_list();
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             this.toggle_select_product();
    //             this.setState({ selected_product: null, selected_product_user: null })
    //             alert('Update Fail!')
    //         });
    // }

    // toggle_select_product = () => {
    //     this.setState({ selected_product_user: null })
    //     this.setState(state => {
    //         return {
    //             selected_product_view_modal_visibility: !state.selected_product_view_modal_visibility
    //         }
    //     });
    // }

    render_item = ({ item }) => {

        return (

            <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, marginVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, flex: 1 }} onPress={() => this.props.navigation.navigate('MarketPlaceDetail', { 'product_id': item._id })}>
                <Image
                    source={{ uri: item.image[0] }}
                    style={{ width: 80, height: 80, borderRadius: 40, }} />
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 15 }}>{item.name}</Text><Text style={{ backgroundColor: '#FFF', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.uploaded_date}</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.price} MMK</Text>
                        {
                            item.product_status == 'ACCEPTED' ?

                                <Text style={{ backgroundColor: '#2196f3', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{item.product_status}</Text>

                                :
                                <Text style={{ backgroundColor: 'green', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{item.ordered_list.length + ' Order'}</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item._id;

    render() {

        let { show_loading } = this.state;
        const { my_market_product_ordered_list } = this.props;

        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flex: 1 }} >

                    {
                        show_loading ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={50} color='#F09839' />
                            </View>

                            :

                            my_market_product_ordered_list.length > 0 ?
                                <FlatList
                                    data={my_market_product_ordered_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Ordered on My Product</Text>
                                </View>
                    }

                </View>

                {/* <Modal
                    animationType="none" transparent={true} visible={this.state.selected_product_view_modal_visibility} onRequestClose={this.toggle_select_product} >
                    {
                        this.state.selected_product_view_modal_visibility ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>

                                {
                                    this.state.selected_product_user ?

                                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >

                                            <View style={{ marginBottom: 5 }}>
                                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Selected Product Buyer Info</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', marginBottom: 10, borderWidth: 1, borderColor: '#f09839', borderRadius: 5 }}>
                                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 10, marginBottom: 10 }} >
                                                    <Image
                                                        source={{ uri: each_order.ordered_by.profileImage }}
                                                        style={{ width: 80, height: 80, borderRadius: 40, }} />
                                                    <View style={{ flexDirection: 'column', overflow: 'hidden' }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 16 }}>{this.state.selected_product_user.ordered_by.name}</Text></View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 14, fontStyle: 'italic' }}>{this.state.selected_product_user.ordered_by.location ? this.state.selected_product_user.ordered_by.location.address : 'No Address'}</Text></View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                <TouchableHighlight onPress={this.toggle_select_product} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }} underlayColor={'#f1f1f1'}>
                                                    <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight onPress={() => this.update_product_status('ACCEPTED')} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }} underlayColor={'#f1f1f1'}>
                                                    <Text style={{ fontSize: 16, color: '#f09839' }}>Accept</Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>

                                        :

                                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                                            <View style={{ marginBottom: 5 }}>
                                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Choose one from the buyers</Text>
                                            </View>
                                            <ScrollView showsVerticalScrollIndicator>
                                                {
                                                    this.state.selected_product.ordered_list.map((each_order, index) => {
                                                        return (
                                                            <TouchableOpacity key={index} style={{ flexDirection: 'row', marginBottom: 10, borderBottomColor: '#E0E0E0', borderBottomWidth: 1, }}
                                                                onPress={() => this.select_user(each_order)}>

                                                                <View style={{ flexDirection: 'column', overflow: 'hidden' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 16 }}>{each_order.ordered_by.name}</Text></View>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 14, fontStyle: 'italic' }}>{each_order.ordered_by.location ? each_order.ordered_by.location.address : 'No Address'}</Text></View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </ScrollView>
                                            <TouchableHighlight onPress={this.toggle_select_product} style={{ alignSelf: 'flex-end', padding: 10 }} underlayColor={'#fff'}>
                                                <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>Cancel</Text>
                                            </TouchableHighlight>
                                        </View>
                                }
                            </View>

                            :
                            null

                    }


                </Modal> */}

            </Fragment >
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    my_market_product_ordered_list: state.market_place.my_market_product_ordered_list
})

const mapDispatchToProps = dispatch => ({
    get_my_market_product_ordered_list: (user_id) => {
        dispatch(get_my_market_product_ordered_list(user_id));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMarketPlaceOrderedList);