import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import ImagePicker from 'react-native-image-picker';
// import ImageCropPicker from 'react-native-image-crop-picker';
import { add_junk_shop } from '../../redux/actions/junkShopAction';
import FIcons from 'react-native-vector-icons/Feather';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';


class AddJunkShop extends React.PureComponent {


    constructor(props) {
        super(props);
        // const location = this.props.navigation.state.params ? this.props.navigation.state.params.currentRegion : null;
        this.state = {
            image: {},
            image_selected: false,
            input_junk_shop_name: null,
            input_phone_number: null,
            input_address: null,
            input_latitude: null,
            input_longitude: null,
            input_town: null,
            input_ward: null,
            add_button_loading: false,
        }
    }


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.route.params) {
            const location = this.props.route.params.currentRegion;
            this.setState({ input_latitude: location.latitude, input_longitude: location.longitude })
        }
    }


    onImagePick = () => {
        const options = {
            title: 'Select Images',
            storageOptions: {
                skipBackup: true,
                path: 'images',
                cameraRoll: true,
                waitUntilSaved: true
            },
            multiselect: true
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                alert(response.error);
            } else {
                this.setState({ image: response, image_selected: true });
            }
        });
    }

    // image_crop_pick = () => {
    //     ImageCropPicker.openPicker({
    //         width: 300,
    //         height: 400,
    //         cropping: false
    //     }).then(image => {
    //         console.log(image);
    //     });
    // }


    // //pick image only
    // async pickImage() {
    //     // this.setState({ isVideo: false });
    //     let images = [];
    //     images = await ImageCropPicker.openPicker({ multiple: true, mediaType: "photo" });
    //     console.log(images)
    //     // let newImgs = this.state.images.concat(images);
    //     // this.setState({ images: newImgs, renderImage: true, mediaPickerVisible: false });
    // }

    // //pick video only
    // async pickVideo() {
    //     // this.setState({ isVideo: true });
    //     let images = [];
    //     images = await ImageCropPicker.openPicker({ multiple: false, mediaType: "video" });
    //     console.log(images)
    //     // let newImgs = this.state.images.concat(images);
    //     // this.setState({ images: newImgs, renderImage: true, mediaPickerVisible: false });
    // }

    pin_location = () => {
        const { input_latitude, input_longitude } = this.state;
        console.log(input_latitude);
        this.props.navigation.navigate('PinJunkShopLocation', { 'latitude': input_latitude, 'longitude': input_longitude, 'from': 'add_junk_shop' });
    }

    render() {

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView style={{ marginBottom: 10 }}>

                    {
                        this.state.image_selected ?

                            (
                                <View style={{ margin: 15 }}>

                                    <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                                        <Image source={{ uri: this.state.image.uri }} style={{ height: 180, resizeMode: 'cover', borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 10 }} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.setState({ image: {}, image_selected: false })} style={{
                                        position: 'absolute',
                                        right: 1,
                                        top: 1,
                                        zIndex: 2,
                                    }}>
                                        <FIcons name='delete' style={{ color: 'red', fontSize: 30 }} />
                                    </TouchableOpacity>
                                </View>
                            )

                            :
                            (
                                <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: '#9E9E9E',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    height: 180,
                                    margin: 15
                                }} onPress={() => this.onImagePick()}>
                                    <AddPhotoIcon name='add-a-photo' size={100} color={"#f09839"}></AddPhotoIcon>
                                    <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Pick Junk Shop Image</Text>
                                </TouchableOpacity>

                            )

                    }

                    <View style={{ marginHorizontal: 15 }}>
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} placeholder={"Junk Shop Name"} onChangeText={(input) => { this.setState({ input_junk_shop_name: input }) }} />
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} placeholder={"Phone Number"} onChangeText={(input) => { this.setState({ input_phone_number: input }) }} keyboardType='phone-pad' />
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 70 }}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            multiline={true} placeholder={"Exact Address"} onChangeText={(input) => { this.setState({ input_address: input }) }}>
                        </TextInput>
                        {/* <TextInput style={{ color:'#222',paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} placeholder={"Input Latitude"} onChangeText={(input) => { this.setState({ input_latitude: input }) }} keyboardType='number-pad' />
                        <TextInput style={{ color:'#222',paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} placeholder={"Input Longitude"} onChangeText={(input) => { this.setState({ input_longitude: input }) }} keyboardType='number-pad' /> */}
                        {
                            this.state.input_latitude ?

                                <TouchableOpacity onPress={this.pin_location}>
                                    <Text style={[styles.txtInput, { padding: 10 }]}>Junk Shop Location is Pinned</Text>
                                </TouchableOpacity>

                                :

                                <TouchableOpacity onPress={this.pin_location}>
                                    <Text style={[styles.txtInput, { padding: 10 }]}>Pin Junk Shop Location</Text>
                                </TouchableOpacity>

                        }
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            placeholder={"Town Name"} onChangeText={(input) => { this.setState({ input_town: input }) }} />
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            placeholder={"Ward Name ( if possible )"} onChangeText={(input) => { this.setState({ input_ward: input }) }} />
                        {
                            this.state.add_button_loading ?

                                <ActivityIndicator size="large" color='#f09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                :

                                <TouchableOpacity style={styles.loginBtn} onPress={() => this.confirm()}>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Add</Text>
                                </TouchableOpacity>
                        }

                    </View>

                </ScrollView>
            </Fragment >
        )
    }

    confirm() {


        let { input_junk_shop_name, input_phone_number, input_address, input_latitude, input_longitude, image, add_button_loading, image_selected, input_town, input_ward } = this.state;
        let { user } = this.props;
        if (input_junk_shop_name && input_address && input_latitude && input_longitude && input_town) {

            this.setState({ add_button_loading: true });

            let data = new FormData();
            let locationObj = {
                "address": input_address,
                "coordinate": {
                    "lat": input_latitude,
                    "lng": input_longitude
                }
            }
            data.append("name", input_junk_shop_name);
            data.append("location", JSON.stringify(locationObj));
            if (image_selected) {
                let uri;

                if (Platform.OS === 'android')
                    uri = image.uri
                else
                    uri = image.uri.replace('file:///', '/private/')
                // uri = image.uri.replace('file://', '')
                // uri = '~' + image.uri.substring(image.uri.indexOf('/Documents'));

                data.append("image", {
                    uri: uri,
                    type: image.type,
                    name: 'image.' + image.type.split('/')[1]
                });
            }
            if (input_phone_number) {
                data.append("phoneNumber", input_phone_number);
            }
            if (!input_ward) {
                input_ward = input_town;
            }
            data.append("town", input_town);
            data.append("ward", input_ward);
            data.append("added_by", user._id);
            data.append("approve_status", "PENDING");
            data.append("approve_by", user._id);

            this.props.add_junk_shop(data, () => this.props.navigation.goBack());


        } else {
            alert("Enter Name,Address & Location!");
        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
    message: state.user.message,
})

const mapDispatchToProps = dispatch => ({
    add_junk_shop: (data, callback) => {
        dispatch(add_junk_shop(data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(AddJunkShop);

let styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    txtInput: {
        height: 45,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#9E9E9E",
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
        backgroundColor: '#f09839',
        borderRadius: 5,
        marginTop: 10,
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
