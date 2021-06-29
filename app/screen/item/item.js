import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AddIcon from 'react-native-vector-icons/MaterialIcons';
import EllipsisIcon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Modal,
    Linking,
    Alert,
    BackHandler,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { get_item_list, delete_item } from '../../redux/actions/itemAction';
import VersionCheck from 'react-native-version-check';

class Item extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            selected_item_group: this.item_group[0],
            selected_item_group_list: [],
            oh_my_trash_game: false,
            show_again: false,
            delete_item_modal_visibility: false,
            delete_item_id: null,
            report_item_modal_visibility: false,
            report_item_id: null,
            check_box_one: false,
            check_box_two: false,
            check_box_three: false,
        }

    }

    item_group = ['All', 'Metal', 'Plastic', 'Glass', 'E-Waste', 'Paper', 'Other'];

    async componentDidMount() {

        const app_continue = await this.check_version();
        if (app_continue) {
            const oh_my_trash_game = await AsyncStorage.getItem('oh_my_trash_game') == null ? true : false;
            this.setState({ oh_my_trash_game: oh_my_trash_game })
            this.props.get_item_list();
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.item_list !== prevProps.item_list) {
            // console.log('item list : ', this.props.item_list);
            this.filter_item_group(this.state.selected_item_group);
        }
    }

    _menu = [];


    render_item = ({ item }) => {

        return (

            <TouchableOpacity style={{ backgroundColor: '#FFF', elevation: 1, borderRadius: 5, margin: 10, padding: 15 }} onPress={() => this.props.navigation.navigate('ItemDetail', { item: item })}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item.image[0] }} style={{ width: 90, height: 90, borderRadius: 45 }} />
                    </View>
                    <View style={{ flex: 2, justifyContent: 'space-between', padding: 2 }}>

                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'left', fontSize: 18, color: '#f09839' }}>{item.name}</Text>
                            {

                                this.props.user.type == 'ADMIN' ?
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: 1,
                                            top: 1,
                                            zIndex: 2,
                                            padding: 10
                                        }}
                                        onPress={() => this._menu[item._id].show()}>
                                        <Menu
                                            ref={ref => { this._menu[item._id] = ref }}
                                            button={<EllipsisIcon size={20} name={'ellipsis-v'} onPress={() => this._menu[item._id].show()} />}
                                        >
                                            <MenuItem onPress={() => { this._menu[item._id].hide(); this.edit_item(item) }}> Edit</MenuItem>
                                            <MenuDivider />
                                            <MenuItem onPress={() => { this._menu[item._id].hide(); this.delete_confirm(item) }}> Delete</MenuItem>
                                            <MenuDivider />
                                            <MenuItem onPress={() => { this._menu[item._id].hide(); this.report_item() }}> Report this post</MenuItem>
                                        </Menu>
                                    </TouchableOpacity>

                                    :

                                    this.props.user.permission.item ?
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                right: 1,
                                                top: 1,
                                                zIndex: 2,
                                                padding: 10
                                            }}
                                            onPress={() => this._menu[item._id].show()}>
                                            <Menu
                                                ref={ref => { this._menu[item._id] = ref }}
                                                button={<EllipsisIcon size={20} name={'ellipsis-v'} onPress={() => this._menu[item._id].show()} />}
                                            >
                                                <MenuItem onPress={() => { this._menu[item._id].hide(); this.edit_item(item) }}> Edit</MenuItem>
                                                <MenuDivider />
                                                <MenuItem onPress={() => { this._menu[item._id].hide(); this.report_item(item) }}> Report this post</MenuItem>
                                            </Menu>
                                        </TouchableOpacity>
                                        :

                                        Platform.OS === 'ios' &&
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                right: 1,
                                                top: 1,
                                                zIndex: 2,
                                                padding: 10
                                            }}
                                            onPress={() => this._menu[item._id].show()}>
                                            <Menu
                                                ref={ref => { this._menu[item._id] = ref }}
                                                button={<EllipsisIcon size={20} name={'ellipsis-v'} onPress={() => this._menu[item._id].show()} />}
                                            >
                                                <MenuItem onPress={() => { this._menu[item._id].hide(); this.report_item(item) }}> Report this post</MenuItem>
                                            </Menu>
                                        </TouchableOpacity>
                            }
                        </View>

                        {

                            item.description != 'null' ?
                                <Text style={{ textAlign: 'auto' }}>{item.description}</Text>
                                :
                                <Text style={{ textAlign: 'auto' }}></Text>

                        }


                        <View style={{ flexDirection: 'row', alignContent: 'flex-end' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontStyle: 'italic' }}>{item.price[0].currency} </Text>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontStyle: 'italic' }}>{item.price[0].min_price}</Text>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontStyle: 'italic' }}> ~ </Text>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontStyle: 'italic' }}>{item.price[0].max_price}</Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity >
        )
    }

    _keyExtractor = (item) => item._id;

    add_item() {
        this.props.navigation.navigate('AddItem');
    }

    edit_item(item) {
        this.props.navigation.navigate('EditItem', { 'item': { item } });
    }

    report_item = () => {
        // this.setState({ report_item_id: item._id })
        this.toggle_report_item();
    }

    toggle_report_item = () => {
        this.setState(state => {
            return {
                report_item_modal_visibility: !state.report_item_modal_visibility
            }
        });
        this.forceUpdate();
        this.render();
    }

    delete_confirm = (item) => {
        this.setState({ delete_item_id: item._id })
        this.toggle_delete_item();
    }

    toggle_delete_item = () => {
        this.setState(state => {
            return {
                delete_item_modal_visibility: !state.delete_item_modal_visibility
            }
        });
    }

    delete_item = () => {
        // this.setState({ show_loading: true });
        this.toggle_delete_item();
        const { delete_item_id } = this.state;
        this.props.delete_item(delete_item_id);
        // setTimeout(() => { this.setState({ show_loading: false }); }, 300);
    }

    toggle_oh_my_trash_game = () => {
        this.setState(state => {
            return {
                oh_my_trash_game: !state.oh_my_trash_game
            }
        });
        let { show_again } = this.state;
        if (show_again) {
            AsyncStorage.setItem('oh_my_trash_game', '' + show_again);
        }
    }

    toggle_show_again = () => {
        this.setState(state => {
            return {
                show_again: !state.show_again
            }
        });
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

    filter_item_group(item) {

        const { item_list } = this.props;
        let filtered_list;
        if (item == 'All') {
            filtered_list = [...item_list]
        } else {
            filtered_list = item_list.filter(i => i.group == item);
        }
        this.setState({ selected_item_group: item, selected_item_group_list: filtered_list });
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

    render() {

        let { selected_item_group, selected_item_group_list, oh_my_trash_game, show_again, delete_item_modal_visibility, report_item_modal_visibility } = this.state;
        let { user } = this.props;
        return (

            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />

                {
                    report_item_modal_visibility ?

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                            <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20, }} >
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
                                    <TouchableHighlight onPress={this.toggle_report_item} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => { this.toggle_report_item(); setTimeout(() => Alert.alert('Report Success!', 'We will review the post and take the action ASAP. Thank you for letting us know!'), 1000) }} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                        <Text style={{ fontSize: 16, color: '#f09839' }}>Report</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>

                        :


                        <View style={{ flex: 1 }}>
                            <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap' }} >

                                {
                                    this.item_group.map(item => {

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

                            </View>

                            {

                                selected_item_group_list.length > 0 ?
                                    <FlatList
                                        data={selected_item_group_list}
                                        renderItem={this.render_item}
                                        keyExtractor={this._keyExtractor}
                                    />
                                    :
                                    null
                            }

                            {

                                user.permission.item &&

                                <TouchableOpacity style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    position: 'absolute',
                                    bottom: 20,
                                    right: 20,
                                    zIndex: 1,
                                    backgroundColor: '#F09839',
                                    elevation: 5,
                                    padding: 10
                                }}
                                    onPress={() => this.add_item()}
                                >
                                    <AddIcon name="add" color="#FFF" size={30} />
                                </TouchableOpacity>

                            }
                        </View>

                }


                <Modal animationType="none" visible={oh_my_trash_game} transparent={true} onRequestClose={this.toggle_oh_my_trash_game} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                            <View style={{ marginBottom: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Oh My Trash Game</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require('../../asset/image/oh_my_trash_game.png')}
                                    style={{ height: 150, resizeMode: 'contain' }} />
                            </View>
                            <View>
                                <TouchableOpacity style={{ marginVertical: 10, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                    onPress={() => Linking.openURL('https://bit.ly/2VWYKSc')}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Download Game</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 50, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <CheckBox
                                        onCheckColor='#f09839'
                                        onTintColor='#f09839'
                                        value={show_again}
                                        onValueChange={() => this.toggle_show_again()} />
                                    <Text style={{ marginLeft: 5 }}>Don't show again</Text>
                                </View>
                                <TouchableHighlight onPress={() => this.toggle_oh_my_trash_game()} style={{ padding: 5 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="none" visible={delete_item_modal_visibility} transparent={true} onRequestClose={this.toggle_delete_item} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20 }} >
                            <View style={{ marginBottom: 20, }}>
                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>Confirm Delete!</Text>
                            </View>
                            <View style={{ marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16 }}>Are you sure you want to delete this item?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', height: 50 }}>
                                <TouchableHighlight onPress={this.toggle_delete_item} style={{ width: '50%', justifyContent: 'center', padding: 5 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>CANCEL</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => this.delete_item()} style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end', padding: 5 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* <Modal animationType='none' visible={this.state.report_item_modal_visibility} transparent onRequestClose={this.toggle_report_item} >

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 55, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 20, }} >
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
                                <TouchableHighlight onPress={this.toggle_report_item} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839' }}>Cancel</Text>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => { Alert.alert('Report Success!', 'We will review the post and take the action ASAP. Thank you for letting us know!'); this.toggle_report_item(); }} style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }} underlayColor={'#f1f1f1'}>
                                    <Text style={{ fontSize: 16, color: '#f09839' }}>Report</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal> */}
            </Fragment >

        )
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    item_list: state.item.item_list,
})

const mapDispatchToProps = dispatch => ({
    get_item_list: () => {
        dispatch(get_item_list());
    },
    delete_item: (item_id) => {
        dispatch(delete_item(item_id));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Item);