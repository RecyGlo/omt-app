import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    StatusBar,
    FlatList,
} from 'react-native';

class MarketPlaceNotification extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show_loading: true,
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }

    click_notification = (item) => {
        this.props.navigation.navigate('MarketPlaceDetail', { product_id: item.content_id });
    }


    render_item = ({ item }) => {

        return (
            <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderBottomWidth: 1, borderBottomColor: '#E2E2E2', flexDirection: 'row', alignItems: 'center', padding: 10, }}
                onPress={() => this.click_notification(item)}>
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 1, overflow: 'hidden', padding: 10 }}>
                    <Text style={{ fontSize: 16 }}>{item.message}</Text>
                    <Text style={{ fontSize: 13, fontStyle: 'italic', margin: 5 }}>{item.createdAt}</Text>
                </View>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: 80, height: 80, borderRadius: 40, }} />
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item._id;

    render() {

        let { show_loading } = this.state;
        const { market_place_notification_list } = this.props;
        // console.log(market_place_notification_list)

        let filter_market_place_notification_list = [];

        if (market_place_notification_list) {       // for filtering message for same product
            let messages_product_id = [];
            market_place_notification_list.map(each_notification => {
                if (each_notification.category.includes('MarketPlace_')) {
                    if (each_notification.category === 'MarketPlace_MESSAGE') {
                        if (!messages_product_id.includes(each_notification.content_id)) {
                            filter_market_place_notification_list.push(each_notification)
                            messages_product_id.push(each_notification.content_id)
                        }
                    } else {
                        filter_market_place_notification_list.push(each_notification);
                    }
                }

            })
        }

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

                            filter_market_place_notification_list.length > 0 ?
                                <FlatList
                                    data={filter_market_place_notification_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Marketplace Notification</Text>
                                </View>
                    }

                </View>

            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    market_place_notification_list: state.market_place.market_place_notification_list
})


export default connect(mapStateToProps)(MarketPlaceNotification);
