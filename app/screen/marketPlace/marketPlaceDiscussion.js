import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    TextInput,
    StatusBar,
    FlatList,
} from 'react-native';
import { get_market_product_info, send_message } from '../../redux/actions/marketPlaceAction';
import io from 'socket.io-client/dist/socket.io';
import moment from 'moment';
import { message_socket } from '../../api/endPoints';


class MarketPlaceDiscussion extends React.Component {


    constructor(props) {
        super(props);
        let { product, my_ordered_detail } = this.props.route.params;
        this.state = {
            product: product,
            ordered_by: my_ordered_detail ? my_ordered_detail.ordered_by : this.props.user,
            input_message: null,
            show_loading: true,
        }
        this.socket = io(message_socket + '?user_id=' + this.props.user._id);

    }

    componentDidMount() {
        this.subscribeToDiscussMessageSocket();
        this.props.get_market_product_info(this.state.product._id);
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }

    _onMessageReceived = (data) => {
        // console.log("message", data);
        this.props.get_market_product_info(this.state.product._id);

    };

    subscribeToDiscussMessageSocket() {
        this.socket.on('message', this._onMessageReceived);
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    render_item = ({ item }) => {

        let { ordered_by } = this.state;
        let { user } = this.props;

        if (item.message_by == user._id) {
            return (

                <View style={{ margin: 8, marginLeft: 70 }} >
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', }}>
                        <Image
                            source={{ uri: ordered_by._id != user._id ? this.props.market_product_info.uploaded_by.profileImage : this.state.ordered_by.profileImage }}
                            style={{ width: 40, height: 40, borderRadius: 20, }} />
                        <View style={{ backgroundColor: '#fff', elevation: 5, borderRadius: 5, marginRight: 5, padding: 10, }} >
                            <Text style={{ color: '#222' }}>{item.message}</Text>
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('MarketPlaceProfile', { 'uploaded_by': ordered_by._id != user._id ? this.state.ordered_by : this.props.market_product_info.uploaded_by })}>
                            <Image
                                source={{ uri: ordered_by._id != user._id ? this.state.ordered_by.profileImage : this.props.market_product_info.uploaded_by.profileImage }}
                                style={{ width: 40, height: 40, borderRadius: 20, }} />
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5, marginLeft: 5, flexDirection: 'row', padding: 10, }} >
                            <Text style={{ color: '#222' }}>{item.message}</Text>
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

    send_message() {

        let { product, input_message, ordered_by } = this.state;
        const { user, market_product_info } = this.props;

        if (input_message) {
            let note = {
                message: input_message,
                message_by: user._id
            }

            let sender_name = user.name;
            let sent_to = ordered_by._id;
            let device_id = ordered_by.device_id;

            if (ordered_by._id == user._id) {
                sent_to = market_product_info.uploaded_by._id;
                device_id = market_product_info.uploaded_by.device_id;
            }

            let data = new FormData();
            data.append("ordered_by", ordered_by._id);
            data.append("note", JSON.stringify(note));
            data.append("sent_to", sent_to);
            data.append("device_id", device_id);
            data.append("sender_name", sender_name);
            data.append("product_name", product.name);
            data.append("product_image", product.image[0]);

            this.props.send_message(product._id, data);
            this.setState({ input_message: null })
        } else {
            alert('Type something and send message.')
        }

    }


    render() {

        let { input_message, show_loading, ordered_by } = this.state;
        const { market_product_info } = this.props;
        let my_ordered_detail = [];
        if (market_product_info) {
            my_ordered_detail = market_product_info.ordered_list.filter(each_order => {
                return each_order.ordered_by._id == ordered_by._id
            });
        }

        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flex: 1, }}>
                    <View style={{
                        flex: 10,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        backgroundColor: '#f7f8fc',
                        // transform: [{ scaleY: -1 }]
                    }}>
                        {
                            show_loading ?

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size={50} color='#F09839' />
                                </View>

                                :

                                my_ordered_detail.length > 0 ?
                                    <FlatList
                                        ref={ref => this.flatList = ref}
                                        onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                                        onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                                        data={my_ordered_detail[0].note}
                                        renderItem={this.render_item}
                                        keyExtractor={this._keyExtractor}
                                    // initialScrollIndex={my_ordered_detail[0].note.length - 1}
                                    />
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>No Message</Text>
                                    </View>
                        }
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'flex-end', padding: 10, alignSelf: 'baseline', }}>
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#222222", borderRadius: 10, marginBottom: 10, minHeight: 30, width: '90%' }} multiline={true} placeholder={"Message"} value={input_message} onChangeText={(input) => { this.setState({ input_message: input }) }} />
                        <TouchableOpacity onPress={() => this.send_message()}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="send-circle" size={45} color={"#f09839"}></Icon>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </Fragment >
        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    market_product_info: state.market_place.market_product_info
})

const mapDispatchToProps = dispatch => ({
    get_market_product_info: (data) => {
        dispatch(get_market_product_info(data));
    },
    send_message: (product_id, data) => {
        dispatch(send_message(product_id, data));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlaceDiscussion);
