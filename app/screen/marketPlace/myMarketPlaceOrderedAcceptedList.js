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
} from 'react-native';
import { get_my_market_product_ordered_accepted_list } from '../../redux/actions/marketPlaceAction';

class MyMarketPlaceOrderedAcceptedList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show_loading: true,
        }
    }

    componentDidMount() {
        this.props.get_my_market_product_ordered_accepted_list(this.props.user._id);
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }



    render_item = ({ item }) => {
        let accepted_user = item.ordered_list.filter((each_order) => each_order.ordered_status == 'ACCEPTED')
        return (
            <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, marginVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, flex: 1 }}
                onPress={() => this.props.navigation.navigate('MarketPlaceDiscussion', { 'product': item, 'my_ordered_detail': accepted_user[0] })}>
                <Image
                    source={{ uri: item.image[0] }}
                    style={{ width: 80, height: 80, borderRadius: 40, }} />
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 15 }}>{item.name}</Text><Text style={{ backgroundColor: '#FFF', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.uploaded_date}</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.price} MMK</Text><Text style={{ backgroundColor: '#2196f3', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{item.product_status}</Text></View>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item._id;

    render() {

        let { show_loading } = this.state;
        const { my_market_product_ordered_accepted_list } = this.props;

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
                            my_market_product_ordered_accepted_list.length > 0 ?
                                <FlatList
                                    data={my_market_product_ordered_accepted_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Message History</Text>
                                </View>
                    }

                </View>

            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    my_market_product_ordered_accepted_list: state.market_place.my_market_product_ordered_accepted_list
})

const mapDispatchToProps = dispatch => ({
    get_my_market_product_ordered_accepted_list: (user_id) => {
        dispatch(get_my_market_product_ordered_accepted_list(user_id));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MyMarketPlaceOrderedAcceptedList);
