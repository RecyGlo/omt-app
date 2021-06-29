import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { login } from '../redux/actions/userAction';
import { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import LockIcon from 'react-native-vector-icons/FontAwesome';
import PersonIcon from 'react-native-vector-icons/MaterialIcons';
import CellPhoneIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
    TouchableHighlight
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import appleAuth, { AppleAuthError, AppleAuthRequestScope, AppleAuthRequestOperation, AppleButton } from '@invertase/react-native-apple-authentication';
import CountryPicker from 'react-native-country-picker-modal';
import auth from '@react-native-firebase/auth';
import OneSignal from 'react-native-onesignal';
// import analytics from '@react-native-firebase/analytics';
import { ScrollView } from 'react-native-gesture-handler';


const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

const brandColor = '#f09839';

let device_id = 'null'

class Login extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            input_device_id: '',
            input_email: '',
            input_password: '',
            input_login_method: '',
            input_user: null,
            input_user_id: null,
            input_phone_number: null,
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
            terms_and_conditions_modal: false
        }
        OneSignal.addEventListener('ids', this.onIds);

    }

    componentWillUnmount() {
        // OneSignal.removeEventListener('received', this.onReceived);
        // OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    // // onReceived(notification) {
    // //     alert("Notification received: ", notification);
    // // }

    // // onOpened(openResult) {
    // //     alert('Message: ', openResult.notification.payload.body);
    // //     alert('Data: ', openResult.notification.payload.additionalData);
    // //     alert('isActive: ', openResult.notification.isAppInFocus);
    // //     alert('openResult: ', openResult);
    // // }

    onIds = (device) => {
        console.log('Device info: ', device.userId);
        device_id = device.userId;
        // this.setState({ input_device_id: device.userId });
    }


    google_sign_in = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.log_in('google', userInfo.user);

        } catch (error) {

            alert(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    facebook_log_in = () => {

        LoginManager.logInWithPermissions(['email']).then(
            (result, error) => {
                if (error) {
                    console.log("Login failed with error: ", error.message);
                } else if (result.isCancelled) {
                    console.log("Login was cancelled");
                } else {
                    console.log("Login was successful with permissions: ", result.grantedPermissions)
                    this.facebook_token_access();
                }

            }
        );
    }


    facebook_token_access = () => {
        AccessToken.getCurrentAccessToken().then((data) => {
            const { accessToken } = data;
            // fetch('https://graph.facebook.com/v2.5/me?fields=email,name,picture.type(large)&access_token=' + accessToken)
            fetch('https://graph.facebook.com/v2.5/me?fields=email,name,picture.type(large)&access_token=' + accessToken)
                .then((response) => response.json())
                .then((json) => {
                    // console.log(json);

                    json.photo = json.picture.data.url;
                    delete json.picture;

                    this.log_in('facebook', json);
                })
                .catch(() => {
                    console.log('ERROR GETTING DATA FROM FACEBOOK')
                })
        })
    }


    apple_sign_in = async () => {
        // Start the sign-in request

        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: AppleAuthRequestOperation.LOGIN,
                requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
            });

            // Ensure Apple returned a user identityToken
            if (!appleAuthRequestResponse.identityToken) {
                throw 'Apple Sign-In failed - no identify token returned';
            }

            // console.log('apple sign in', appleAuthRequestResponse);

            let id = appleAuthRequestResponse.user;
            let name = appleAuthRequestResponse.fullName.givenName + ' ' + appleAuthRequestResponse.fullName.familyName;
            let email = appleAuthRequestResponse.email;

            let user = {
                id: id,
                name: name,
                email: email
            }

            this.log_in('apple', user);

        } catch (error) {
            if (error.code === AppleAuthError.CANCELED) {
                console.warn('User canceled Apple Sign in.');
            } else {
                console.error(error);
                Alert.alert('Fail!', "Sign in with apple fail.Try again!", [{
                    text: 'OK',
                }]);
            }

        }

        // // Create a Firebase credential from the response
        // const { identityToken, nonce } = appleAuthRequestResponse;
        // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // // Sign the user in with the credential
        // return auth().signInWithCredential(appleCredential);
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
        console.log(verification_code);
        if (verification_code.length === MAX_LENGTH_CODE) {
            this.setState({ spinner: true });
            confirm_result
                .confirm(verification_code)
                .then(user => {
                    console.log(user)
                    // this.setState({ userId: user.uid })
                    // alert(`Verified! ${user.uid}`)
                    this.setState({ spinner: false, phone_verify_click: false, phone_verify_checked: true });
                    Alert.alert('Success!', 'You have successfully verified your phone number.');
                    let info = {
                        input_phone_number: this.state.input_phone_number
                    }
                    this.log_in('phone_auth', info);
                })
                .catch(error => {
                    if (error.message === '[auth/session-expired] The sms code has expired. Please re-send the verification code to try again.') {
                        this.setState({ spinner: false, phone_verify_click: false, phone_verify_checked: true });
                        Alert.alert('Success!', 'You have successfully verified your phone number.');
                        let info = {
                            input_phone_number: this.state.input_phone_number
                        }
                        this.log_in('phone_auth', info);
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
                    <Text style={{ margin: 10, fontSize: 14, textAlign: 'center' }} onPress={() => this.setState({ enter_code: false })}>
                        Enter the wrong number or need a new code?
          </Text>
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

    toggle_modal = () => {
        this.setState(state => {
            return {
                terms_and_conditions_modal: !state.terms_and_conditions_modal
            }
        });
    }


    render() {

        GoogleSignin.configure({
            webClientId: '305827339741-lj78hgp9frve025pn7c05rpm3eirllci.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });

        let headerText = `What's your ${this.state.enter_code ? 'verification code' : 'phone number'}?`
        let buttonText = this.state.enter_code ? 'Verify confirmation code' : 'Send confirmation code';
        let textStyle = this.state.enter_code ? {
            height: 50,
            textAlign: 'center',
            fontSize: 40,
            fontWeight: 'bold',
            fontFamily: 'Courier'
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

                                <ActivityIndicator size="large" color='#f09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>
                            }



                        </View>

                        :

                        <View style={{ flex: 1, backgroundColor: '#f09839', }} >
                            {
                                Platform.OS === 'ios' ?
                                    <View style={{ height: 180, backgroundColor: '#f09839', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                        <View style={{ width: 120, height: 120, elevation: 10 }}>
                                            <Image
                                                source={require('../asset/image/oh_my_trash.png')}
                                                style={{ width: 120, height: 120, }} />
                                        </View>
                                        <Text style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' }}>Oh My Trash</Text>
                                    </View>
                                    :
                                    <View style={{ height: 180, backgroundColor: '#f09839', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ width: 120, height: 120, elevation: 10 }}>
                                            <Image
                                                source={require('../asset/image/oh_my_trash.png')}
                                                style={{ width: 120, height: 120, }} />
                                        </View>
                                        <Text style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' }}>Oh My Trash</Text>
                                    </View>
                            }
                            <View style={{ flex: 1, backgroundColor: '#FFF', padding: 20 }}>
                                <View style={{ marginTop: 20 }}>
                                    <PersonIcon name='person' color='#f09839' size={25} style={{ position: 'absolute', top: 10, left: 10 }} />
                                    <TextInput style={styles.txtInput} keyboardType={'email-address'} placeholder={"Email or Phone Number"} onChangeText={(input) => { this.setState({ input_email: input }) }} />
                                </View>
                                {/* {inputedPasswordError ? <Text style={{ color: "#FF0000", fontSize: 15, }}>{errorText}<Text> : null} */}
                                <View>
                                    <LockIcon name='lock' color='#f09839' size={25} style={{ position: 'absolute', top: 10, left: 12 }} />
                                    <TextInput secureTextEntry={true} style={styles.txtInput} placeholder={"Password"} onChangeText={(input) => { this.setState({ input_password: input }) }} />
                                </View>
                                <TouchableOpacity style={{
                                    height: 45,
                                    backgroundColor: '#f09839',
                                    borderRadius: 5,
                                    marginTop: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} onPress={() => this.log_in('user', 'password')}>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Login</Text>
                                </TouchableOpacity>

                                <View style={[styles.textRow, { marginVertical: 16 }]}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>OR</Text>
                                </View>
                                <View style={styles.textRow}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f09839' }}>Connect with Social Media</Text>
                                </View>
                                <View style={styles.buttons}>
                                    <GoogleSigninButton
                                        style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}
                                        size={GoogleSigninButton.Size.Icon}
                                        color={GoogleSigninButton.Color.Light}
                                        onPress={this.google_sign_in}
                                    // disabled={this.state.isSigninInProgress}
                                    />
                                    <TouchableOpacity style={{
                                        marginLeft: 14,
                                        width: 42,
                                        height: 42,
                                        borderRadius: 2,
                                        backgroundColor: '#FFF',
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }} onPress={() => this.facebook_log_in()} >
                                        <Icon name='logo-facebook' size={25} color='#3B5998'></Icon>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        marginLeft: 20,
                                        width: 42,
                                        height: 42,
                                        borderRadius: 2,
                                        backgroundColor: '#FFF',
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }} onPress={() =>
                                        this.setState(state => {
                                            return {
                                                phone_verify_click: !state.phone_verify_click
                                            }
                                        })
                                    } >
                                        <CellPhoneIcon name='cellphone-android' size={25} color={'#222'} />
                                    </TouchableOpacity>
                                </View>
                                {
                                    Platform.OS === 'ios' &&
                                    <View style={{ flex: 1, alignItems: 'center', margin: 5 }}>
                                        <AppleButton
                                            buttonStyle={AppleButton.Style.BLACK}
                                            buttonType={AppleButton.Type.SIGN_IN}
                                            style={{
                                                width: 165, // You must specify a width
                                                height: 42, // You must specify a height
                                            }}
                                            onPress={() => this.apple_sign_in()}
                                        />
                                    </View>
                                }
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', }}>
                                    {
                                        Platform.OS === 'ios' ?
                                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <TouchableOpacity onPress={this.toggle_modal}>
                                                    <Text style={{ fontSize: 14, fontWeight: '500', borderBottomWidth: 1, borderBottomColor: '#BDBDBD', color: '#9E9E9E' }}>Terms and Conditions</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.sign_up()} style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    backgroundColor: '#f09839',
                                                    elevation: 10,
                                                    padding: 10,
                                                    borderRadius: 8
                                                }}>
                                                    <Text style={{ paddingRight: 5, color: '#fff' }}>Sign Up</Text>
                                                    <CellPhoneIcon name="account-arrow-right" color="#fff" size={25} />
                                                </TouchableOpacity>
                                            </View>

                                            :
                                            <TouchableOpacity onPress={() => this.sign_up()} style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                backgroundColor: '#f09839',
                                                elevation: 10,
                                                padding: 10,
                                                borderRadius: 8
                                            }}>
                                                <Text style={{ paddingRight: 5, color: '#fff' }}>Sign Up</Text>
                                                <CellPhoneIcon name="account-arrow-right" color="#fff" size={25} />
                                            </TouchableOpacity>
                                    }
                                </View>
                                <Modal
                                    animationType='none' visible={this.state.terms_and_conditions_modal} transparent onRequestClose={this.toggle_modal} >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                                        <View style={{ width: '100%', height: '80%', backgroundColor: '#fff', borderRadius: 5, elevation: 5, margin: 10, paddingHorizontal: 20, paddingVertical: 10 }} >
                                            <ScrollView>
                                                <Text style={{ color: '#f09839', fontSize: 20, fontWeight: '700', marginBottom: 10 }}>Terms and Conditions</Text>
                                                <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 20 }}>Acceptance of Terms</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 20 }}>BY USING THE SERVICES, YOU ARE AGREEING, ON BEHALF OF YOURSELF AND THOSE YOU REPRESENT, TO COMPLY WITH AND BE LEGALLY BOUND BY THESE TERMS AS WELL AS OUR PRIVACY POLICY AND ALL APPLICABLE LAWS. IF YOU, FOR YOURSELF OR ON BEHALF OF THOSE YOU REPRESENT, DO NOT AGREE TO ANY PROVISION OF THESE TERMS, YOU MUST, FOR YOURSELF AND ON BEHALF ANY SUCH PERSON(S), DISCONTINUE THE REGISTRATION PROCESS.</Text>
                                                <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 20 }}>Modification of Terms</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 20 }}>Oh My Trash (“Oh My Trash”, “we”, “us” or “our”) provides a free and open source platform via its apps to a community of registered users (“users” or “you”) to engage in a variety of activities, including to upload and display photographs (“Visual Content”), share comments, opinions, and ideas, promote Visual Content The foregoing list of Services is not all-inclusive and additional Services may be offered by us from time to time. The following are the terms of use (“Terms”) for using the Site and the Services.</Text>
                                                <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 20 }}>Registration</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 20 }}>Services are available to authorized representatives of legal entities and to individuals who are either (i) at least 17 years old to register for Oh My Trash, or (ii) at least 14 years old, and who are authorized to access the Site by a parent or legal guardian. If you have authorized a minor to use the Site, you are responsible for the online conduct of such minor, and the consequences of any misuse of the Site by the minor. Parents and legal guardians are warned that the Site does display Visual Content containing nudity and violence that may be offensive to some.</Text>
                                                <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 20 }}>User Conduct</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 20 }}>All Visual Content posted or otherwise submitted to the Site, and any comments, or other communications (“Communications”, with Visual Content and Communications collectively referred to as “Content”) is the sole responsibility of the account holder from which such Communications originate. You acknowledge and agree that you, and not Oh My Trash, are entirely responsible for all Content that you post, or otherwise submit to the Site, including via messages exchanged through Oh My Trash’s messenger service. Oh My Trash does not control user submitted Content and, as such, does not guarantee the accuracy, integrity, or quality of such Content. You understand that by using the Platform, you may be exposed to Content that is offensive, indecent, or objectionable.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. As a condition of use, you promise to abide by our Content Guidelines and not to use the Services for any purpose that is unlawful or prohibited by these Terms, or any other purpose not reasonably intended by Oh My Trash. By way of example, and not as a limitation, you agree not to use the Services:</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To abuse, harass, threaten, impersonate, or intimidate any person.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To post or transmit, or cause to be posted or transmitted, any Content that is libelous, defamatory, obscene,pornographic, abusive, offensive, profane, or that infringes any copyright or other right of any person.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To communicate with Oh My Trash’s representatives or other users in an abusive or offensive manner.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. For any purpose (including posting or viewing Conte that is not permitted under the laws of the jurisdiction where you use the Services.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To post or transmit, or cause to be posted or transmitted, any Communication designed or intended to obtain password, account, or private information from any Oh My Trash user.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To create or transmit unwanted ‘spam’ to any person or any URL.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To create multiple accounts for the purpose of voting for users’ Visual Content.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To post copyrighted Content that does not belong to you, unless you are commenting on Visual Content in Blogs, where you may post such Content subject to providing appropriate attribution to the copyright owner and a link to the source of the Content.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. You agree not to use any robot, spider, scraper, or other automated means to access the Platform for any purpose without our express written permission. Additionally, you agree that you will not take any action that imposes, or may impose in our sole discretion an unreasonable or disproportionately large load on our infrastructure, interfere or attempt to interfere with the proper working of the Platform or any activities conducted on the Site or bypass any measures we may use to prevent or restrict access to the Site.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To artificially inﬂate or alter vote counts, blog counts, comments, or any other Service or for the purpose of giving or receiving money or other compensation in exchange for votes and/or in an attempt to alter the result of any contest or promotion, or for participating in any other organized effort that in any way artificially alters the results of Services.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To advertise to, or solicit, any user to buy or sell any third party products or services, or to use any information obtained from the Services in order to contact, advertise to, solicit, or sell to any user without their prior explicit consent.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To promote or sell Visual Content of another person unless you are expressly authorized to do so.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To sell, assign, or otherwise transfer your Profile or account.</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 10 }}>. To promote drugs, firearms in any manner. Violation of this guideline will lead to a permanent ban effective immediately from the platform.</Text>
                                                <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 20 }}>Consent</Text>
                                                <Text style={{ fontSize: 15, marginBottom: 20 }}>By using our app, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</Text>
                                            </ScrollView>

                                            <TouchableHighlight onPress={this.toggle_modal} style={{ alignSelf: 'flex-end', padding: 10 }} underlayColor={'#f1f1f1'}>
                                                <Text style={{ fontSize: 16, color: '#f09839', fontWeight: '600' }}>OK</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                }
            </Fragment>


        )
    }





    async log_in(account_type, info) {

        let data;
        let proceed = false;
        info.account_type = account_type;
        if (account_type == 'facebook' || account_type == 'google' || account_type == 'apple') {
            data = {
                account_id: info.id,
                account_type: account_type,
                email: info.email,
                name: info.name,
                device_id: device_id
            }
            proceed = true;
        } else if (account_type == 'phone_auth') {
            data = {
                input_phone_number: info.input_phone_number,
                device_id: device_id
            }
            proceed = true;
        } else {
            let { input_email, input_password } = this.state;
            // input_email = 'myothurein.bts@gmail.com';
            // input_password = 'admin';
            if (input_email && input_password) {
                data = {
                    email: input_email,
                    password: input_password,
                    device_id: device_id
                }
                proceed = true;
            }
            else {
                proceed = false;
                alert('Enter both email or phone and password!');
            }

        }

        if (proceed) {
            this.props.login(account_type, data, () => this.props.navigation.navigate('AddProfile', { 'user': info }));
        }

    }

    sign_up() {
        this.props.navigation.navigate('AddProfile');
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    login: (account_type, data, callback) => {
        dispatch(login(account_type, data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);


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
        borderColor: "#9E9E9E",
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
        backgroundColor: '#222222',
        borderWidth: 1,
        borderBottomWidth: 1,
        color: '#ffffff',
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
        marginTop: 16
    },
    button: {
        marginHorizontal: 5
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

