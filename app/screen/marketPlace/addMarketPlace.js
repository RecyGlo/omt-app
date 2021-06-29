import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { add_market_product } from '../../redux/actions/marketPlaceAction';
import { Picker } from '@react-native-community/picker';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/Entypo';

class AddMarketPlace extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            news_image: [],
            image_selected: false,
            input_name: null,
            input_description: null,
            input_price: null,
            input_category: null,
            image_modal_visibility: false,
            add_button_loading: false,
        }
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
                    marginRight: 5
                }}>
                    <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                        <Image key={img.path} source={{ uri: img.path }} style={{ width: 200, height: 200, resizeMode: 'cover', borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 10 }} />
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
                backgroundColor: '#f09839',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 30,
                marginVertical: 60
            }}
                key={98} >
                <Icons name="plus" style={{ color: '#FFF', fontSize: 48 }} />
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
        const { news_image, add_button_loading } = this.state;
        news_image.map(img => images.push({ url: img.path }));

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView showsVerticalScrollIndicator={false}>

                    {
                        this.state.news_image.length > 0 ?
                            <ScrollView
                                style={{ minHeight: 180, margin: 15, }}
                                horizontal showsHorizontalScrollIndicator >
                                {this.renderImages(news_image)}
                            </ScrollView>
                            :

                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderColor: '#9E9E9E', borderWidth: 1, borderRadius: 10, margin: 15, height: 180 }}
                                onPress={() => this.pickImage()}>
                                <AddPhotoIcon name='add-a-photo' size={120} color={"#f09839"}></AddPhotoIcon>
                                <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Pick Product Photo</Text>
                            </TouchableOpacity>
                    }

                    <View style={{ marginHorizontal: 15 }}>
                        <TextInput style={{ color: '#222', padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} placeholder={"Product Name"} onChangeText={(input) => { this.setState({ input_name: input }) }} />
                        <TextInput style={{ color: '#222', padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} placeholder={"Price ( MMK )"} onChangeText={(input) => { input = this.setState({ input_price: input }) }} keyboardType='number-pad' />
                        <TextInput style={{ padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 70 }}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            multiline={true}
                            placeholder={"Description"} onChangeText={(input) => { this.setState({ input_description: input }) }} />
                        {
                            Platform.OS === 'android' ?
                                <View style={{ marginBottom: 10, justifyContent: 'center', height: 45, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 5, minHeight: 30 }}>
                                    <Picker mode={"dialog"} selectedValue={this.state.input_category} onValueChange={(item_value) => this.setState({ input_category: item_value })} >
                                        <Picker.Item label="Select Product Category" color="#bdbdbd" />
                                        <Picker.Item label="Plastic" value="Plastic" />
                                        <Picker.Item label="Glass" value="Glass" />
                                        <Picker.Item label="Electronic" value="Electronic" />
                                        <Picker.Item label="Paper" value="Paper" />
                                        <Picker.Item label="Metal" value="Metal" />
                                        <Picker.Item label="Cloth" value="Cloth" />
                                        {/* <Picker.Item label="Furniture" value="Furniture" /> */}
                                        <Picker.Item label="Other" value="Other" />
                                    </Picker>
                                </View>

                                :

                                <Picker mode={"dialog"} selectedValue={this.state.input_category} onValueChange={(item_value) => this.setState({ input_category: item_value })} >
                                    <Picker.Item label="Select Product Category" color="#bdbdbd" />
                                    <Picker.Item label="Plastic" value="Plastic" />
                                    <Picker.Item label="Glass" value="Glass" />
                                    <Picker.Item label="Electronic" value="Electronic" />
                                    <Picker.Item label="Paper" value="Paper" />
                                    <Picker.Item label="Metal" value="Metal" />
                                    <Picker.Item label="Cloth" value="Cloth" />
                                    <Picker.Item label="Recycle" value="Recycle" />
                                    <Picker.Item label="Other" value="Other" />
                                </Picker>
                        }

                        {
                            add_button_loading ?

                                <ActivityIndicator size="large" color='#F09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                :

                                <TouchableOpacity style={{ marginVertical: 20, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                    onPress={() => this.confirm()}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Add</Text>
                                </TouchableOpacity>
                        }

                    </View>

                </ScrollView>

                <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                    <ImageViewer
                        imageUrls={images}
                        enableSwipeDown={true}
                    />
                </Modal>

            </Fragment>
        )
    }

    async confirm() {
        const { user } = this.props;
        const { input_name, input_description, input_price, input_category, news_image, image_selected } = this.state;
        if (input_name && input_price && input_description && image_selected) {

            this.setState({ add_button_loading: true })

            let data = new FormData();
            data.append("name", input_name);
            data.append("description", input_description);
            data.append("price", input_price);
            data.append("category", input_category);
            data.append("uploaded_by", user._id);
            for (let i = 0; i < news_image.length; i++) {
                data.append("image", {
                    uri: news_image[i].path,
                    type: news_image[i].mime,
                    name: 'image.' + news_image[i].mime.split('/')[1]
                });
            }

            this.props.add_market_product(data, () => this.props.navigation.goBack());

            // setTimeout(() => this.setState({ add_button_loading: false }), 3000);

        } else {
            alert("Fill all the field");
        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    add_market_product: (data, callback) => {
        dispatch(add_market_product(data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(AddMarketPlace);

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