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
} from 'react-native';
import { connect } from 'react-redux';
import { edit_junk_shop } from '../../redux/actions/junkShopAction';
import ImagePicker from 'react-native-image-picker';
// import ImageCropPicker from 'react-native-image-crop-picker';
import FIcons from 'react-native-vector-icons/Feather';
import EditIcon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';


class EditJunkShop extends React.PureComponent {


    constructor(props) {
        super(props);
        let { item } = this.props.route.params;
        console.log(item)
        this.state = {
            junk_shop_image: item.image ? item.image : null,
            image_selected: item.image ? true : false,
            new_image_selected: false,
            input_junk_shop_id: item._id,
            input_junk_shop_name: item.name,
            input_phone_number: item.phoneNumber,
            input_address: item.location.address,
            input_latitude: item.location.coordinate.lat,
            input_longitude: item.location.coordinate.lng,
            input_town: item.town,
            input_ward: item.ward,
            upload_button_loading: false,
            junk_shop_detial: item,
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.route.params.currentRegion) {
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

            },
            multiselect: true

        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                alert(response.error);
            } else {
                this.setState({ junk_shop_image: response, image_selected: true, new_image_selected: true });
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
        this.props.navigation.navigate('PinJunkShopLocation', { 'latitude': input_latitude, 'longitude': input_longitude, 'from': 'edit_junk_shop' });
    }

    render() {

        let { input_latitude, input_longitude, junk_shop_image } = this.state;
        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView style={{ marginBottom: 10 }}>

                    {
                        this.state.image_selected ?

                            (
                                <View style={{ margin: 15 }}>

                                    <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                                        <Image source={{ uri: junk_shop_image.uri ? junk_shop_image.uri : junk_shop_image }} style={{ height: 180, resizeMode: 'cover', borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 10 }} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.setState({ junk_shop_image: {}, image_selected: false })} style={{
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
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            defaultValue={this.state.input_junk_shop_name} placeholder={"Junk Shop Name"} onChangeText={(input) => { this.setState({ input_junk_shop_name: input }) }} />
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            defaultValue={this.state.input_phone_number} placeholder={"Phone Number"} onChangeText={(input) => { this.setState({ input_phone_number: input }) }} />
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 70 }}
                            defaultValue={this.state.input_address} placeholderTextColor="grey" underlineColorAndroid="transparent" multiline={true} placeholder={"Address"} onChangeText={(input) => { this.setState({ input_address: input }) }} />
                        {/* <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            defaultValue={this.state.input_latitude.toString()} placeholder={"Input Latitude"} onChangeText={(input) => { this.setState({ input_latitude: input }) }} />
                        <TextInput style={{ paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            defaultValue={this.state.input_longitude.toString()} placeholder={"Input Longitude"} onChangeText={(input) => { this.setState({ input_longitude: input }) }} /> */}
                        <View style={{ borderWidth: 1, borderColor: '#222', flexDirection: 'column', marginBottom: 10, flex: 1 }}>
                            {
                                input_latitude ?
                                    <MapView
                                        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                        style={{
                                            width: '100%',
                                            height: 150,
                                        }}
                                        region={{
                                            latitude: input_latitude,
                                            longitude: input_longitude,
                                            latitudeDelta: 0.00115,
                                            longitudeDelta: 0.00121,
                                        }}
                                    >
                                        <Marker
                                            draggable={true}
                                            coordinate={{
                                                latitude: input_latitude,
                                                longitude: input_longitude
                                            }}>
                                            <Image source={require('../../asset/image/recycle_location_pin.png')} style={{ width: 40, height: 40 }} />
                                        </Marker>

                                    </MapView>

                                    :
                                    <View style={{ width: '100%', height: 150, }}>
                                        <Text>No location is added!</Text>
                                    </View>
                            }

                            <TouchableOpacity style={{
                                backgroundColor: '#f09839', position: 'absolute',
                                right: 1,
                                bottom: 1,
                                zIndex: 2,
                                shadowColor: '#FFF'
                            }} onPress={() => this.pin_location()}>
                                <EditIcon name="edit" style={{ color: '#FFF', fontSize: 30, padding: 2 }} />
                            </TouchableOpacity>

                        </View>

                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            defaultValue={this.state.input_town} placeholder={"Town Name"} onChangeText={(input) => { this.setState({ input_town: input }) }} />
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            defaultValue={this.state.input_ward} placeholder={"Ward Name ( if possible )"} onChangeText={(input) => { this.setState({ input_ward: input }) }} />

                        {
                            this.state.upload_button_loading ?

                                <ActivityIndicator size="large" color='#f09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                :

                                <TouchableOpacity style={styles.loginBtn} onPress={() => this.confirm()}>
                                    <View><Text style={{ color: '#FFF', fontSize: 15 }}>Update</Text></View>
                                </TouchableOpacity>
                        }

                    </View>

                </ScrollView>
            </Fragment >
        )
    }

    confirm() {


        let { input_junk_shop_name, input_phone_number, input_address, input_latitude, input_longitude, junk_shop_image, upload_button_loading, image_selected, new_image_selected, junk_shop_detial, input_town, input_ward } = this.state;
        let { user } = this.props;

        if (input_junk_shop_name && input_address && input_latitude && input_longitude && input_town) {

            // this.setState({ upload_button_loading: true });

            let data = new FormData();
            let locationObj = {
                "address": input_address,
                "coordinate": {
                    "lat": input_latitude,
                    "lng": input_longitude
                }
            }
            if (new_image_selected) {
                let uri;

                if (Platform.OS === 'android')
                    uri = junk_shop_image.uri
                else
                    uri = junk_shop_image.uri.replace('file:///', '/private/')
                // uri = junk_shop_image.uri.replace('file://', '')
                // uri = '~' + junk_shop_image.uri.substring(junk_shop_image.uri.indexOf('/Documents'));
                data.append("image", {
                    uri: uri,
                    type: junk_shop_image.type,
                    name: 'image.' + junk_shop_image.type.split('/')[1]
                });
            } else if (!image_selected) {
                delete junk_shop_detial.image;
            }

            if (input_phone_number) {
                junk_shop_detial.phoneNumber = input_phone_number;
            }

            if (!input_ward) {
                input_ward = input_town;
            }

            const junk_shop_id = junk_shop_detial._id;
            junk_shop_detial.added_by = junk_shop_detial.added_by._id;
            junk_shop_detial.name = input_junk_shop_name;
            junk_shop_detial.location = locationObj;
            junk_shop_detial.approve_by = user._id;
            junk_shop_detial.town = input_town;
            junk_shop_detial.ward = input_ward;

            data.append('data', JSON.stringify(junk_shop_detial));

            this.props.edit_junk_shop(junk_shop_id, data, () => this.props.navigation.goBack());
        } else {
            alert("Enter Name,Address & Location !");
        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    edit_junk_shop: (junk_shop_id, data, callback) => {
        dispatch(edit_junk_shop(junk_shop_id, data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditJunkShop);

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
        backgroundColor: '#f09839',
        color: '#ffffff',
        borderRadius: 5,
        marginVertical: 16,
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