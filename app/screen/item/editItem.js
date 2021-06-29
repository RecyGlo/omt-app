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
    Modal,
} from 'react-native';
import { connect } from 'react-redux';
import { edit_item } from '../../redux/actions/itemAction';
import { Picker } from '@react-native-community/picker';
import Icon from "react-native-vector-icons/FontAwesome";
import ImageCropPicker from 'react-native-image-crop-picker';
import DeleteIcon from 'react-native-vector-icons/Feather';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icons from 'react-native-vector-icons/Entypo';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';


class EditItem extends React.PureComponent {


    constructor(props) {
        super(props);
        let params = this.props.route.params;
        let { item } = params.item;
        this.state = {
            item_image: item.image,
            image_selected: true,
            input_item_id: item._id,
            input_item_name: item.name,
            input_item_group: item.group,
            input_description: item.description,
            input_min_price: null,
            input_max_price: null,
            input_currency: null,
            input_unit: null,
            image: [],
            item_price_array: item.price,
            item_price_added: true,
            update_button_loading: false,
            image_modal_visibility: false,
            new_image_selected: false,
        }
    }

    //pick image only
    pickImage = async () => {
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: true, mediaType: "photo" });
        let newImgs = this.state.item_image.concat(images);
        this.setState({ item_image: newImgs });
        this.setState({ image_selected: true, new_image_selected: true });
    }


    _toggleModal = () => {
        this.setState(state => {
            return {
                image_modal_visibility: !state.image_modal_visibility
            }
        });
    }


    render() {

        let { new_image_selected, item_image, input_item_name, input_item_group, input_description, input_min_price, input_max_price, item_price_array, add_button_loading } = this.state;

        const images = [];
        item_image.map(img => {
            if (img.path == undefined) {
                images.push({ url: img })
            } else {
                images.push({ url: img.path })
            }
        });

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView>

                    {
                        this.state.item_image.length > 0 ?
                            <ScrollView
                                style={{ minHeight: 180, margin: 15, }}
                                horizontal showsHorizontalScrollIndicator={false} >
                                {this.render_image(item_image)}
                            </ScrollView>
                            :

                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderColor: '#9E9E9E', borderWidth: 1, borderRadius: 10, margin: 15, height: 180 }}
                                onPress={() => this.pickImage()}>
                                <AddPhotoIcon name='add-a-photo' size={120} color={"#f09839"}></AddPhotoIcon>
                                <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Pick Item Image</Text>
                            </TouchableOpacity>
                    }

                    <View style={{ marginHorizontal: 15 }}>
                        <TextInput style={{ color: '#222', paddingHorizontal: 10, minHeight: 45, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 5, marginBottom: 10 }}
                            placeholder={"Item Name"} value={input_item_name} onChangeText={(input) => { this.setState({ input_item_name: input }) }} />
                        {
                            Platform.OS === 'android' ?
                                <View style={{ marginBottom: 10, justifyContent: 'center', height: 45, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 5, }}>
                                    <Picker selectedLabel={this.state.input_item_group} selectedValue={this.state.input_item_group} onValueChange={(item_value) => this.setState({ input_item_group: item_value })} >
                                        <Picker.Item label="Select Item Group" color="#bdbdbd" />
                                        <Picker.Item label="Plastic" value="Plastic" />
                                        <Picker.Item label="Glass" value="Glass" />
                                        <Picker.Item label="E-Waste" value="E-Waste" />
                                        <Picker.Item label="Paper" value="Paper" />
                                        <Picker.Item label="Metal" value="Metal" />
                                        <Picker.Item label="Other" value="Other" />
                                    </Picker>
                                </View>
                                :

                                <Picker selectedValue={this.state.input_item_group} onValueChange={(item_value) => this.setState({ input_item_group: item_value })} >
                                    <Picker.Item label="Select Item Group" color="#bdbdbd" />
                                    <Picker.Item label="Plastic" value="Plastic" />
                                    <Picker.Item label="Glass" value="Glass" />
                                    <Picker.Item label="E-Waste" value="E-Waste" />
                                    <Picker.Item label="Paper" value="Paper" />
                                    <Picker.Item label="Metal" value="Metal" />
                                    <Picker.Item label="Other" value="Other" />
                                </Picker>
                        }

                        <TextInput style={{ color: '#222', paddingHorizontal: 10, borderWidth: 1, borderBottomWidth: 1, borderColor: '#9E9E9E', borderRadius: 5, marginBottom: 10, minHeight: 70 }}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            multiline={true}
                            value={input_description != 'null' ? input_description : null}
                            placeholder={"Description(Optional)"} onChangeText={(input) => { this.setState({ input_description: input }) }} />

                        <View style={{ flexDirection: 'row', marginBottom: 5 }} >

                            <Text style={{ flex: 1, marginRight: 10, }} >Min Price</Text>
                            <Text style={{ flex: 1 }}>Max Price</Text>

                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>

                            <TextInput style={[styles.txtInput, { flex: 1, marginRight: 10 }]} value={input_min_price} keyboardType='number-pad' onChangeText={(input) => { this.setState({ input_min_price: input }) }} />

                            <TextInput style={[styles.txtInput, { flex: 1 }]} value={input_max_price} keyboardType='number-pad' onChangeText={(input) => { this.setState({ input_max_price: input }) }} />
                            <View style={{ height: 40, width: 20, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                                {/* <Icon name="plus-circle" size={20} color={"red"}></Icon> */}
                            </View>

                        </View>
                        {
                            Platform.OS === 'ios' ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Picker style={{ flex: 1.2, marginRight: 10 }} selectedValue={this.state.input_currency} onValueChange={(item_value) => this.setState({ input_currency: item_value })} >
                                        <Picker.Item label="Select Currency" color="#bdbdbd" />
                                        <Picker.Item label="MMK" value="MMK" />
                                        {/* <Picker.Item label="$" value="$" /> */}
                                    </Picker>
                                    <Picker style={{ flex: 1.2 }} selectedValue={this.state.input_unit} onValueChange={(item_value) => this.setState({ input_unit: item_value })} >
                                        <Picker.Item label="Select Unit" color="#bdbdbd" />
                                        <Picker.Item label="Kg" value="Kg" />
                                        <Picker.Item label="Viss" value="Viss" />
                                        <Picker.Item label="Unit" value="Unit" />
                                        <Picker.Item label="Capacity" value="Capacity" />
                                        <Picker.Item label="Condition" value="Condition" />
                                    </Picker>

                                    <TouchableOpacity onPress={this.add_price}>
                                        <View style={{ height: 40, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="plus-circle" size={20} color={"green"}></Icon>
                                        </View>
                                    </TouchableOpacity>
                                </View>


                                :
                                <View>
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        <Text style={{ flex: 1.2, marginRight: 10 }}>Currency</Text>
                                        <Text style={{ flex: 1.2 }}>Unit</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1.5, justifyContent: 'center', marginRight: 10, marginBottom: 10, height: 45, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 5, }}>
                                            <Picker selectedValue={this.state.input_currency} onValueChange={(item_value) => this.setState({ input_currency: item_value })} >
                                                <Picker.Item label="" value="" />
                                                <Picker.Item label="MMK" value="MMK" />
                                                {/* <Picker.Item label="$" value="$" /> */}
                                            </Picker>
                                        </View>
                                        <View style={{ flex: 1.5, justifyContent: 'center', marginBottom: 10, height: 45, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 5, }}>
                                            <Picker selectedValue={this.state.input_unit} onValueChange={(item_value) => this.setState({ input_unit: item_value })} >
                                                <Picker.Item label="" value="" />
                                                <Picker.Item label="Kg" value="Kg" />
                                                <Picker.Item label="Viss" value="Viss" />
                                                <Picker.Item label="Unit" value="Unit" />
                                                <Picker.Item label="Capacity" value="Capacity" />
                                                <Picker.Item label="Condition" value="Condition" />
                                            </Picker>
                                        </View>
                                        <TouchableOpacity onPress={this.add_price}>
                                            <View style={{ height: 40, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon name="plus-circle" size={20} color={"green"}></Icon>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }
                        <View style={{ minHeight: 100, borderWidth: 1, borderRadius: 5, borderColor: '#9E9E9E', padding: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ flex: 1, color: '#f09839', fontSize: 16, fontWeight: 'bold' }} >Date</Text>
                                <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }} >Price</Text>
                                <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }} >Min</Text>
                                <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }}>Max</Text>
                                <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }}>Unit</Text>

                            </View>

                            {
                                item_price_array.length > 0 ?

                                    item_price_array.map((i, item) => this.render_item_price(i, item))
                                    :

                                    <View style={{ height: 40, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 14, }}>No price is added !</Text>
                                    </View>
                            }



                        </View>
                        {
                            add_button_loading ?

                                <ActivityIndicator size="large" color='#f09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                :

                                <TouchableOpacity style={styles.loginBtn} onPress={() => this.confirm()}>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Update</Text>
                                </TouchableOpacity>
                        }

                    </View>


                </ScrollView>
                <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                    <ImageViewer
                        imageUrls={images}
                        enableSwipeDown={true} />
                </Modal>
            </Fragment>
        )
    }


    add_price = () => {

        let { input_min_price, input_max_price, input_currency, input_unit, user_id } = this.state;
        let { user } = this.props;

        if (input_min_price && input_max_price && input_currency && input_unit) {
            if (Number(input_min_price) < (input_max_price)) {
                let price = {
                    "min_price": input_min_price,
                    "max_price": input_max_price,
                    "currency": input_currency,
                    "unit": input_unit,
                    "added_by": user._id,
                }
                let new_item_price_array = this.state.item_price_array.concat(price);
                this.setState({ item_price_array: new_item_price_array, item_price_added: true, input_min_price: null, input_max_price: null, input_currency: null, input_unit: null });
            } else {
                alert('Min Price is greater than Max Price');
            }

        } else {
            alert('Fill all the input.')
        }

    }

    render_image(item_image) {

        let imgs = [];
        for (let img of item_image) {
            if (img.path == undefined) {
                imgs.push(
                    <View key={img} style={{ marginRight: 5, }}>
                        <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                            <Image key={img} source={{ uri: img }} style={{ width: 200, height: 200, resizeMode: 'cover', borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 10 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.removePhoto(img)} style={{
                            position: 'absolute',
                            right: 1,
                            top: 1,
                            zIndex: 2,
                        }}>
                            <DeleteIcon name='delete' style={{ color: 'red', fontSize: 30 }} />
                        </TouchableOpacity>
                    </View>
                );
            } else {
                imgs.push(
                    <View key={img.path} style={{ marginRight: 5, }}>
                        <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                            <Image key={img.path} source={{ uri: img.path }} style={{ width: 200, height: 200, resizeMode: 'cover', borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 10 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.removePhoto(img)} style={{
                            position: 'absolute',
                            right: 1,
                            top: 1,
                            zIndex: 2,
                        }}>
                            <DeleteIcon name='delete' style={{ color: 'red', fontSize: 30 }} />
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
                <Icons name="plus" style={{ color: '#fff', fontSize: 48 }} />
            </TouchableOpacity >
        )
        return imgs;
    }

    removePhoto(image) {

        const { item_image } = this.state;
        const index = item_image.indexOf(image);
        const images = item_image;
        if (index > -1) {
            images.splice(index, 1);
        }
        if (images.length == 0 || null) {
            this.setState({ image_selected: false })
        }
        this.setState({ item_image: images });
        this.forceUpdate();
        this.render();
    }

    render_item_price = (item, index) => {

        return (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }} >

                {
                    item.date ?
                        <Text style={{ flex: 1, }} >{item.date}</Text>
                        :

                        <Text style={{ flex: 1, }} >Today</Text>
                }
                <Text style={{ flex: 0.5 }}>{item.currency}</Text>
                <Text style={{ flex: 0.5, }} >{item.min_price} </Text>
                <Text style={{ flex: 0.5, }}>{item.max_price}</Text>
                <Text style={{ flex: 0.5 }}>{item.unit}</Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => 'index ' + index;


    confirm() {

        const { image_selected, new_image_selected, input_item_id, input_item_name, input_item_group, input_description, item_price_array, item_image, item_price_added } = this.state;

        if (input_item_name && input_item_group && item_price_added && image_selected) {

            // this.setState({ add_button_loading: true })

            let data = new FormData();
            data.append("name", input_item_name);
            data.append("description", input_description);
            data.append("group", input_item_group);
            data.append("price", JSON.stringify(item_price_array));
            data.append("approved", false);

            let old_item_image = [];
            let new_item_image_quantity = 0;

            for (let i = 0; i < item_image.length; i++) {
                if (item_image[i].path == undefined) {
                    old_item_image.push(item_image[i]);
                } else {
                    new_item_image_quantity++;
                    data.append("image", {
                        uri: item_image[i].path,
                        type: item_image[i].mime,
                        name: 'image.' + item_image[i].mime.split('/')[1]
                    });
                }
            }
            if (!new_image_selected || new_item_image_quantity == 0) {
                data.append("image", null);
            }

            data.append("old_item_image", JSON.stringify(old_item_image));

            this.props.edit_item(input_item_id, data, () => this.props.navigation.goBack());

        } else {
            alert("Fill all the field");
        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    edit_item: (item_id, data, callback) => {
        dispatch(edit_item(item_id, data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);

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
        borderColor: "#9E9E9E",
        borderRadius: 5,
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
