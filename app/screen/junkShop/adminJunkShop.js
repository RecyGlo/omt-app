import React, { Fragment, PureComponent } from 'react';
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
import { get_admin_junk_shop_list } from '../../redux/actions/junkShopAction';


class AdminJunkShop extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            pending_color: '#2196F3',
            approved_color: '#222222',
            rejected_color: '#222222',
            show_loading: true,
            selected_type: 'PENDING'
        }
    }

    componentDidMount() {
        this.props.get_admin_junk_shop_list(this.state.selected_type, 1);
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

    toggle_switch = (status) => {
        switch (status) {
            case 'PENDING':
                this.setState({
                    selected_type: status, pending_color: '#2196F3', approved_color: '#222222', rejected_color: '#222222',
                }, () => this.props.get_admin_junk_shop_list(status, 1));
                break;
            case 'APPROVED':
                this.setState({
                    selected_type: status, pending_color: '#222222', approved_color: '#2196F3', rejected_color: '#222222',
                }, () => this.props.get_admin_junk_shop_list(status, 1));
                break;
            case 'REJECTED':
                this.setState({
                    selected_type: status, pending_color: '#222222', approved_color: '#222222', rejected_color: '#2196F3',
                }, () => this.props.get_admin_junk_shop_list(status, 1));
                break;
        }
    }

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
            this.props.get_admin_junk_shop_list(this.state.selected_type, this.props.page + 1);
        }
    }

    render() {

        const { admin_junk_shop_list, count } = this.props;
        const { show_loading, selected_type, pending_color, approved_color, rejected_color } = this.state;
        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flexDirection: 'row', margin: 10, height: 50, borderColor: '#222222', borderBottomWidth: 1, padding: 5 }}>
                    <TouchableOpacity onPress={() => this.toggle_switch('PENDING')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightColor: '#f09839', borderRightWidth: 1 }}>
                        <Text style={{ color: pending_color, fontSize: 14 }}>{count.pending_junk_shop_count}</Text>
                        <Text style={{ color: pending_color, fontSize: 14 }}>PENDING</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggle_switch('APPROVED')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRightColor: '#f09839', borderRightWidth: 1 }}>
                        <Text style={{ color: approved_color, fontSize: 14 }}>{count.approved_junk_shop_count}</Text>
                        <Text style={{ color: approved_color, fontSize: 14 }}>APPROVED</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggle_switch('REJECTED')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                        <Text style={{ color: rejected_color, fontSize: 14 }}>{count.rejected_junk_shop_count}</Text>
                        <Text style={{ color: rejected_color, fontSize: 14 }}>REJECTED</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>

                    {
                        show_loading ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={50} color='#F09839' />
                            </View>

                            :

                            admin_junk_shop_list.length > 0 ?
                                <FlatList
                                    data={admin_junk_shop_list}
                                    renderItem={this.render_item}
                                    keyExtractor={this._keyExtractor}
                                    initialNumToRender={5}
                                    ListFooterComponent={this.render_footer}
                                    onEndReached={this.handle_load_more}
                                    onEndReachedThreshold={0.5}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No {selected_type} Junk Shop</Text>
                                </View>
                    }

                </View>

            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    admin_junk_shop_list: state.junk_shop.admin_junk_shop_list.admin_junk_shop_list,
    count: state.junk_shop.admin_junk_shop_list.count,
    total_page: state.junk_shop.admin_junk_shop_list.total_page,
    page: state.junk_shop.admin_junk_shop_list.page,
})

const mapDispatchToProps = dispatch => ({
    get_admin_junk_shop_list: (type, page) => {
        dispatch(get_admin_junk_shop_list(type, page));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminJunkShop);