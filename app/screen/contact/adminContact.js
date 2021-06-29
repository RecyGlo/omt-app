import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    AsyncStorage,
    Text,
    StatusBar,
    StyleSheet,
    FlatList,
    Modal,
    TouchableHighlight,
    Linking, Platform,
} from 'react-native';
import axios from 'axios';
import { contact } from '../../api/endPoints';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import AddIcon from 'react-native-vector-icons/MaterialIcons';

export default class AddContact extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Contacts for COVID 19",
            headerStyle: {
                elevation: 0,
                backgroundColor: '#f09839',
            },
            headerTitleStyle: {
                fontWeight: '700',
            },
        }
    }


    constructor(props) {
        super(props);
        this.state = {
            token: null,
            contact_list: [],
            selected_contact_view_modal_visibility: false,
            selected_contact: null,
            selected_contact_category: 'All',
            contact_category_list: [],
            selected_category_contact_list: []
        }


    }

    async componentDidMount() {

        await AsyncStorage.multiGet(['access_token', 'user_id']).then(data => {
            if (data) {
                this.setState({ token: data[0][1], news_permission: data[1][1] });
            } else {
                alert('false');
            }
        })
        this.get_contact_list();
    }

    get_contact_list = () => {
        let { token } = this.state;
        axios.get(contact,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                this.setState({
                    contact_list: response.data.data
                })
                this.get_contact_category_list();
                this.filter_contact_category(this.state.selected_contact_category);
            })
            .catch(error => {
                console.log(error);
            });
    }

    get_contact_category_list = () => {

        const { contact_list, contact_category_list } = this.state;
        contact_category_list.push('All');
        contact_category_list.push('General');
        contact_list.map(each_contact => {
            if (each_contact.category != '') {
                contact_category_list.push(each_contact.category)
            }
        })
    }

    filter_contact_category(selected_contact_category) {

        const { contact_list } = this.state;
        let filtered_list;
        let temp_selected_contact_category = selected_contact_category;
        if (selected_contact_category == 'General') {
            selected_contact_category = '';
        }
        if (selected_contact_category == 'All') {
            filtered_list = [...contact_list]
        } else {
            filtered_list = contact_list.filter(i => {
                return i.category == selected_contact_category
            });
        }
        // console.log(filtered_list);
        this.setState({ selected_contact_category: temp_selected_contact_category, selected_category_contact_list: filtered_list });
        this.forceUpdate();
        this.render();
    }

    select_contact = (item) => {

        this.setState({ selected_contact: item })
        this.toggle_select_contact();

    }

    toggle_select_contact = () => {
        this.setState(state => {
            return {
                selected_contact_view_modal_visibility: !state.selected_contact_view_modal_visibility
            }
        });
    }

    render() {

        let {  selected_category_contact_list, contact_category_list, selected_contact_category } = this.state;
        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <View style={{ flex: 1 }}>
                    <View style={{ margin: 10, paddingVertical: 10 }} >
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                            {
                                contact_category_list.length > 0 ?
                                    contact_category_list.map((each_contact_category) => {

                                        if (selected_contact_category == each_contact_category) {

                                            return (
                                                <View key={each_contact_category} style={{ backgroundColor: '#222', minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginRight: 10, height: 35 }}>
                                                    <Text style={{ fontSize: 15, color: '#FFF', }}>{each_contact_category}</Text>
                                                </View>
                                            )

                                        } else {
                                            return (
                                                <TouchableOpacity key={each_contact_category} onPress={() => this.filter_contact_category(each_contact_category)} style={{ minWidth: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderColor: '#222', borderWidth: 1, padding: 10, marginRight: 10, height: 35 }}>
                                                    <Text style={{ fontSize: 15, color: '#9E9E9E', }}>{each_contact_category}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })
                                    :
                                    null

                            }
                        </ScrollView>
                    </View>
                    {
                        selected_category_contact_list.length > 0 ?
                            <FlatList
                                data={selected_category_contact_list}
                                renderItem={this.render_contact}
                                keyExtractor={this._keyExtractor}
                            />
                            :
                            null

                    }
                </View>
                <TouchableOpacity style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    zIndex: 3,
                    backgroundColor: '#FFF',
                    elevation: 5,
                    padding: 10
                }}
                    onPress={() => this.add_contact()}
                >
                    <AddIcon name="add" color="#000" size={30} />

                </TouchableOpacity>
                <Modal
                    animationType='none' visible={this.state.selected_contact_view_modal_visibility} transparent onRequestClose={this.toggle_select_contact} >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 56, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, padding: 10 }} >
                            <View style={{ marginBottom: 10, paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 20, color: '#f09839', fontWeight: '700' }}>{this.state.selected_contact_view_modal_visibility ? this.state.selected_contact.name : null}</Text>
                            </View>
                            <View style={{ marginBottom: 10, }}>
                                {
                                    this.state.selected_contact_view_modal_visibility &&

                                    this.state.selected_contact.phone_number.map(each_item => {
                                        return (
                                            <TouchableOpacity key={each_item} style={{ borderBottomColor: '#E0E0E0', borderBottomWidth: 1, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}
                                                onPress={() => this.make_call(each_item)}>
                                                <Text style={{ color: '#222', fontSize: 14 }}>{each_item}</Text>
                                                <PhoneIcon name='phone' color='#f09839' size={20} />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            <TouchableHighlight onPress={this.toggle_select_contact} style={{ alignSelf: 'flex-end', padding: 10 }} underlayColor={'#f1f1f1'}>
                                <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </Fragment >

        )
    }

    add_contact() {
        this.props.navigation.navigate('AddContact', { 'refresh': () => this.get_contact_list() });
    }

    make_call = (number) => {

        let phone_number = '';

        if (Platform.OS === 'android') {
            // phone_number = 'tel:${' + number + '}';
            phone_number = 'tel:' + number;
        } else {
            // phone_number = 'telprompt:${' + number + '}';
            phone_number = 'telprompt:' + number;
        }

        Linking.openURL(phone_number);
    }

    render_contact = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'column', margin: 10, padding: 10, backgroundColor: '#FFFFFF', elevation: 5, borderRadius: 5 }}>
                {
                    item.category ?
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ color: '#f09839', fontSize: 15, fontWeight: '700' }} >{item.category}</Text>
                        </View>
                        :
                        null
                }
                {
                    item.list.map((each_item) => {
                        return (
                            <TouchableOpacity
                                key={each_item._id}
                                onPress={() => this.select_contact(each_item)}
                                style={{ marginBottom: 10 }}>
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ color: '#222', fontSize: 15, fontWeight: '700' }} >{each_item.name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    {
                                        each_item.phone_number.map((each_phone_number, index) => {
                                            return (
                                                <Text key={index} style={{ color: '#222', fontSize: 14 }} >{each_phone_number}  </Text>
                                            )
                                        })
                                    }
                                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end', alignSelf: 'flex-end' }}>
                                        <PhoneIcon name='phone' color='#f09839' size={20} />
                                    </View>
                                </View>

                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    _keyExtractor = (item, index) => item.id;

    add_news() {
        this.props.navigation.navigate('AddNews', { 'refresh': () => this.get_contact_list() });
    }

}

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