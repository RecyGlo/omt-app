import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { sign_up } from '../redux/actions/userAction';
import FIcons from 'react-native-vector-icons/Feather';
import AddressIcon from 'react-native-vector-icons/Entypo';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/Zocial';
import MapMarkerIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LockIcon from 'react-native-vector-icons/FontAwesome';
import PersonIcon from 'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
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
    Platform,
    Alert,
} from 'react-native';
import PhotoIcon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from 'react-native-image-picker';
// import ImageViewer from 'react-native-image-zoom-viewer';
import CountryPicker from 'react-native-country-picker-modal';
import auth from '@react-native-firebase/auth'

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

const brandColor = '#f09839';

let device_id = 'null'

class AddProfile extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        if (params == undefined) {
            // traditional sign up
            this.state = {
                account_type: null,
                facebook_account_id: null,
                google_account_id: null,
                profile_image: {},
                image_selected: false,
                image_modal_visibility: false,
                image: [],
                input_username: null,
                input_password: null,
                input_confirm_password: 'yes',
                input_phone_number: null,
                input_address: null,
                input_latitute: null,
                input_longitude: null,
                input_email: null,
                sign_up_button_loading: false,
                phone_verify_checked: false,
                phone_verify_click: false,
                enter_code: false,
                spinner: false,
                country: {
                    cca2: 'MM',
                    callingCode: '95'
                },
                phone: '',
                confirm_result: null,
                verification_code: '',
            }
        } else {
            // social media sign up
            const user = params.user;
            let account_type = user.account_type;
            let facebook_account_id = null;
            let google_account_id = null;
            if (account_type == 'facebook') {
                facebook_account_id = user.id;
            } else if (account_type == 'google') {
                google_account_id = user.id;
            }
            else if (account_type == 'phone_auth') {
                google_account_id = user.id;
            }
            this.state = {
                account_type: account_type,
                facebook_account_id: facebook_account_id,
                google_account_id: google_account_id,
                profile_image: {},
                image_selected: false,
                image_modal_visibility: false,
                image: [],
                input_username: user.name ? user.name : null,
                input_password: null,
                input_confirm_password: 'yes',
                input_phone_number: user.input_phone_number ? user.input_phone_number : null,
                input_address: null,
                input_latitute: null,
                input_longitude: null,
                input_email: user.email ? user.email : null,
                sign_up_button_loading: false,
                phone_verify_checked: user.input_phone_number ? true : false,
                phone_verify_click: false,
                enter_code: false,
                spinner: false,
                country: {
                    cca2: 'MM',
                    callingCode: '95'
                },
                phone: '',
                confirm_result: null,
                verification_code: '',
            }
        }
        OneSignal.addEventListener('ids', this.onIds);

    }

    componentWillUnmount() {
        // OneSignal.removeEventListener('received', this.onReceived);
        // OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    // onReceived(notification) {
    //     alert("Notification received: ", notification);
    // }

    // onOpened(openResult) {
    //     alert('Message: ', openResult.notification.payload.body);
    //     alert('Data: ', openResult.notification.payload.additionalData);
    //     alert('isActive: ', openResult.notification.isAppInFocus);
    //     alert('openResult: ', openResult);
    // }

    onIds = (device) => {
        console.log('Device info: ', device.userId);
        device_id = device.userId;
        // this.setState({ input_device_id: device.userId });
    }


    handle_send_code = () => {

        // Request to send OTP
        const { country, phone } = this.state;
        let phone_number = '+' + country.callingCode + phone;
        this.setState({ spinner: true });
        auth()
            .signInWithPhoneNumber(phone_number)
            .then(confirm_result => {
                this.setState({ confirm_result })
                console.log(confirm_result);
                this.setState({
                    spinner: false,
                    enter_code: true,
                    input_phone_number: phone_number
                });
                Alert.alert('Sent!', "We've sent you a verification code", [{
                    text: 'OK',
                }]);
            })
            .catch(error => {
                this.setState({ spinner: false });
                alert(error.message)
                console.log(error)
            })
    }

    handle_verify_code = () => {
        // Request for OTP verification
        const { confirm_result, verification_code } = this.state
        if (verification_code.length === MAX_LENGTH_CODE) {
            this.setState({ spinner: true });
            confirm_result
                .confirm(verification_code)
                .then(user => {
                    // console.log(user)
                    this.setState({ spinner: false, phone_verify_click: false, phone_verify_checked: true });
                    Alert.alert('Success!', 'You have successfully verified your phone number.');
                })
                .catch(error => {
                    if (error.message === '[auth/session-expired] The sms code has expired. Please re-send the verification code to try again.') {
                        this.setState({ spinner: false, phone_verify_click: false, phone_verify_checked: true });
                        Alert.alert('Success!', 'You have successfully verified your phone number.');
                    } else {
                        this.setState({ spinner: false });
                        alert(error.message)
                    }
                    console.log(error)
                })
        } else {
            alert('Please enter a 6 digit OTP code.')
        }
    }

    enter_phone_or_code = (val) => {
        if (!this.state.enter_code) {
            this.setState({ phone: val })
            return;
        } else {
            this.setState({ verification_code: val })
        }
    }

    submit_phone_verification = () => {
        this.state.enter_code ? this.handle_verify_code() : this.handle_send_code();
    }

    change_country = (country) => {
        this.setState({ country: country });
    }

    render_footer = () => {

        if (this.state.enter_code)
            return (
                <View>
                    <Text style={{ margin: 10, fontSize: 14, textAlign: 'center' }} onPress={() => this.setState({ enter_code: false })}>Enter the wrong number or need a new code?</Text>
                </View>
            );

        return (
            <View>
                <Text style={{ marginTop: 30, fontSize: 12, color: 'grey' }}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
            </View>
        );

    }

    render_country_picker = () => {

        if (this.state.enter_code)
            return (
                <View />
            );

        return (
            <CountryPicker
                style={styles.countryPicker}
                onSelect={this.change_country}
                countryCode={this.state.country.cca2}
                styles={countryPickerCustomStyles}
                withFilter
            />
        );

    }

    render_calling_code = () => {

        if (this.state.enter_code)
            return (
                <View />
            );

        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, color: brandColor, fontFamily: 'Helvetica', fontWeight: 'bold', paddingRight: 10 }}>
                    +{this.state.country.callingCode}
                </Text>
            </View>
        );

    }


    onImagePick = () => {
        const options = {
            title: 'Select Images',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, response => {
            console.log(response)
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                alert(response.error);
            } else {
                console.log(response)
                this.setState({ profile_image: response, image: [...this.state.image, response], image_selected: true });
            }
        });
    }

    image_view = () => {
        this.setState({ image_modal_visibility: true });
    }

    pin_location = () => {
        this.props.navigation.navigate('PinLocation');
    }

    _toggleModal = () => {
        this.setState(state => {
            return {
                image_modal_visibility: !state.image_modal_visibility
            }
        });
    }


    render() {

        // const location = this.props.navigation.state.params ? this.props.navigation.state.params.currentRegion : null;
        // location && this.setState({ input_latitute: location.latitude, input_longitude: location.longitude })

        // console.log(this.props.navigation.state.params.currentRegion.latitude);
        // this.props.navigation.state.params.currentRegion
        // console.log(this.props.navigation.state.params ? this.props.navigation.state.params.currentRegion : null)

        const { image, sign_up_button_loading, phone_verify_checked, input_username, input_email, profile_image, image_selected } = this.state;

        const images = [];
        image.map(img => images.push({ url: img.uri }));

        let headerText = `What's your ${this.state.enter_code ? 'verification code' : 'phone number'}?`
        let buttonText = this.state.enter_code ? 'Verify confirmation code' : 'Send confirmation code';
        let textStyle = this.state.enter_code ? {
            height: 50,
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: 'Courier',
            color: '#222',
        } : {};

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                {
                    this.state.phone_verify_click ?

                        <View style={{ flex: 1, margin: 20 }}>

                            <Text style={{ textAlign: 'center', marginTop: 60, fontSize: 22, margin: 20, color: '#4A4A4A' }}>{headerText}</Text>

                            <View style={{ flexDirection: 'row' }}>

                                {this.render_country_picker()}
                                {this.render_calling_code()}

                                <TextInput
                                    name={this.state.enter_code ? 'code' : 'phoneNumber'}
                                    underlineColorAndroid={'transparent'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    onChangeText={this.enter_phone_or_code}
                                    placeholder={this.state.enter_code ? '_ _ _ _ _ _' : 'Phone Number'}
                                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                                    style={[{ padding: 0, margin: 0, flex: 1, fontSize: 20 }, textStyle]}
                                    returnKeyType='go'
                                    autoFocus
                                    // placeholderTextColor={brandColor}
                                    // selectionColor={brandColor}
                                    maxLength={this.state.enter_code ? 6 : 20}
                                    onSubmitEditing={this.submit_phone_verification} />
                            </View>

                            <TouchableOpacity style={{ marginTop: 30, height: 50, backgroundColor: brandColor, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                onPress={this.submit_phone_verification}>
                                <Text style={{ color: '#fff', fontFamily: 'Helvetica', fontSize: 16, fontWeight: 'bold' }}>{buttonText}</Text>
                            </TouchableOpacity>

                            {this.render_footer()}
                            {
                                this.state.spinner &&
                                <ActivityIndicator size="large" color='#F09839' style={{ height: 45, marginVertical: 16 }} />
                            }

                        </View>

                        :

                        <ScrollView style={{ marginBottom: 10 }}>
                            {
                                this.state.image_selected ?
                                    (
                                        <View style={{ margin: 16 }}>
                                            <TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                                                <Image source={{ uri: this.state.profile_image.uri }} style={{ height: 180, resizeMode: 'cover', borderRadius: 5, borderColor: '#9E9E9E', borderWidth: 1 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.setState({ profile_image: {}, image: [], image_selected: false })} style={{
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
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', margin: 16, padding: 15, borderColor: '#e5e5e5', borderWidth: 1, borderRadius: 10 }} onPress={() => this.onImagePick()}>
                                            <PhotoIcon name='add-a-photo' size={120} color='#f09839' />
                                            <Text style={{ color: '#222222', fontSize: 18, fontWeight: 'bold' }}>Pick Profile Picture</Text>
                                        </TouchableOpacity>
                                    )
                            }
                            <View style={{ marginHorizontal: 15 }}>
                                <View>
                                    <PersonIcon name='person' color='#f09839' size={25} style={{ position: 'absolute', top: 10, left: 10 }} />
                                    <TextInput autoFocus={true} style={styles.txtInput} defaultValue={input_username} placeholder={"Username"} onChangeText={(input) => { this.setState({ input_username: input }) }} />
                                </View>
                                <View>
                                    <LockIcon name='lock' color='#f09839' size={25} style={{ position: 'absolute', top: 10, left: 10 }} />
                                    <TextInput secureTextEntry={true} style={styles.txtInput} placeholder={"Password"} onChangeText={(input) => { this.setState({ input_password: input }) }} />
                                </View>
                                {
                                    phone_verify_checked ?

                                        <View>
                                            <PhoneIcon name='phone' color='#f09839' size={22} style={{ position: 'absolute', top: 10, left: 10 }} />
                                            <TextInput style={styles.txtInput} placeholder={"Phone Number"} defaultValue={this.state.input_phone_number} editable={false} />
                                        </View>

                                        :

                                        <TouchableOpacity onPress={() => this.setState({ phone_verify_click: true })}>
                                            <View>
                                                <PhoneIcon name='phone' color='#f09839' size={22} style={{ position: 'absolute', top: 10, left: 10 }} />
                                                <Text style={[styles.txtInput, { padding: 10 }]}>Add Phone Number</Text>
                                            </View>
                                        </TouchableOpacity>

                                }
                                <View>
                                    <EmailIcon name='email' color='#f09839' size={25} style={{ position: 'absolute', top: 10, left: 10 }} />
                                    <TextInput style={[styles.txtInput,]} defaultValue={input_email} placeholder={"Email  (Optional)"} onChangeText={(input) => { this.setState({ input_email: input }) }} />
                                </View>
                                <View>
                                    <AddressIcon name='address' color='#f09839' size={25} style={{ position: 'absolute', top: 10, left: 10 }} />
                                    <TextInput style={styles.txtInput}
                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        multiline={true} placeholder={"Address (Optional)"} onChangeText={(input) => { this.setState({ input_address: input }) }} />
                                </View>
                                {/* <TouchableOpacity onPress={this.pin_location}>
                                    <View>
                                        <MapMarkerIcon name='map-marker' color='#f09839' size={30} style={{ position: 'absolute', top: 5, left: 10 }} />
                                        <Text style={[styles.txtInput, { padding: 10 }]}>Pin Your Location (Optional)</Text>
                                    </View>
                                </TouchableOpacity> */}

                                {
                                    sign_up_button_loading ?

                                        <ActivityIndicator size="large" color='#F09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                        :

                                        <TouchableOpacity style={styles.loginBtn} onPress={() => this.sign_up()}>
                                            <View><Text style={{ color: '#FFF', fontSize: 16 }}>Sign Up</Text></View>
                                        </TouchableOpacity>
                                }

                            </View>

                        </ScrollView>

                }

                {/* <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                    <ImageViewer
                        imageUrls={images}
                        enableSwipeDown={true} />
                </Modal> */}
            </Fragment>
        )
    }

    async sign_up() {

        let { facebook_account_id, google_account_id, image_selected, profile_image, input_username, input_password, input_phone_number, input_confirm_password, input_email, input_address, input_latitute, input_longitude, phone_verify_checked } = this.state;
        if (input_username && input_password && input_phone_number && input_confirm_password && phone_verify_checked) {

            // this.setState({ sign_up_button_loading: true })

            let location;

            let data = new FormData();
            data.append("name", input_username);
            data.append("phoneNumber", input_phone_number);
            data.append("type", "CUSTOMER");
            data.append("password", input_password);
            if (facebook_account_id != null) {
                data.append("facebook_account_id", facebook_account_id);
            }
            if (google_account_id != null) {
                data.append("google_account_id", google_account_id);
            }
            data.append("device_id", device_id);
            if (input_email) {
                data.append("email", input_email);
            }
            if (image_selected) {
                let uri;
                // uri = image.uri;

                if (Platform.OS === 'android')
                    uri = profile_image.uri
                else
                    uri = profile_image.uri.replace('file:///', '/private/')
                // uri = profile_image.uri.replace('file://', '')
                // uri = '~' + profile_image.uri.substring(profile_image.uri.indexOf('/Documents'));
                data.append("profileImage", {
                    uri: uri,
                    type: profile_image.type,
                    name: 'image.' + profile_image.type.split('/')[1]
                });
            }
            if (input_address) {
                location = {
                    "address": input_address,
                };
            }
            if (input_latitute) {
                location = {
                    "coordinate": {
                        "lat": Number(input_latitute),
                        "lng": Number(input_longitude),
                    }
                };
            }
            if (input_address && input_latitute) {
                location = {
                    "address": input_address,
                    "coordinate": {
                        "lat": Number(input_latitute),
                        "lng": Number(input_longitude),
                    }
                };
            }
            if (location) {
                data.append("location", JSON.stringify(location));
            }

            this.props.sign_up(data);

        } else {
            alert("Enter Username,Password & Phone Number");
        }

    }

}

const mapDispatchToProps = dispatch => ({
    sign_up: (data) => {
        dispatch(sign_up(data));
    },
})

export default connect(null, mapDispatchToProps)(AddProfile);

let styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    txtInput: {
        paddingRight: 10,
        paddingLeft: 50,
        height: 45,
        borderBottomWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 10,
        marginBottom: 10,
        color: '#222',
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
        backgroundColor: '#F09839',
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