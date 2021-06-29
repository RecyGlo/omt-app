import React, { Fragment } from 'react';

import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    AsyncStorage,
    TouchableOpacity,
    Modal,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
    Button
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import EditIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import ImageViewer from 'react-native-image-zoom-viewer';
import { contact } from '../../api/endPoints';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/Entypo';

export default class AddContact extends React.PureComponent {

    // <View style={{height:40,backgroundColor:'red',justifyContent:'center',padding:20}}><Text style={{fontSize:20}}>Account Details</Text></View>
    // static navigationOptions = () => ({
    //     header: <View style={{ height: 40, backgroundColor: '#f09839', justifyContent: 'center', padding: 20 }}><Text style={{ fontSize: 20 }}>Account Details</Text></View>
    // });

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Add Emergency Contact",
            headerStyle: {
                elevation: 0,
                backgroundColor: '#f09839'
            },
            headerTitleStyle: {
                fontWeight: '700',
            },
        }
    }


    constructor(props) {
        super(props);
        this.state = {
            news_image: [],
            image_selected: false,
            input_name: null,
            input_description: null,
            input_temp_phone_number: null,
            input_phone_number: [],
            phone_number_added: false,
            input_category: null,
            token: null,
            user_id: null,
            image_modal_visibility: false,
            add_button_loading: false,
        }
    }

    async componentDidMount() {

        await AsyncStorage.multiGet(['access_token', 'user_id']).then(data => {
            if (data) {
                this.setState({ token: data[0][1], user_id: data[1][1] });
            } else {
                alert('false');
            }
        })
    }


    onImagePick = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
            multiselect: true

        };

        ImagePicker.showImagePicker(options, response => {
            console.log(response)
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                alert(response.error);
            } else {
                this.setState({ news_image: [...news_image, response] });
                this.setState({ image_selected: true });
            }
        });
    }

    image_crop_pick = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: false
        }).then(image => {
            console.log(image);
        });
    }


    //pick image only
    pickImage = async () => {
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: true, mediaType: "photo" });
        let newImgs = this.state.news_image.concat(images);
        this.setState({ news_image: newImgs });
        this.setState({ image_selected: true });
    }

    image_view = () => {
        this.setState({ image_modal_visibility: true });
    }

    _toggleModal = () => {
        this.setState(state => {
            return {
                image_modal_visibility: !state.image_modal_visibility
            }
        });
    }


    renderImages(news_image) {

        let imgs = [];
        for (let img of news_image) {
            imgs.push(
                <View key={img.path} style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginLeft: 20,
                    marginRight: 5
                }}>
                    <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                        <Image key={img.path} source={{ uri: img.path }} style={{ width: 250, height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#ECC951', borderRadius: 5 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.removePhoto(img)} style={{
                        position: 'absolute',
                        right: 1,
                        top: 1,
                        zIndex: 2,
                    }}>
                        <FIcons name='delete' style={{ color: 'red', fontSize: 30 }} />
                    </TouchableOpacity>
                </View>
            );
        }
        imgs.push(
            <TouchableOpacity onPress={() => this.pickImage()} style={{
                width: 60,
                height: 60,
                borderWidth: 2,
                borderColor: '#ECC951',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 30,
                marginVertical: 100
            }}
                key={98} >
                <Icons name="plus" style={{ color: '#ECC951', fontSize: 48 }} />
            </TouchableOpacity >
        )
        return imgs;
    }

    removePhoto(image) {

        const { news_image } = this.state;
        const index = news_image.indexOf(image);
        const images = news_image;
        if (index > -1) {
            images.splice(index, 1);
        }
        if (images.length == 0 || null) {
            this.setState({ image_selected: false })
        }
        this.setState({ news_image: images });
        this.forceUpdate();
        this.render();
    }

    render() {

        const images = [];
        const { news_image, add_button_loading, input_phone_number, input_temp_phone_number } = this.state;
        news_image.map(img => images.push({ url: img.path }));

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* <ScrollView
                        style={{
                            minHeight: 200,
                            margin: 10,
                            borderColor: '#ECC951',
                        }}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {
                            this.state.news_image.length > 0 ?

                                this.renderImages(news_image)

                                :

                                <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    borderColor: '#222222',
                                    borderWidth: 1,
                                    borderRadius: 7,
                                    width: 250,
                                    height: 220
                                }} onPress={() => this.pickImage()}>
                                    <AddPhotoIcon name='add-a-photo' size={150} color={"#f09839"}></AddPhotoIcon>
                                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Pick Product Photo</Text>
                                </TouchableOpacity>
                        }
                    </ScrollView> */}

                    <View style={{ margin: 20 }}>
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#222222", borderRadius: 10, marginBottom: 10, minHeight: 30 }} multiline={true} placeholder={"Category"} onChangeText={(input) => { this.setState({ input_category: input }) }} />
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#222222", borderRadius: 10, marginBottom: 10, minHeight: 30 }} multiline={true} placeholder={"Name"} onChangeText={(input) => { this.setState({ input_name: input }) }} />
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                            <TextInput style={{ flex: 1, paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#222222", borderRadius: 10, marginBottom: 10, minHeight: 30 }} multiline={true} placeholder={"Phone Number"} value={input_temp_phone_number} onChangeText={(input) => { this.setState({ input_temp_phone_number: input }) }} keyboardType='number-pad' />
                            <TouchableOpacity onPress={() => this.add_phone_number()}>
                                <View style={{ height: 50, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="plus-circle" size={30} color={"green"}></Icon>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            input_phone_number.length > 0 ?
                                <View style={{ flex: 1, borderColor: '#222', borderWidth: 1, padding: 10, }}>
                                    <View style={{ marginBottom: 10 }}>
                                        <Text style={{ fontSize: 15, color: '#f09839', fontWeight: '700' }}>Added Phone Number List</Text>
                                    </View>
                                    {

                                        input_phone_number.map((item) => {
                                            return (
                                                <View key={item} style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }} >
                                                    <Text>{item}</Text>
                                                    <TouchableOpacity onPress={() => this.delete_phone_number(item)}><EditIcon name="delete" size={20} color="red" /></TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                                :
                                null
                        }

                        {
                            add_button_loading ?

                                <ActivityIndicator size="large" color='#000000' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                :

                                <TouchableOpacity style={styles.loginBtn} onPress={() => this.confirm()}>
                                    <View><Text style={{ color: '#FFF', fontSize: 15 }}>Add</Text></View>
                                </TouchableOpacity>
                        }

                    </View>

                </ScrollView >

                <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                    <ImageViewer
                        imageUrls={images}
                        enableSwipeDown={true}
                    />
                </Modal>

            </Fragment >
        )
    }

    delete_phone_number(item) {

        const { input_phone_number } = this.state;
        const index = input_phone_number.indexOf(item);
        const phone_number_list = input_phone_number;
        if (index > -1) {
            phone_number_list.splice(index, 1);
        }
        if (phone_number_list.length == 0 || null) {
            this.setState({ item_price_added: false })
        }
        this.setState({ input_phone_number: phone_number_list });
        this.forceUpdate();

    }

    add_phone_number = () => {

        let { input_temp_phone_number, input_phone_number } = this.state;

        if (input_temp_phone_number && input_phone_number) {
            let new_input_phone_number = this.state.input_phone_number.concat(input_temp_phone_number);
            this.setState({ input_phone_number: new_input_phone_number, phone_number_added: true, input_temp_phone_number: null });
        } else {
            alert('Fill in the phone number box first!')
        }

    }

    async confirm() {

        const { token, user_id, input_name, input_phone_number, input_category, phone_number_added } = this.state;
        if (input_name && phone_number_added) {

            this.setState({ add_button_loading: true })

            let data = new FormData();
            data.append("name", input_name);
            data.append("phone_number", JSON.stringify(input_phone_number));
            data.append("category", input_category);
            data.append("added_by", user_id);
            axios.post(contact, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'Content-Type': 'application/json',
                    // 'Access-Control-Allow-Credentials': true,
                    'Authorization': `Bearer ${token}`
                },
            }
            )
                .then(response => {
                    console.log(response);
                    this.setState({ add_button_loading: false })
                    this.props.navigation.state.params.refresh();
                    this.props.navigation.goBack();
                })
                .catch(error => {
                    alert('Upload Fail!')
                    console.log(error);
                    this.setState({ add_button_loading: false })
                });

        } else {
            alert("Fill all the field");
        }
    }

}

let styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    txtInput: {
        paddingHorizontal: 10,
        height: 45,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#222222",
        borderRadius: 3,
        marginBottom: 10
        // backgroundColor: 'rgba(25, 30, 31,0.5)',
    },
    iconStyle: {
        fontSize: 25,
        marginLeft: 25,
        color: '#ffffff'
    },
    circleIcon: {
        fontSize: 25,
        color: '#FFEB3B'
    },
    image: {
        resizeMode: 'cover',
        marginBottom: 10,
        width: 200,
        height: 200,
        borderRadius: 250
    },
    container: {
        paddingHorizontal: 17,
        paddingBottom: 22,

    },
    footer: {
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: 15
    },
    loginBtn: {
        height: 45,
        backgroundColor: '#222222',
        borderWidth: 1,
        borderBottomWidth: 1,
        color: '#ffffff',
        borderRadius: 5,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginTxt: {
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFEB3B'
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginTop: 16
    },
    button: {
        marginHorizontal: 14
    },
    textRow: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imgBackground: {
        flex: 1,
        width: null,
        height: null
    },
    modalStyle: {
        flex: 1,
        justifyContent: "center",

    },
    modalBtnStyle: {
        backgroundColor: '#191e1f',
        borderRadius: 0,
        height: 60
    }
});