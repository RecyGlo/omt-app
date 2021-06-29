import React, { Fragment } from 'react';
import {
    View,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    Modal,
    Alert,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import { get_news_list, delete_news } from '../../redux/actions/newsAction';
import AddIcon from 'react-native-vector-icons/MaterialIcons';
import EllipsisIcon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import CheckBox from '@react-native-community/checkbox';


class News extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            delete_news_modal_visibility: false,
            delete_news_id: null,
            show_loading: true,
            report_news_modal_visibility: false,
            report_news_id: null,
            check_box_one: false,
            check_box_two: false,
            check_box_three: false,
        }

    }

    componentDidMount() {
        this.props.get_news_list();
        setTimeout(() => this.setState({ show_loading: false }), 1000);
    }

    _menu = [];

    toggle_delete_news_modal = () => {
        this.setState(state => {
            return {
                delete_news_modal_visibility: !state.delete_news_modal_visibility
            }
        });
    }

    delete_confirm = (item) => {

        this.setState({ delete_news_id: item._id })
        this.toggle_delete_news_modal();

    }

    _keyExtractor = (item) => item._id;

    add_news() {
        this.props.navigation.navigate('AddNews');
    }

    edit_news(item) {
        this.props.navigation.navigate('EditNews', { news: item });
    }

    report_news = (item) => {
        this.setState({ report_news_id: item._id })
        this.toggle_report_news();
    }

    toggle_report_news = () => {
        this.setState(state => {
            return {
                report_news_modal_visibility: !state.report_news_modal_visibility
            }
        });
        this.forceUpdate();
        this.render();
    }

    toggle_check_box_one = () => {
        this.setState(state => {
            return {
                check_box_one: !state.check_box_one
            }
        });
    }

    toggle_check_box_two = () => {
        this.setState(state => {
            return {
                check_box_two: !state.check_box_two
            }
        });
    }

    toggle_check_box_three = () => {
        this.setState(state => {
            return {
                check_box_three: !state.check_box_three
            }
        });
    }

    delete_news = () => {
        // this.setState({ show_loading: true });
        this.toggle_delete_news_modal()
        const { delete_news_id } = this.state;
        this.props.delete_news(delete_news_id);
        // setTimeout(() => { this.setState({ show_loading: false }); }, 300);
    }

    render() {
        const { delete_news_modal_visibility, show_loading, report_news_modal_visibility } = this.state;
        let { news_list, user } = this.props;
        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />

                {
                    report_news_modal_visibility ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, paddingHorizontal: 20, paddingVertical: 10 }} >
                                <View style={{ marginBottom: 20, }}>
                                    <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Report this post!</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <CheckBox
                                        onCheckColor='#f09839'
                                        onTintColor='#f09839'
                                        value={this.state.check_box_one}
                                        onValueChange={() => this.toggle_check_box_one()} />
                                    <Text style={{ marginLeft: 5 }}>I think it's fake , spam or scam</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <CheckBox
                                        onCheckColor='#f09839'
                                        onTintColor='#f09839'
                                        value={this.state.check_box_two}
                                        onValueChange={() => this.toggle_check_box_two()} />
                                    <Text style={{ marginLeft: 5 }}>I think the image or language is offensive</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <CheckBox
                                        onCheckColor='#f09839'
                                        onTintColor='#f09839'
                                        value={this.state.check_out_three}
                                        onValueChange={() => this.toggle_check_box_three()} />
                                    <Text style={{ marginLeft: 5 }}>I think it shows or promotes violence or terrorism</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <TouchableHighlight onPress={() => this.toggle_report_news()} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => { this.toggle_report_news(); setTimeout(() => Alert.alert('Report Success!', 'We will review the post and take the action ASAP. Thank you for letting us know!'), 1000) }} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Report</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>

                        :



                        <View style={{ flex: 1, padding: 10 }}>
                            {
                                show_loading ?

                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size={50} color='#F09839' />
                                    </View>

                                    :
                                    news_list.length > 0 ?
                                        <FlatList
                                            data={news_list}
                                            renderItem={this.render_news}
                                            keyExtractor={this._keyExtractor}
                                        />
                                        :
                                        null

                            }

                        </View>
                }
                {

                    user.permission.news &&
                    <TouchableOpacity style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        backgroundColor: '#F09839',
                        elevation: 5,
                        padding: 10
                    }}
                        onPress={() => this.add_news()}
                    >
                        <AddIcon name="add" color="#FFF" size={30} />
                    </TouchableOpacity>
                }

                <Modal animationType="none" visible={delete_news_modal_visibility} transparent={true} onRequestClose={this.toggle_delete_news_modal} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                            <View style={{ marginBottom: 20, }}>
                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Confirm Delete!</Text>
                            </View>
                            <View style={{ marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16 }}>Are you sure you want to delete this news?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', height: 50 }}>
                                <TouchableHighlight onPress={() => this.toggle_delete_news_modal()} style={{ width: '50%', justifyContent: 'center', padding: 5 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>CANCEL</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => this.delete_news()} style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end', padding: 5 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* <Modal
                    animationType='none' visible={report_news_modal_visibility} transparent onRequestClose={this.toggle_report_news} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 55, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, paddingHorizontal: 20, paddingVertical: 10 }} >
                            <View style={{ marginBottom: 20, }}>
                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Report this post!</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <CheckBox
                                    onCheckColor='#f09839'
                                    onTintColor='#f09839'
                                    value={this.state.check_box_one}
                                    onValueChange={() => this.toggle_check_box_one()} />
                                <Text style={{ marginLeft: 5 }}>I think it's fake , spam or scam</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                <CheckBox
                                    onCheckColor='#f09839'
                                    onTintColor='#f09839'
                                    value={this.state.check_box_two}
                                    onValueChange={() => this.toggle_check_box_two()} />
                                <Text style={{ marginLeft: 5 }}>I think the image or language is offensive</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <CheckBox
                                    onCheckColor='#f09839'
                                    onTintColor='#f09839'
                                    value={this.state.check_out_three}
                                    onValueChange={() => this.toggle_check_box_three()} />
                                <Text style={{ marginLeft: 5 }}>I think it shows or promotes violence or terrorism</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <TouchableHighlight onPress={() => this.toggle_report_news()} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => { Alert.alert('Report Success!', 'We will review the post and take the action ASAP. Thank you for letting us know!'); this.toggle_report_news(); }} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839' }}>Report</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal> */}
            </Fragment>

        )
    }


    render_news = ({ item }) => {

        return (
            <TouchableOpacity key={item._id} onPress={() => this.props.navigation.navigate('NewsDetail', { news: item })}>

                <View style={{ alignSelf: 'auto' }}>
                    <ImageBackground
                        source={{ uri: item.image[0] }} style={{ height: 200, alignItems: 'flex-end', borderRadius: 20, padding: 2, }} opacity={0.9}>
                        {
                            this.props.user.type == 'ADMIN' ?
                                <Menu
                                    ref={ref => { this._menu[item._id] = ref }}
                                    button={<EllipsisIcon style={{ paddingRight: 10 }} size={20} name={'ellipsis-v'} onPress={() => this._menu[item._id].show()} />}
                                >
                                    <MenuItem onPress={() => { this._menu[item._id].hide(); this.edit_news(item) }}>Edit</MenuItem>
                                    <MenuDivider />
                                    <MenuItem onPress={() => { this._menu[item._id].hide(); this.delete_confirm(item) }}>Delete</MenuItem>
                                    <MenuDivider />
                                    <MenuItem onPress={() => { this._menu[item._id].hide(); this.report_news(item) }}> Report this post</MenuItem>
                                </Menu>

                                :

                                this.props.user.permission.news ?

                                    <Menu
                                        ref={ref => { this._menu[item._id] = ref }}
                                        button={<EllipsisIcon style={{ paddingRight: 10 }} size={20} name={'ellipsis-v'} onPress={() => this._menu[item._id].show()} />}
                                    >
                                        <MenuItem onPress={() => { this._menu[item._id].hide(); this.edit_news(item) }}>Edit</MenuItem>
                                        <MenuDivider />
                                        <MenuItem onPress={() => { this._menu[item._id].hide(); this.report_news(item) }}> Report this post</MenuItem>
                                    </Menu>

                                    :

                                    Platform.OS === 'ios' &&
                                    <Menu
                                        ref={ref => { this._menu[item._id] = ref }}
                                        button={<EllipsisIcon size={20} name={'ellipsis-v'} style={{ marginRight: 10, flex: 1 }} onPress={() => this._menu[item._id].show()} />}
                                    >
                                        <MenuItem onPress={() => { this._menu[item._id].hide(); this.report_news(item) }}> Report this post</MenuItem>
                                    </Menu>
                        }
                    </ImageBackground>
                    <View style={{ backgroundColor: '#000000', width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, }} opacity={0.7}>
                        <Text style={{ minHeight: 30, color: '#FFF', fontSize: 15 }} opacity={1}>{item.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    news_list: state.news.news_list,
})

const mapDispatchToProps = dispatch => ({
    get_news_list: () => {
        dispatch(get_news_list());
    },
    delete_news: (news_id) => {
        dispatch(delete_news(news_id));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(News);

let styles = StyleSheet.create(
    {
        root: {
            backgroundColor: '#191e1f'
        },
        title: {
            marginBottom: 5,
            color: '#ECC951'
        },
    }
);
