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
    TouchableHighlight,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { get_market_product_info, toggle_hide_product } from '../../redux/actions/marketPlaceAction';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';

class MarketPlaceDashboardDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        this.state = {
            product_id: params.product_id,
            image_modal_visibility: false,
            image_index: 0,
            show_loading: true,
            message_modal_visibility: false,
            selected_user: null,
            ordered_detail: [],
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

        if (this.props.route.params.product_id != prevProps.route.params.product_id) {
            this.setState({ show_loading: true })
            this.props.get_market_product_info(this.props.route.params.product_id);
            setTimeout(() => this.setState({ show_loading: false }), 500);
        }

    }

    toggle_check_message = () => {
        this.setState(state => {
            return {
                message_modal_visibility: !state.message_modal_visibility
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
                                    < TouchableOpacity style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 5, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': each_accepted_user.ordered_by })}>
                                        < Image
                                            source={{ uri: each_accepted_user.ordered_by.profileImage }}
                                            style={{ width: 80, height: 80, borderRadius: 40, }} />
                                        < View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.name}</Text></View>
                                            <Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.phoneNumber}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_accepted_user.ordered_by.location ? each_accepted_user.ordered_by.location.address : 'No Address'}</Text></View>
                                        </View >
                                    </ TouchableOpacity >
                                    <TouchableOpacity style={{ marginVertical: 20, marginHorizontal: 10, height: 45, backgroundColor: '#2196f3', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                        onPress={() => { this.toggle_check_message(); this.setState({ ordered_detail: each_accepted_user }) }}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Check Messages</Text>
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
                                        <TouchableOpacity key={index} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': each_ordered_list.ordered_by })}>
                                            <Image
                                                source={{ uri: each_rejected_user.ordered_by.profileImage }}
                                                style={{ width: 80, height: 80, borderRadius: 40, }} />
                                            <View style={{ flexDirection: 'column', marginLeft: 10, overflow: 'hidden' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_rejected_user.ordered_by.name}</Text></View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 2 }}>{each_rejected_user.ordered_by.location ? each_rejected_user.ordered_by.location.address : 'No Address'}</Text></View>
                                            </View>
                                        </TouchableOpacity>
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
                                    <TouchableOpacity key={index} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', padding: 10, }} onPress={() => this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': each_ordered_list.ordered_by })}>
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
                </>
            )

        }


    }


    render_item = ({ item }) => {

        let { ordered_detail } = this.state;

        if (item.message_by == this.props.market_product_info.uploaded_by._id) {
            return (

                <View style={{ margin: 8, marginLeft: 70 }} >
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => { this.toggle_check_message(); this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': this.props.market_product_info.uploaded_by }) }}>
                            <Image
                                source={{ uri: this.props.market_product_info.uploaded_by.profileImage }}
                                style={{ width: 40, height: 40, borderRadius: 20, }} />
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#2196F3', elevation: 5, borderRadius: 5, marginRight: 5, padding: 10, }} >
                            <Text style={{ color: '#FFF' }}>{item.message}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', }}>
                        <Text style={{ color: '#222', marginRight: 45 }}>{moment(item.message_date).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>

            )
        } else {
            return (
                <View style={{ margin: 8, marginRight: 70 }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => { this.toggle_check_message(); this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': ordered_detail.ordered_by }) }}>
                            <Image
                                source={{ uri: ordered_detail.ordered_by.profileImage }}
                                style={{ width: 40, height: 40, borderRadius: 20, }} />
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#F09839', elevation: 5, borderRadius: 5, marginLeft: 5, flexDirection: 'row', padding: 10, }} >
                            <Text style={{ color: '#fff' }}>{item.message}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: '#222', marginLeft: 45 }}>{moment(item.message_date).format('DD-MM-YYYY')}</Text>
                    </View>
                </View>


            )
        }


    }

    _keyExtractor = (item, index) => index + '';


    render() {
        const { show_loading, ordered_detail, delete_product_confirm_modal } = this.state;
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

                                <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f09839' }} >{market_product_info.name}</Text>
                                    <Text style={{ fontSize: 15, }}>{market_product_info.price} MMK</Text>
                                </View>
                                <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 13, }} >Seller's Note</Text>
                                    <Text style={{ fontSize: 13, fontStyle: 'italic' }}>{market_product_info.uploaded_date}</Text>
                                </View>
                                <View style={{ margin: 5, borderColor: '#222', borderWidth: 1, borderRadius: 5, padding: 5, minHeight: 70 }}>
                                    <Text style={{ fontSize: 14, fontStyle: 'italic' }} opacity={1}>{market_product_info.description}</Text>
                                </View>
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
                                    market_product_info.product_status == 'DELETE' ?


                                        <View style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>This product is deleted by OMT Admin.</Text>
                                        </View>
                                        :

                                        market_product_info.product_status == 'HIDE' ?


                                            <View style={{ marginVertical: 20, marginHorizontal: 5, height: 45, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>This product is not available.</Text>
                                            </View>

                                            :

                                            market_product_info.ordered_list.length ?


                                                <View style={{ marginBottom: 20 }}>

                                                    <View style={{ justifyContent: 'center', margin: 5 }}>
                                                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#f09839' }}>{market_product_info.product_status == 'ACCEPTED' ? 'Buyer Info' : 'Buyer List'}</Text>
                                                    </View>
                                                    <ScrollView>
                                                        {
                                                            this.get_accepted_user()
                                                        }
                                                    </ScrollView>

                                                </View>

                                                :

                                                null

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
                        animationType="none" transparent={true} visible={this.state.message_modal_visibility} onRequestClose={this.toggle_check_message} >
                        {
                            this.state.message_modal_visibility ?

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginVertical: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>

                                    <View style={{ width: '100%', backgroundColor: '#FFF', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                                        <View style={{ marginBottom: 20 }}>
                                            <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Messages</Text>
                                        </View>
                                        <FlatList
                                            data={ordered_detail.note}
                                            renderItem={this.render_item}
                                            keyExtractor={this._keyExtractor}
                                        />
                                        <TouchableOpacity style={{ marginVertical: 10, height: 45, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                            onPress={() => this.toggle_check_message()}>
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                :
                                null
                        }
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

}


const mapStateToProps = state => ({
    user: state.user.user,
    market_product_info: state.market_place.market_product_info
})

const mapDispatchToProps = dispatch => ({
    toggle_hide_product: (product_id, data) => {
        dispatch(toggle_hide_product(product_id, data));
    },
    get_market_product_info: (product_id) => {
        dispatch(get_market_product_info(product_id));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlaceDashboardDetail);


const styles = StyleSheet.create({
    container: {
        height: 300,
        alignItems: 'stretch'
    },
});