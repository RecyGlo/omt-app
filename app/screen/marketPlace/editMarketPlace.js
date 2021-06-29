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
import { edit_market_product } from '../../redux/actions/marketPlaceAction';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/Entypo';
import { Picker } from '@react-native-community/picker';

class EditMarketPlace extends React.PureComponent {


    constructor(props) {
        super(props);
        let { product } = this.props.route.params;
        this.state = {
            news_image: product.image,
            image_selected: true,
            new_image_selected: false,
            input_product_id: product._id,
            input_name: product.name,
            input_description: product.description,
            input_price: product.price,
            input_category: product.category,
            uploaded_by: product.uploaded_by,
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
        this.setState({ image_selected: true, new_image_selected: true });
    }

    //pick video only
    async pickVideo() {
        // this.setState({ isVideo: true });
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: false, mediaType: "video" });
        console.log(images)
        // let newImgs = this.state.images.concat(images);
        // this.setState({ images: newImgs, renderImage: true, mediaPickerVisible: false });
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
            if (img.path == undefined) {
                imgs.push(
                    <View key={img} style={{
                        marginRight: 5
                    }}>
                        <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                            <Image key={img} source={{ uri: img }} style={{ width: 200, height: 200, resizeMode: 'cover', borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 10 }} />
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
            } else {
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
        const { news_image, add_button_loading, input_name, input_description, input_price, input_category } = this.state;
        news_image.map(img => {
            if (img.path == undefined) {
                images.push({ url: img })
            } else {
                images.push({ url: img.path })
            }
        });


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
                        <TextInput style={{ padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} value={input_name} placeholder={"Product Name"} onChangeText={(input) => { this.setState({ input_name: input }) }} />
                        <TextInput style={{ padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }} value={input_price} placeholder={"Price ( MMK )"} onChangeText={(input) => { input = this.setState({ input_price: input }) }} keyboardType='number-pad' />
                        <TextInput style={{ padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 70 }}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            multiline={true}
                            value={input_description}
                            placeholder={"Description"} onChangeText={(input) => { this.setState({ input_description: input }) }} />
                        {
                            Platform.OS === 'android' ?
                                <View style={{ marginBottom: 10, justifyContent: 'center', height: 45, borderWidth: 1, borderColor: '#222', borderRadius: 3, minHeight: 30 }}>
                                    <Picker mode={"dialog"} selectedValue={input_category} onValueChange={(item_value) => this.setState({ input_category: item_value })} >
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
                                <Picker mode={"dialog"} selectedValue={input_category} onValueChange={(item_value) => this.setState({ input_category: item_value })} >
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

                                <TouchableOpacity style={{ marginVertical: 20, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} onPress={() => this.confirm()}>
                                    <View><Text style={{ color: '#FFF', fontSize: 15 }}>Update</Text></View>
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

        const { input_name, input_description, news_image, image_selected, new_image_selected, input_product_id, input_price, input_category } = this.state;
        if (input_name && input_description && image_selected) {

            this.setState({ add_button_loading: true })

            let data = new FormData();
            data.append("name", input_name);
            data.append("description", input_description);
            data.append("price", input_price);
            data.append("category", input_category);
            data.append("product_status", 'AVAILABLE');

            let old_news_image = [];
            let new_news_image_quantity = 0;

            for (let i = 0; i < news_image.length; i++) {
                if (news_image[i].path == undefined) {
                    old_news_image.push(news_image[i]);
                } else {
                    new_news_image_quantity++;
                    data.append("image", {
                        uri: news_image[i].path,
                        type: news_image[i].mime,
                        name: 'image.' + news_image[i].mime.split('/')[1]
                    });
                }
            }
            if (!new_image_selected || new_news_image_quantity == 0) {
                data.append("image", null);
            }

            data.append("old_news_image", JSON.stringify(old_news_image));

            this.props.edit_market_product(input_product_id, data, () => this.props.navigation.goBack());

        } else {
            alert("Fill all the field");

        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    edit_market_product: (product_id, data, callback) => {
        dispatch(edit_market_product(product_id, data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMarketPlace);

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