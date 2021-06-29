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
import { get_market_place_dashboard_list } from '../../redux/actions/marketPlaceAction';

class MarketPlaceDashboard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show_loading: true,
            selected_item_group: this.item_group[0],
            selected_item_group_list: [],
        }
    }

    componentDidMount() {
        this.props.get_market_place_dashboard_list();
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.market_place_dashboard_list !== prevProps.market_place_dashboard_list) {
            // console.log('market place list : ', this.props.market_place_dashboard_list);
            this.filter_item_group(this.state.selected_item_group);
        }
    }

    item_group = ['All', 'ACCEPTED', 'AVAILABLE', 'ORDER'];

    filter_item_group(item) {

        const { market_place_dashboard_list } = this.props;
        let filtered_list;
        if (item === 'All') {
            filtered_list = [...market_place_dashboard_list]
        } else {
            filtered_list = market_place_dashboard_list.filter(i => {
                return i.product_status == item
            });
        }
        if (item === 'ORDER') {
            filtered_list = market_place_dashboard_list.filter(i => {
                return i.product_status == 'AVAILABLE' && i.ordered_list.length > 0
            });
        }

        this.setState({ selected_item_group: item, selected_item_group_list: filtered_list });
    }


    render_item = ({ item }) => {

        return (
            <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, marginVertical: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }}
                onPress={() => this.props.navigation.navigate('MarketPlaceDashboardDetail', { product_id: item._id })}>
                <Image
                    source={{ uri: item.image[0] }}
                    style={{ width: 80, height: 80, borderRadius: 40, }} />
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 5, overflow: 'hidden' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 15 }}>{item.name}</Text><Text style={{ backgroundColor: '#FFF', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.uploaded_date}</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2, fontSize: 13, fontStyle: 'italic' }}>{item.price} MMK</Text>
                        {
                            item.product_status == 'ACCEPTED' ?

                                <Text style={{ backgroundColor: '#2196f3', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>Sold Out</Text>
                                :

                                item.product_status == 'HIDE' || item.product_status == 'DELETE' ?

                                    <Text style={{ backgroundColor: 'red', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{item.product_status}</Text>
                                    :

                                    <Text style={{ backgroundColor: 'green', color: '#FFF', paddingHorizontal: 20, paddingVertical: 5, marginLeft: 2, textAlign: 'right', borderRadius: 5, fontSize: 13 }}>{item.ordered_list.length > 0 ? item.ordered_list.length + ' order' : item.product_status}</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item._id;

    render() {

        let { selected_item_group, selected_item_group_list, show_loading } = this.state;


        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flex: 1 }} >

                    <View style={{ marginVertical: 10, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }} >
                        {
                            this.item_group.map((item) => {

                                if (selected_item_group == item) {

                                    return (

                                        <View key={item} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginLeft: 5, height: 35 }}>
                                            <Text style={{ fontSize: 15, color: '#FFF', }}>{item}</Text>
                                        </View>

                                    )

                                } else {
                                    return (
                                        <TouchableOpacity key={item} onPress={() => this.filter_item_group(item)}>
                                            <View style={{ minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginLeft: 5, height: 35, opacity: 0.5 }}>
                                                <Text style={{ fontSize: 15, color: '#222222', }}>{item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )

                                }

                            })
                        }

                    </View>

                    {
                        show_loading ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={50} color='#F09839' />
                            </View>

                            :

                            selected_item_group_list.length > 0 ?
                                <FlatList
                                    data={selected_item_group_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Product</Text>
                                </View>
                    }

                </View>

            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    market_place_dashboard_list: state.market_place.market_place_dashboard_list
})

const mapDispatchToProps = dispatch => ({
    get_market_place_dashboard_list: () => {
        dispatch(get_market_place_dashboard_list());
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlaceDashboard);
