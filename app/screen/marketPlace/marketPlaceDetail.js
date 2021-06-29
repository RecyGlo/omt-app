import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    Text,
    StatusBar,
    StyleSheet,
    ActivityIndicator,
    TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import { order_market_product, get_market_product_info, accept_my_market_product_ordered, toggle_hide_product } from '../../redux/actions/marketPlaceAction';
import ImageViewer from 'react-native-image-zoom-viewer';

class MarketPlaceDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        this.state = {
            product_id: params.product_id,
            product_order_or_buy: 'Request Order',
            image_modal_visibility: false,
            image_index: 0,
            show_loading: true,
            selected_user_view_modal_visibility: false,
            selected_user: null,
            order_product_confirm_modal: false,
            delete_product_confirm_modal: false,
        }
    }

    componentDidMount() {
        if (this.props.user.type == 'ADMIN' || this.props.user.type == 'EDITOR') {
            this.props.navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={() => this.toggle_delete_confirm()} >
                        <Text style={{ color: 'red', fontSize: 16, fontWeight: '700', marginRight: 15 }}>Delete</Text>
                    </TouchableOpacity>
                ),
            });
        }
        this.props.get_market_product_info(this.state.product_id);
        setTimeout(() => this.setState({ show_loading: false }), 500);
    }


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.market_product_info !== prevProps.market_product_info) {
            // console.log('market product info : ', this.props.market_product_info);
            const { market_product_info } = this.props;
            if (market_product_info.ordered_list.length) {
                let order_status = market_product_info.ordered_list.filter(each_order => each_order.ordered_by._id == this.props.user._id)
                if (order_status.length) {
                    if (order_status[0].ordered_status == 'ACCEPTED') {
                        this.setState({ product_order_or_buy: 'Your order is accepted. Click to message.' })
                    } else if (order_status[0].ordered_status == 'REJECTED') {
                        this.setState({ product_order_or_buy: 'Your order is rejected due to low stock.' })
                    } else {
                        this.setState({ product_order_or_buy: 'The product has been requested.' })
                    }
                }
            }
        }

        if (this.props.route.params.product_id != prevProps.route.params.product_id) {
            this.setState({ show_loading: true })
            this.props.get_market_product_info(this.props.route.params.product_id);
            setTimeout(() => this.setState({ show_loading: false }), 500);
        }

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

    toggle_delete_confirm = () => {
        this.setState(state => {
            return {
                delete_product_confirm_modal: !state.delete_product_confirm_modal
            }
        });
    }

    delete_product = () => {
        const { market_product_info } = this.props;
        let data = new FormData();
        data.append("name", market_product_info.name);
        data.append("description", market_product_info.description);
        data.append("price", market_product_info.price);
        data.append("category", market_product_info.category);
        let product_status = 'DELETE';
        data.append("product_status", product_status);

        data.append("old_news_image", JSON.stringify(market_product_info.image));

        this.props.toggle_hide_product(market_product_info._id, data);
        this.toggle_delete_confirm();
    }

    toggle_hide_product = () => {
        const { market_product_info } = this.props;
        let data = new FormData();
        data.append("name", market_product_info.name);
        data.append("description", market_product_info.description);
        data.append("price", market_product_info.price);
        data.append("category", market_product_info.category);
        let product_status;
        if (market_product_info.product_status == 'HIDE') {
            product_status = 'AVAILABLE';
        } else {
            product_status = 'HIDE';
        }
        data.append("product_status", product_status);

        data.append("old_news_image", JSON.stringify(market_product_info.image));

        this.props.toggle_hide_product(market_product_info._id, data);
    }

    toggle_order_confirm = () => {
        this.setState(state => {
            return {
                order_product_confirm_modal: !state.order_product_confirm_modal
            }
        });
    }


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
                                <View key={index} style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, margin: 5, marginBottom: 10 }} >
                                    < View style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 5, flexDirection: 'row', alignItems: 'center', padding: 10, }} >
                                        < Image
                                            source={{ uri: each_accepted_user.ordered_by.profileImage }}
                                            style={{ width: 80, height: 80, borderRadius: 40, }} />
                                        < View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.name}</Text></View>
                                            <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.phoneNumber}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.location ? each_accepted_user.ordered_by.location.address : 'No Address'}</Text></View>
                                        </View >
                                    </View >
                                    <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 10, height: 45, backgroundColor: '#2196f3', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                        onPress={() => this.props.navigation.navigate('MarketPlaceDiscussion', { 'product': this.props.market_product_info, 'my_ordered_detail': each_accepted_user })}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Message</Text>
                                    </TouchableOpacity>
                                </View>

                            )
                        })
                    }
                    {
                        rejected_user.length > 0 &&


                        <View style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, margin: 5, marginBottom: 10 }} >
                            <View style={{ justifyContent: 'center', margin: 5 }}>
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

                <>
                    <View style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, margin: 5, }} >
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

                    <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                        onPress={() => this.toggle_hide_product()}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{this.props.market_product_info.product_status != 'HIDE' ? 'Hide this product' : 'Show this product'}</Text>
                    </TouchableOpacity>
                </>
            )

        }


    }


    render() {
        const { product_order_or_buy, show_loading, order_product_confirm_modal, delete_product_confirm_modal } = this.state;
        const { market_product_info } = this.props;
        if (market_product_info) {
            const product_image = market_product_info.image;
            let images = [];
            product_image.map(img => images.push({ url: img }));
            return (
                <Fragment>
                    <StatusBar backgroundColor={"#f09839"} />
                    {
                        show_loading ?

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={50} color='#F09839' />
                            </View>
                            :
                            <ScrollView style={{ padding: 10 }}>
                                {
                                    product_image.length === 1 ?

                                        < TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true, image_index: 0, })}>
                                            <Image source={{ uri: product_image[0] }} style={{ height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5, margin: 5 }} />
                                        </TouchableOpacity>

                                        :

                                        <ScrollView
                                            style={{
                                                minHeight: 200,
                                                marginVertical: 10,
                                                borderColor: '#222',
                                            }}
                                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}>
                                            {
                                                product_image.map((item, index) => (

                                                    <TouchableOpacity key={index} style={{ marginRight: 5 }} onPress={() => this.setState({ image_modal_visibility: true, image_index: index })}>
                                                        <Image source={{ uri: item }} style={{ width: 250, height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5 }} />
                                                    </TouchableOpacity>

                                                ))
                                            }

                                        </ScrollView>
                                }

                                <View style={{ margin: 5, flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f09839' }} >{market_product_info.name}</Text>
                                    <Text style={{ fontSize: 18 }}>{market_product_info.price} MMK</Text>
                                </View>
                                <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 13, }} >Seller's Note</Text>
                                    <Text style={{ fontSize: 13, fontStyle: 'italic' }}>{market_product_info.uploaded_date}</Text>
                                </View>
                                <View style={{ margin: 5, borderColor: '#222', borderWidth: 1, borderRadius: 5, padding: 5, minHeight: 70 }}>
                                    <Text style={{ fontSize: 14, fontStyle: 'italic' }} opacity={1}>{market_product_info.description}</Text>
                                </View>

                                {
                                    market_product_info.product_status == 'DELETE' ?


                                        <View style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>This product is deleted by OMT Admin.</Text>
                                        </View>
                                        :

                                        market_product_info.uploaded_by._id == this.props.user._id ?

                                            market_product_info.ordered_list.length ?


                                                <View style={{ marginBottom: 10 }}>

                                                    <View style={{ justifyContent: 'center', margin: 5 }}>
                                                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>{market_product_info.product_status == 'ACCEPTED' ? 'Buyer Info' : 'Select Buyer From Bottom'}</Text>
                                                    </View>
                                                    <ScrollView>
                                                        {
                                                            this.get_accepted_user()
                                                        }
                                                    </ScrollView>

                                                </View>

                                                :

                                                <>
                                                    <TouchableOpacity style={{ marginTop: 20, marginBottom: 10, marginHorizontal: 5, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                                        onPress={() => this.props.navigation.navigate('EditMarketPlace', { product: market_product_info })}>
                                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Edit</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ marginBottom: 20, marginHorizontal: 5, height: 45, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                                        onPress={() => this.toggle_hide_product()}>
                                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{market_product_info.product_status != 'HIDE' ? 'Hide this product' : 'Show this product'}</Text>
                                                    </TouchableOpacity>
                                                </>


                                            :


                                            market_product_info.product_status == 'HIDE' ?


                                                <View style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>This product is not available.</Text>
                                                </View>

                                                :

                                                <>
                                                    <View style={{ margin: 5 }}>
                                                        <Text style={{ fontSize: 13, }}>Seller's Information</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ backgroundColor: '#FFFFFF', elevation: 1, borderRadius: 5, flexDirection: 'row', alignItems: 'center', padding: 10, margin: 5 }}
                                                        onPress={() => this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': market_product_info.uploaded_by })}>
                                                        < Image
                                                            source={{ uri: market_product_info.uploaded_by.profileImage }}
                                                            style={{ width: 80, height: 80, borderRadius: 40, }} />
                                                        < View style={{ flex: 1, flexDirection: 'column', marginLeft: 10, }}>
                                                            <Text>{market_product_info.uploaded_by.name}</Text>
                                                            <Text>{market_product_info.uploaded_by.location ? market_product_info.uploaded_by.location.address : 'No Address'}</Text>
                                                        </View >
                                                    </TouchableOpacity >

                                                    {



                                                        product_order_or_buy === 'Request Order' ?
                                                            <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                                                onPress={() => this.toggle_order_confirm()}>
                                                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{product_order_or_buy}</Text>
                                                            </TouchableOpacity>

                                                            :

                                                            product_order_or_buy === 'Your order is accepted. Click to message.' ?

                                                                <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: '#2196f3', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                                                    onPress={() => this.props.navigation.navigate('MarketPlaceDiscussion', { 'product': market_product_info })}>
                                                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{product_order_or_buy}</Text>
                                                                </TouchableOpacity>

                                                                :

                                                                product_order_or_buy === 'Your order is rejected due to out of stock.' ?

                                                                    <View style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{product_order_or_buy}</Text>
                                                                    </View>

                                                                    :

                                                                    <View style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{product_order_or_buy}</Text>
                                                                    </View>

                                                    }
                                                </>

                                }
                            </ScrollView>

                    }
                    <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                        <ImageViewer
                            index={this.state.image_index}
                            onCancel={this._toggleModal}
                            imageUrls={images}
                            enableSwipeDown={true}
                        />
                    </Modal>
                    <Modal
                        animationType="none" transparent={true} visible={this.state.selected_user_view_modal_visibility} onRequestClose={this.toggle_select_user_modal} >
                        {
                            this.state.selected_user_view_modal_visibility ?

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>

                                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                                        <View style={{ marginBottom: 20 }}>
                                            <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Sell the product to this user</Text>
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
                    <Modal animationType='none' visible={order_product_confirm_modal} transparent onRequestClose={this.toggle_order_confirm} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 55, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20, }} >
                                <View style={{ marginBottom: 20, }}>
                                    <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Confirm Order!</Text>
                                </View>
                                <View style={{ marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15 }}>Are you sure you want to order this product?</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <TouchableHighlight onPress={this.toggle_order_confirm} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.order_market_product()} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Confirm</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal animationType='none' visible={delete_product_confirm_modal} transparent onRequestClose={this.toggle_delete_confirm} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 55, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20, }} >
                                <View style={{ marginBottom: 20, }}>
                                    <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Confirm Delete!</Text>
                                </View>
                                <View style={{ marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15 }}>Are you sure you want to delete this product? If you detele , you can't get the product again.</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <TouchableHighlight onPress={this.toggle_delete_confirm} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.delete_product()} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Delete</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Fragment >
            )

        }
        else {
            return (
                <View />
            )
        }
    }

    _toggleModal = () => {
        this.setState(state => {
            return {
                image_modal_visibility: !state.image_modal_visibility
            }
        });
    }

    _keyExtractor = (item, index) => 'index ' + index;

    render_image = ({ item }) => {

        return (

            <View style={{ marginRight: 5 }}>

                <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                    <Image source={{ uri: item }} style={{ width: 250, height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#ECC951', borderRadius: 5 }} />
                </TouchableOpacity>

            </View>

        )
    }

    edit_profile = (user) => {
        this.props.navigation.navigate('EditProfile', { 'user': { user } });
    }

    order_market_product() {

        this.toggle_order_confirm();
        let { user, market_product_info } = this.props;
        let image = user.profileImage, address = user.location ? user.location.address : null, phone_number = user.phoneNumber;
        if (!image || !address || !phone_number) {
            alert('Please fill your photo , phone number and address info in your profile in order to reach out to you.')
            this.edit_profile(user);
        } else {
            let ordered_by = user._id;
            let ordered_by_name = user.name;
            let data = new FormData();
            const device_id = market_product_info.uploaded_by.device_id;
            const uploaded_by = market_product_info.uploaded_by._id;
            const product_name = market_product_info.name;
            const product_image = market_product_info.image[0];
            data.append("ordered_by", ordered_by);
            data.append("ordered_by_name", ordered_by_name);
            data.append("uploaded_by", uploaded_by);
            data.append("product_name", product_name);
            data.append("device_id", device_id);
            data.append("product_image", product_image);

            this.props.order_market_product(market_product_info._id, data);
        }
    }



}


const mapStateToProps = state => ({
    user: state.user.user,
    market_product_info: state.market_place.market_product_info
})

const mapDispatchToProps = dispatch => ({
    order_market_product: (product_id, data) => {
        dispatch(order_market_product(product_id, data));
    },
    toggle_hide_product: (product_id, data) => {
        dispatch(toggle_hide_product(product_id, data));
    },
    get_market_product_info: (product_id) => {
        dispatch(get_market_product_info(product_id));
    },
    accept_my_market_product_ordered: (product_id, data) => {
        dispatch(accept_my_market_product_ordered(product_id, data));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlaceDetail);


const styles = StyleSheet.create({
    container: {
        height: 300,
        alignItems: 'stretch'
    },
});