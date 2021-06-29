import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    View,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
    FlatList,
} from 'react-native';
import { get_added_junk_shop_list } from '../../redux/actions/junkShopAction';

class JunkShopAddedList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show_loading: true,
        }
    }

    componentDidMount() {
        this.props.get_added_junk_shop_list(this.props.user._id, 1); // 1 for page 1 in pagination
        setTimeout(() => this.setState({ show_loading: false }), 1000);

    }

    render_item = ({ item }) => {

        return (
            <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, margin: 10, flexDirection: 'row', padding: 10 }} onPress={() => this.props.navigation.navigate('JunkShopDetail', { 'item': item })}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: 80, height: 100, borderRadius: 10, }} />
                <View style={{ marginLeft: 10, justifyContent: 'space-between', padding: 5 }}>
                    <Text style={{ color: '#f09839', fontSize: 17, fontWeight: '700' }}>{item.name}</Text>
                    <Text style={{ color: '#222', }}>{item.phoneNumber}</Text>
                    <Text style={{ color: '#222', fontStyle: 'italic' }}>{item.location.address}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item._id;

    render_footer = () => {
        const { total_page, page } = this.props;
        if (page === total_page) {
            return null;
        }
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator size='large' color='#F09839' />
            </View>
        );
    }


    handle_load_more = () => {
        const { total_page, page } = this.props;
        // check if the current page reaches the last page
        if (page < total_page) {
            console.log("handle load more")
            this.props.get_added_junk_shop_list(this.props.user._id, this.props.page + 1);
        }
    }

    render() {

        const { added_junk_shop_list } = this.props;
        const { show_loading } = this.state;

        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flex: 1 }}>

                    {
                        show_loading ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={50} color='#F09839' />
                            </View>

                            :

                            added_junk_shop_list.length > 0 ?
                                <FlatList
                                    data={added_junk_shop_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                    initialNumToRender={5}
                                    ListFooterComponent={this.render_footer}
                                    onEndReached={this.handle_load_more}
                                    onEndReachedThreshold={0.5}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Added Junk Shop</Text>
                                </View>
                    }

                </View>

            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    added_junk_shop_list: state.junk_shop.added_junk_shop_list.added_junk_shop_list,
    total_page: state.junk_shop.added_junk_shop_list.total_page,
    page: state.junk_shop.added_junk_shop_list.page,
})

const mapDispatchToProps = dispatch => ({
    get_added_junk_shop_list: (user_id, page) => {
        dispatch(get_added_junk_shop_list(user_id, page));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(JunkShopAddedList);
