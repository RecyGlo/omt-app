import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    Modal,
    TouchableOpacity,
    Text,
    StatusBar,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import { accept_my_market_product_ordered, get_market_product_info } from '../../redux/actions/marketPlaceAction';


class MyMarketPlaceOrderedDetail extends React.PureComponent {


    constructor(props) {
        super(props);
        let { product_id } = this.props.route.params;
        this.state = {
            product_id: product_id,
            // ordered_list: market_product_info.ordered_list,
            selected_user_view_modal_visibility: false,
            selected_user: null,

        }


    }


    componentDidMount() {
        this.props.get_market_product_info(this.state.product_id);
        // setTimeout(() => this.setState({ show_loading: false }), 500);
    }


    select_user = (item) => {

        this.setState({ selected_user: item })
        this.toggle_select_user_modal();

    }

    update_product_status(product_status) {
        const { selected_user } = this.state;
        const { market_product_info } = this.props;
        let data = new FormData();
        data.append("product_status", product_status);
        data.append("accepted_user_id", selected_user.ordered_by._id);
        const device_id = selected_user.ordered_by.device_id;
        const product_name = market_product_info.name;
        const product_image = market_product_info.image[0];

        const uploaded_by_name = market_product_info.uploaded_by.name;
        data.append("uploaded_by_name", uploaded_by_name);
        data.append("product_name", product_name);
        data.append("device_id", device_id);
        data.append("product_image", product_image);

        this.props.accept_my_market_product_ordered(market_product_info._id, data);
        this.toggle_select_user_modal();

    }

    toggle_select_user_modal = () => {
        this.setState(state => {
            return {
                selected_user_view_modal_visibility: !state.selected_user_view_modal_visibility
            }
        });
    }


    // get_accepted_user = () => {
    //     let { ordered_list } = this.state;
    //     let accepted_user = ordered_list.filter((each_order) => each_order.ordered_status == 'ACCEPTED')

    //     let ordered_user = ordered_list.filter((each_order) => each_order.ordered_status == 'ORDERED')
    //     if (accepted_user.length > 0) {
    //         return (
    //             <View>
    //                 {
    //                     accepted_user.map((each_accepted_user, index) => {
    //                         return (
    //                             <View key={index} style={{ backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, margin: 10, }} >
    //                                 < View style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} >
    //                                     < Image
    //                                         source={{ uri: each_accepted_user.ordered_by.profileImage }}
    //                                         style={{ width: 80, height: 80, borderRadius: 40, }} />
    //                                     < View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
    //                                         <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.name}</Text></View>
    //                                         <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.phoneNumber}</Text>
    //                                         <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.location ? each_accepted_user.ordered_by.location.address : 'No Address'}</Text></View>
    //                                     </View >
    //                                 </View >
    //                                 <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 10, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
    //                                     onPress={() => this.props.navigation.navigate('MarketPlaceDiscussion', { 'market_product_info': this.props.market_product_info, 'my_ordered_detail': each_accepted_user })}>
    //                                     <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Message</Text>
    //                                 </TouchableOpacity>
    //                             </View>

    //                         )
    //                     })
    //                 }
    //                 {
    //                     ordered_user.length > 0 &&


    //                     <View style={{ backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, margin: 10, }} >
    //                         <View style={{ justifyContent: 'center', margin: 10 }}>
    //                             <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>Ordered Buyer List</Text>
    //                         </View>
    //                         {
    //                             ordered_user.map((each_ordered_user, index) => {
    //                                 return (
    //                                     <TouchableOpacity key={index} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.select_user(each_ordered_user)}>
    //                                         <Image
    //                                             source={{ uri: each_ordered_user.ordered_by.profileImage }}
    //                                             style={{ width: 80, height: 80, borderRadius: 40, }} />
    //                                         <View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
    //                                             <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_ordered_user.ordered_by.name}</Text></View>
    //                                             <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_ordered_user.ordered_by.location ? each_ordered_user.ordered_by.location.address : 'No Address'}</Text></View>
    //                                         </View>
    //                                     </TouchableOpacity>
    //                                 )
    //                             })
    //                         }
    //                     </View>

    //                 }

    //             </View>
    //         )
    //     } else {

    //         return (
    //             <View style={{ backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, margin: 10, }} >
    //                 {
    //                     ordered_user.map((each_ordered_user, index) => {
    //                         return (
    //                             <TouchableOpacity key={index} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.select_user(each_ordered_user)}>
    //                                 <Image
    //                                     source={{ uri: each_ordered_user.ordered_by.profileImage }}
    //                                     style={{ width: 80, height: 80, borderRadius: 40, }} />
    //                                 <View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
    //                                     <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_ordered_user.ordered_by.name}</Text></View>
    //                                     <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_ordered_user.ordered_by.location ? each_ordered_user.ordered_by.location.address : 'No Address'}</Text></View>
    //                                 </View>
    //                             </TouchableOpacity>
    //                         )
    //                     })
    //                 }
    //             </View>
    //         )

    //     }


    get_accepted_user = () => {
        let { ordered_list } = this.props.market_product_info;
        let accepted_user = ordered_list.filter((each_order) => each_order.ordered_status == 'ACCEPTED')

        let rejected_user = ordered_list.filter((each_order) => each_order.ordered_status == 'REJECTED')
        if (accepted_user.length > 0) {
            return (
                <View>
                    {
                        accepted_user.map((each_accepted_user, index) => {
                            return (
                                <View key={index} style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, margin: 10, }} >
                                    < View style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} >
                                        < Image
                                            source={{ uri: each_accepted_user.ordered_by.profileImage }}
                                            style={{ width: 80, height: 80, borderRadius: 40, }} />
                                        < View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.name}</Text></View>
                                            <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.phoneNumber}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.location ? each_accepted_user.ordered_by.location.address : 'No Address'}</Text></View>
                                        </View >
                                    </View >
                                    <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 10, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                        onPress={() => this.props.navigation.navigate('MarketPlaceDiscussion', { 'product': this.props.market_product_info, 'my_ordered_detail': each_accepted_user })}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Message</Text>
                                    </TouchableOpacity>
                                </View>

                            )
                        })
                    }
                    {
                        rejected_user.length > 0 &&


                        <View style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, margin: 10, }} >
                            <View style={{ justifyContent: 'center', margin: 10 }}>
                                <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>Rejected Buyer List</Text>
                            </View>
                            {
                                rejected_user.map((each_rejected_user, index) => {
                                    return (
                                        <View key={index} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.select_user(each_rejected_user)}>
                                            <Image
                                                source={{ uri: each_rejected_user.ordered_by.profileImage }}
                                                style={{ width: 80, height: 80, borderRadius: 40, }} />
                                            <View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_rejected_user.ordered_by.name}</Text></View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_rejected_user.ordered_by.location ? each_rejected_user.ordered_by.location.address : 'No Address'}</Text></View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>

                    }

                </View>
            )
        } else {

            return (
                <View style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, margin: 10, }} >
                    {
                        ordered_list.map((each_ordered_list, index) => {
                            return (
                                <TouchableOpacity key={index} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.select_user(each_ordered_list)}>
                                    <Image
                                        source={{ uri: each_ordered_list.ordered_by.profileImage }}
                                        style={{ width: 80, height: 80, borderRadius: 40, }} />
                                    <View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_ordered_list.ordered_by.name}</Text></View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_ordered_list.ordered_by.location ? each_ordered_list.ordered_by.location.address : 'No Address'}</Text></View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )

        }


    }

    // }

    _keyExtractor = (item, index) => index + '';

    render() {

        let { market_product_info } = this.props;

        if (market_product_info) {

            return (

                <Fragment>
                    <StatusBar backgroundColor={"#f09839"} />
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 10, margin: 10 }} >
                            <Image
                                source={{ uri: market_product_info.image[0] }}
                                style={{ width: 80, height: 80, borderRadius: 40, }} />

                            <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, overflow: 'hidden' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 15 }}>{market_product_info.name}</Text><Text style={{ backgroundColor: '#FFF', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{market_product_info.uploaded_date}</Text></View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{market_product_info.price} MMK</Text><Text style={{ backgroundColor: 'green', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{market_product_info.product_status}</Text></View>
                            </View>
                        </View>
                        {/* <View style={{ justifyContent: 'center', margin: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>{market_product_info.product_status == 'ACCEPTED' ? 'Buyer Info' : 'Buyer List'}</Text>
                    </View>
                    <View style={{ backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, margin: 10, }} >
                        {
                            market_product_info.product_status == 'ACCEPTED' ?

                                this.get_accepted_user()
                                :
                                <FlatList
                                    scrollEnabled
                                    data={ordered_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                />
                        }
                    </View> */}
                        <View style={{ justifyContent: 'center', margin: 10 }}>
                            <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>{market_product_info.product_status == 'ACCEPTED' ? 'Buyer Info' : 'Buyer List'}</Text>
                        </View>
                        <ScrollView>
                            {
                                this.get_accepted_user()
                            }
                        </ScrollView>
                    </View>

                    <Modal
                        animationType="none" transparent={true} visible={this.state.selected_user_view_modal_visibility} onRequestClose={this.toggle_select_user_modal} >
                        {
                            this.state.selected_user_view_modal_visibility ?

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>

                                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                                        <View style={{ marginBottom: 20 }}>
                                            <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Sell the market_product_info to this user</Text>
                                        </View>
                                        <View style={{ backgroundColor: '#fff', borderRadius: 5, elevation: 5, flexDirection: 'row', marginBottom: 10, padding: 5, alignItems: 'center' }}>
                                            <Image
                                                source={{ uri: this.state.selected_user.ordered_by.profileImage }}
                                                style={{ width: 80, height: 80, borderRadius: 40, }} />
                                            <View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                                <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 16 }}>{this.state.selected_user.ordered_by.name}</Text>
                                                <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 14, fontStyle: 'italic' }}>{this.state.selected_user.ordered_by.location ? this.state.selected_user.ordered_by.location.address : 'No Address'}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                            <TouchableHighlight onPress={this.toggle_select_user_modal} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }} underlayColor={'#f1f1f1'}>
                                                <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight onPress={() => this.update_product_status('ACCEPTED')} style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 5 }} underlayColor={'#f1f1f1'}>
                                                <Text style={{ fontSize: 16, color: '#f09839' }}>Accept</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </View>

                                :
                                null
                        }
                    </Modal>

                </Fragment >
            )
        } else {
            return <View />
        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    market_product_info: state.market_place.market_product_info
})

const mapDispatchToProps = dispatch => ({
    accept_my_market_product_ordered: (product_id, data) => {
        dispatch(accept_my_market_product_ordered(product_id, data));
    },
    get_market_product_info: (product_id) => {
        dispatch(get_market_product_info(product_id));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMarketPlaceOrderedDetail);