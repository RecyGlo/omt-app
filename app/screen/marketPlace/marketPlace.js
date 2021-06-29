import React, { Fragment } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    Modal,
    Linking,
    Alert,
    BackHandler,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { get_market_place_list, toggle_save_product, get_market_place_notification_list } from '../../redux/actions/marketPlaceAction';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import VersionCheck from 'react-native-version-check';
import { item, notification_socket } from '../../api/endPoints';
import io from 'socket.io-client/dist/socket.io';
import EllipsisIcon from 'react-native-vector-icons/FontAwesome';
import ShoppingCartIcon from 'react-native-vector-icons/AntDesign';
import ArrowBackIcon from 'react-native-vector-icons/MaterialIcons';
import HeartIcon from 'react-native-vector-icons/Ionicons';
import ArrowRightIcon from 'react-native-vector-icons/AntDesign';
import MessageIcon from 'react-native-vector-icons/MaterialIcons';
import NotificationsIcon from "react-native-vector-icons/MaterialIcons";


class MarketPlace extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            market_place_list: [],
            selected_item_group: 'All',
            selected_item_group_list: [],
            show_loading: true,
            item_group_list: [],
            selected_contact_view_modal_visibility: false,
            new_notification: 0,
        }
        this.socket = io(notification_socket + '?user_id=' + this.props.user._id);


    }

    subscribeToDiscussMessageSocket() {
        this.socket.on('notification', this.on_notification_receive);
    }

    on_notification_receive = (data) => {
        // console.log("notification", data);
        this.props.get_market_place_notification_list(this.props.user._id);
    };

    componentWillUnmount() {
        this.socket.off('notification', this.on_notification_receive);
    }

    _menu = null;


    // item_group_list = ['All', 'Plastic', 'Glass', 'Paper', 'Electronic', 'Metal', 'Cloth', 'Other', 'Recycle'];
    product_category_img = ['../../asset/image/electronic.png', '../../asset/image/plastic.png', '../../asset/image/electronic.png', '../../asset/image/paper.png', '../../asset/image/metal.png', '../../asset/image/cloth.png', '../../asset/image/electronic.png', '../../asset/image/electronic.png'];

    async componentDidMount() {
        const app_continue = await this.check_version();
        if (app_continue) {
            const market_place_notification_length = await AsyncStorage.getItem('market_place_notification_length')
            if (!market_place_notification_length)
                AsyncStorage.setItem('market_place_notification_length', '0');
            this.props.get_market_place_list();
            this.props.get_market_place_notification_list(this.props.user._id);
            setTimeout(() => this.setState({ show_loading: false }), 1000);
            this.subscribeToDiscussMessageSocket();
        }
    }

    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.market_place_list !== prevProps.market_place_list) {
            // console.log('market place list : ', this.props.market_place_list);
            this.get_item_group_list();
            this.filter_item_group(this.state.selected_item_group);
        }

        if (this.props.market_place_notification_list !== prevProps.market_place_notification_list) {
            // console.log('market place notification list : ', this.props.market_place_notification_list);
            const market_place_notification_length = await AsyncStorage.getItem('market_place_notification_length');

            const market_place_notification = this.props.market_place_notification_list.filter(i => {
                return i.category.includes('MarketPlace_');
            });
            if (market_place_notification.length > market_place_notification_length) {
                this.setState({
                    new_notification: market_place_notification.length - market_place_notification_length
                })
            }


        }

    }

    check_version = async () => {
        try {
            let updateNeeded = await VersionCheck.needUpdate();
            // const latestVersion = await VersionCheck.getLatestVersion();
            // const currentVersion = await VersionCheck.getCurrentVersion();
            // console.log(latestVersion);
            // console.log(currentVersion);
            if (updateNeeded && updateNeeded.isNeeded) {
                Alert.alert(
                    'Please Update',
                    'Update your app to the latest version to use new features.',
                    [
                        {
                            text: 'Update',
                            onPress: () => {
                                BackHandler.exitApp();
                                Linking.openURL(updateNeeded.storeUrl);
                            },
                        },
                    ],
                    { cancelable: false }
                );
                return false;
            } else {
                return true;
            }
        } catch (error) { };
    }

    edit_profile = (user) => {
        this.props.navigation.navigate('EditProfile', { 'user': { user } });
    }

    show_notification = () => {
        this.setState({ new_notification: 0 })
        const market_place_notification = this.props.market_place_notification_list.filter(i => {
            return i.category.includes('MarketPlace_');
        });
        // AsyncStorage.setItem('market_place_notification', JSON.stringify(this.props.market_place_notification_list));
        AsyncStorage.setItem('market_place_notification_length', JSON.stringify(market_place_notification.length));
        this.props.navigation.navigate('MarketPlaceNotification');

    }

    get_item_group_list = () => {

        const { item_group_list } = this.state;
        const { market_place_list } = this.props;
        item_group_list.push('All');
        market_place_list.map(each_product => {
            if (each_product.category !== '') {
                if (!item_group_list.includes(each_product.category))
                    item_group_list.push(each_product.category)
            }
        })
        // console.log(item_group_list);
        this.setState({ item_group_list: item_group_list });
    }

    filter_item_group(item) {
        const { market_place_list } = this.props;
        let filtered_list;
        if (item === 'All') {
            filtered_list = [...market_place_list]
        } else {
            filtered_list = market_place_list.filter(i => {
                return i.category == item
            });
        }
        this.setState({ selected_item_group: item, selected_item_group_list: filtered_list });
    }

    toggle_select_contact = () => {
        this.setState(state => {
            return {
                selected_contact_view_modal_visibility: !state.selected_contact_view_modal_visibility
            }
        });
    }

    render() {

        let { selected_item_group, selected_item_group_list, show_loading } = this.state;
        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                {
                    Platform.OS === 'ios' &&
                    <View style={{ height: 30, backgroundColor: '#F09839' }} />
                }
                <View style={{ flexDirection: 'row', height: 56, backgroundColor: '#F09839', padding: 15, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Recycling')}>
                        <ArrowBackIcon name="arrow-back" size={25} color='#FFF' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>Market Place</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('MarketPlaceCart')} style={{ marginRight: 25 }} >
                            <ShoppingCartIcon name="shoppingcart" size={25} color='#FFF' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.show_notification()} style={{ width: 25, height: 25, position: 'relative', marginRight: 25 }} >
                            {this.state.new_notification > 0 &&
                                <View style={{ position: 'absolute', top: -5, right: -10, backgroundColor: 'red', borderRadius: 16, paddingHorizontal: 6, paddingVertical: 2, zIndex: 2, }}>
                                    <Text style={{ color: 'white', fontSize: 11, fontWeight: '600', }}>{this.state.new_notification}</Text>
                                </View>
                            }
                            <NotificationsIcon name='notifications' size={25} color='#FFF' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('MarketPlaceMessage')} style={{ marginRight: 20 }} >
                            <MessageIcon name="message" size={24} color='#FFF' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._menu.show()} style={{ marginRight: 10, paddingHorizontal: 10 }} >
                            <Menu
                                ref={ref => { this._menu = ref }}
                                button={<EllipsisIcon size={22} name={'ellipsis-v'} color={'#FFF'} onPress={() => this._menu.show()} />}
                            >
                                <MenuItem onPress={() => { this._menu.hide(); this.props.navigation.navigate('MarketPlaceUploadedList'); }}> My Product</MenuItem>
                                <MenuDivider />
                                <MenuItem onPress={() => { this._menu.hide(); this.props.navigation.navigate('MarketPlaceSavedList') }}> Saved Product</MenuItem>
                                <MenuDivider />
                                {
                                    this.props.user.type === 'ADMIN' &&

                                    <MenuItem onPress={() => { this._menu.hide(); this.props.navigation.navigate('MarketPlaceDashboard') }}> Market Place Dashboard</MenuItem>

                                }
                            </Menu>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <View style={{ marginVertical: 10, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }} >
                    {
                        this.state.item_group_list.map((item, index) => {

                            if (selected_item_group == item) {

                                return (

                                    <View key={item} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginLeft: 10, margin: 2, height: 35 }}>
                                        <Text style={{ fontSize: 15, color: '#FFF', }}>{item}</Text>
                                    </View>

                                )

                            } else {
                                return (
                                    <TouchableOpacity key={item} onPress={() => this.filter_item_group(item)}>
                                        <View style={{ minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginLeft: 10, margin: 2, height: 35, opacity: 0.5 }}>
                                            <Text style={{ fontSize: 15, color: '#222222', }}>{item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )

                            }

                        })
                    }

                </View> */}
                <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>Showing {selected_item_group} products</Text>
                    <TouchableOpacity onPress={() => this.toggle_select_contact()}>
                        <HeartIcon name="ios-menu" size={30} style={{ color: '#F09839' }} />
                    </TouchableOpacity>
                </View>
                {/* <Text>{JSON.stringify(this.state.item_group_list)}</Text> */}

                {
                    show_loading ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={50} color='#F09839' />
                        </View>

                        :

                        selected_item_group_list.length > 0 ?
                            <FlatList
                                data={selected_item_group_list}
                                renderItem={this.render_market_place}
                                keyExtractor={this._keyExtractor}
                                numColumns={2}
                            />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No {selected_item_group != 'All' && selected_item_group} Product Now</Text>
                            </View>



                }



                <TouchableOpacity style={{
                    borderRadius: 25,
                    position: 'absolute',
                    bottom: 15,
                    right: 20,
                    zIndex: 3,
                    backgroundColor: '#f09839',
                    elevation: 10,
                    padding: 15,
                }}
                    onPress={() => this.add_market_place()}
                >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Sell Your Product</Text>
                </TouchableOpacity>
                <Modal onDismiss={() => this.toggle_select_contact()}
                    animationType='fade' visible={this.state.selected_contact_view_modal_visibility} transparent onRequestClose={() => this.toggle_select_contact()} >

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 55, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20, }} >
                            <View style={{ marginBottom: 20, marginLeft: 10 }}>
                                <Text style={{ fontSize: 18, color: '#f09839', fontWeight: '700' }}>Filter by product type!</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }} >
                                {
                                    this.state.item_group_list.map((item, index) => {
                                        if (selected_item_group == item) {
                                            return (
                                                <View key={item} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginLeft: 10, margin: 2, height: 35 }}>
                                                    <Text style={{ fontSize: 15, color: '#FFF', }}>{item}</Text>
                                                </View>
                                            )
                                        } else {
                                            return (
                                                <TouchableOpacity key={item} onPress={() => { this.toggle_select_contact(); this.filter_item_group(item) }}>
                                                    <View style={{ minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginLeft: 10, margin: 2, height: 35, opacity: 0.5 }}>
                                                        <Text style={{ fontSize: 15, color: '#222222', }}>{item}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })
                                }
                            </View>
                            <TouchableHighlight onPress={() => this.toggle_select_contact()} style={{ alignSelf: 'flex-end', padding: 10 }} underlayColor={'#f1f1f1'}>
                                <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </Fragment >
        )
    }


    render_market_place = ({ item }) => {
        let saved = false;
        if (item.saved_by) {
            if (item.saved_by.includes(this.props.user._id))
                saved = true;
            // if (item.uploaded_by._id == this.props.user._id)
            //     const uploaded = true;
        }
        return (

            <TouchableOpacity style={{ flex: 1, flexDirection: 'column', margin: 5, backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5 }}
                onPress={() => this.props.navigation.navigate('MarketPlaceDetail', { product_id: item._id })}>
                {
                    item.saved_by ?

                        saved ?
                            <TouchableOpacity onPress={() => this.un_save_product(item)} style={{
                                position: 'absolute',
                                right: 2,
                                top: 2,
                                zIndex: 2,
                                backgroundColor: '#EEE',
                                borderRadius: 8
                            }}>
                                <HeartIcon name="md-heart" size={30} style={{ color: 'green', opacity: 0.8 }} />
                            </TouchableOpacity>

                            :

                            <TouchableOpacity onPress={() => this.save_product(item)} style={{
                                position: 'absolute',
                                right: 2,
                                top: 2,
                                zIndex: 2,
                                backgroundColor: '#EEE',
                                borderRadius: 8
                            }}>
                                <HeartIcon name="ios-heart" size={30} style={{ opacity: 0.2 }} />
                            </TouchableOpacity>
                        :

                        <TouchableOpacity onPress={() => this.save_product(item)} style={{
                            position: 'absolute',
                            right: 2,
                            top: 2,
                            zIndex: 2,
                        }}>
                            <HeartIcon name="ios-heart" size={30} style={{ opacity: 0.2 }} />
                        </TouchableOpacity>

                }

                <Image style={{ justifyContent: 'center', alignItems: 'center', height: 200, resizeMode: 'cover', }} source={{ uri: item.image[0] }} />
                <View style={{ padding: 10 }}>
                    <Text style={{ color: '#f09839', fontSize: 13, marginBottom: 5, fontWeight: '700' }}>{item.name.length>20 ? item.name.substring(0, 15) + '.....' : item.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#222', fontSize: 13, fontStyle: 'italic' }}>{item.price} MMK</Text>
                        <Text style={{ color: 'green', fontSize: 12, fontStyle: 'italic' }}>{item.uploaded_date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item) => item._id;


    add_market_place() {

        let user = this.props.user;
        let image = user.profileImage, address = user.location ? user.location.address : null, phone_number = user.phoneNumber;
        if (!image || !address || !phone_number) {
            alert('Please fill your photo , phone number and address info in your profile in order to reach out to you.')
            this.edit_profile(user);
        } else {
            this.setState({ checked_profile: true })
            this.props.navigation.navigate('AddMarketPlace');
        }

    }

    save_product(item) {

        let { user } = this.props;
        let saved_by;
        if (item.saved_by) {
            saved_by = item.saved_by;
        } else {
            saved_by = [];
        }
        saved_by.push(user._id);

        let data = new FormData();
        data.append("saved_by", JSON.stringify(saved_by));

        this.props.toggle_save_product(item._id, data);
    }

    un_save_product(item) {

        let { user } = this.props;

        let saved_by;

        if (item.saved_by) {
            saved_by = item.saved_by;
        } else {
            saved_by = [];
        }

        const index = saved_by.indexOf(user._id);
        if (index > -1) {
            saved_by.splice(index, 1);
        }

        let data = new FormData();
        data.append("saved_by", JSON.stringify(saved_by));

        this.props.toggle_save_product(item._id, data);
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    market_place_list: state.market_place.market_place_list,
    market_place_notification_list: state.market_place.market_place_notification_list

})

const mapDispatchToProps = dispatch => ({
    get_market_place_list: () => {
        dispatch(get_market_place_list());
    },
    toggle_save_product: (product_id, data) => {
        dispatch(toggle_save_product(product_id, data));
    },
    get_market_place_notification_list: (user_id) => {
        dispatch(get_market_place_notification_list(user_id));
    },


})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlace);

let styles = StyleSheet.create(
    {
        root: {
            backgroundColor: '#191e1f'
        },
        title: {
            marginBottom: 5,
            color: '#ECC951'
        },
        MainContainer: {
            justifyContent: 'center',
            flex: 1,
            paddingTop: 30,
        },
        imageThumbnail: {
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
        },

    }
);
