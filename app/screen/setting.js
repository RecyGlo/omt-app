import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Text,
    StatusBar,
    StyleSheet,
    Linking
} from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import AddressIcon from 'react-native-vector-icons/Entypo';
import GameIcon from 'react-native-vector-icons/Entypo';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import EmailIcon from 'react-native-vector-icons/Zocial';
import PersonIcon from 'react-native-vector-icons/MaterialIcons';
import EditIcon from 'react-native-vector-icons/MaterialIcons';
import LogOutIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContactUsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrowRightIcon from 'react-native-vector-icons/AntDesign';
import FeedbackIcon from 'react-native-vector-icons/MaterialIcons';
import SettingIcon from "react-native-vector-icons/AntDesign";
import QuestionIcon from "react-native-vector-icons/AntDesign";
import InfoIcon from 'react-native-vector-icons/MaterialIcons';
import TermsIcon from 'react-native-vector-icons/Ionicons';
import NotificationsIcon from "react-native-vector-icons/MaterialIcons";
import ContactsIcon from "react-native-vector-icons/AntDesign";
import AppIntroSlider from 'react-native-app-intro-slider';
import { log_out } from '../redux/actions/userAction';
import MapMarkerIcon from 'react-native-vector-icons/FontAwesome';
import getInitial from '../service/getInitial';


class Setting extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            display_profile: false,
            app_walkthrough: false
        }
    }

    slides = [
        {
            key: 'k1',
            title: 'Welcome to Oh My Trash',
            text: 'Oh My Trash is a personal waste management app & waste trading matching platform.',
            image: require('./../asset/image/oh_my_trash.png'),
            titleStyle: styles.title,
            textStyle: styles.text,
            imageStyle: styles.image,
            backgroundColor: '#f09839',
        },
        {
            key: 'k2',
            title: 'Recyclable Item',
            text: 'Information for recyclable items along with price.',
            image: {
                uri:
                    'https://image.flaticon.com/icons/png/512/49/49793.png',
            },
            titleStyle: styles.title,
            textStyle: styles.text,
            imageStyle: styles.image,
            backgroundColor: '#F4B1BA',
        },
        {
            key: 'k3',
            title: 'Nearest Junk Shop ',
            text: 'Multiple near junk shop locations to sell recyclable items.',
            image: {
                uri: 'https://i.imgur.com/bXgn893.png',
            },
            titleStyle: styles.title,
            textStyle: styles.text,
            imageStyle: styles.image,
            backgroundColor: '#4093D2',
        },
        {
            key: 'k4',
            title: 'News',
            text: 'News covering all the benefits and advantages of recycling,the human actions that cause our planet harmful and tips to upcycle our used appliances and many more.',
            image: {
                uri: 'https://image.flaticon.com/icons/png/512/21/21601.png',
            },
            titleStyle: styles.title,
            textStyle: styles.text,
            imageStyle: styles.image,
            backgroundColor: '#644EE2',
        }
    ];


    on_done_all_slides = () => {
        this.setState({ app_walkthrough: false });
    };
    
    on_skip_slides = () => {
        this.setState({ app_walkthrough: false });
    };

    render() {
        const { display_profile } = this.state;
        const { user } = this.props;
        if (this.state.app_walkthrough) {
            StatusBar.setHidden(true, 'none');
            return (
                <AppIntroSlider slides={this.slides} onDone={this.on_done_all_slides}
                    showSkipButton={true}
                    onSkip={this.on_skip_slides} />
            )
        } else {
            StatusBar.setHidden(false, 'none');

            return (

                <Fragment>
                    <StatusBar backgroundColor={"#f09839"} />
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
                                <View style={{ height: 180, backgroundColor: '#f09839', justifyContent: 'center', alignItems: 'center', }}>
                                    <View style={{ width: 120, height: 120, elevation: 10 }}>
                                        <Image
                                            source={require('../asset/image/oh_my_trash.png')}
                                            style={{ width: 120, height: 120, }} />
                                    </View>
                                    <Text style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' }}>Oh My Trash</Text>
                                    {/* <View style={{ width: '50%', height: 180, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 20 }}>Contribution</Text>
                                        <Text style={{ fontSize: 20 }}>0.50</Text>
                                    </View>
                                    <View style={{ width: '50%', height: 180, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ width: 100, height: 100, borderRadius: 10 }}>
                                            <Image
                                                source={require('../asset/image/scan_icon.png')}
                                                style={{ width: 100, height: 100, }}
                                            />
                                        </View>
                                    </View> */}
                                </View>
                        }

                        {
                            display_profile ?

                                <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                        {
                                            user.profileImage ?
                                                <Image
                                                    source={{ uri: user.profileImage }}
                                                    style={{ width: 100, height: 100, borderRadius: 50 }} />
                                                :
                                                <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#9E9E9E', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 25, fontWeight: '700', }}>
                                                        {getInitial(user.name)}
                                                    </Text>
                                                </View>
                                        }
                                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                            <View style={{ marginBottom: 5 }}><Text style={{ color: '#222', fontSize: 20, fontWeight: '700' }}>{user.name}</Text></View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}><PhoneIcon name='phone' color='#f09839' size={20} /><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 5 }}>{user.phoneNumber}</Text></View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}><EmailIcon name='email' color='#f09839' size={20} /><Text style={{ backgroundColor: '#FFF', color: '#222', padding: 5, marginLeft: 5 }}>{user.email ? user.email : 'Email is not added!'}</Text></View>
                                        </View>
                                        <TouchableOpacity style={{ position: 'absolute', right: 1, top: 1, zIndex: 2, shadowColor: '#FFF' }}
                                            onPress={() => this.setState({ display_profile: false })}>
                                            <SettingIcon name='setting' color='#f09839' size={30} style={{ padding: 3 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}><AddressIcon name='address' color='#f09839' size={20} />
                                        <Text style={{ marginLeft: 10 }} >{user.location ? user.location.address ? user.location.address : 'Address is not added!' : 'Address is not added!'}</Text></View>
                                    {
                                        user.location && user.location.coordinate ?

                                            <MapView
                                                // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                                style={styles.map}
                                                region={{
                                                    latitude: user.location.coordinate.lat,
                                                    longitude: user.location.coordinate.lng,
                                                    latitudeDelta: 0.00315,
                                                    longitudeDelta: 0.00321,
                                                }}
                                            >
                                                <Marker
                                                    draggable={true}
                                                    coordinate={{
                                                        latitude: user.location.coordinate.lat,
                                                        longitude: user.location.coordinate.lng
                                                    }}
                                                >
                                                    <MapMarkerIcon name='map-pin' color='black' size={40} />
                                                </Marker>
                                            </MapView>
                                            :
                                            <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
                                                <Text>Location is not added!</Text>
                                            </View>
                                    }

                                </ScrollView>

                                :

                                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }} onPress={() => this.setState({ display_profile: true })}>
                                        <PersonIcon name='person' color='#f09839' size={22} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Profile</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.edit_profile(user)}>
                                        <EditIcon name='edit' color='#f09839' size={20} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Edit Profile</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('Notification')}>
                                        <NotificationsIcon name='notifications' color='#f09839' size={20} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Notification</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => Linking.openURL('https://bit.ly/2VWYKSc')}>
                                        <GameIcon name='game-controller' color='#f09839' size={20} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Oh My Trash Game</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('Contact')}>
                                        <ContactsIcon name='contacts' color='#f09839' size={20} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Contact</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity> */}
                                    {/* <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => Linking.openURL('https://bit.ly/2SlV3Ez')}>
                                        <FeedbackIcon name='feedback' color='#f09839' size={20} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Feedback</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.setState({ app_walkthrough: true })}>
                                        <QuestionIcon name='questioncircleo' color='#f09839' size={18} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>App Walkthrough</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('TermsAndConditions')}>
                                        <TermsIcon name='newspaper-outline' color='#f09839' size={22} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Terms & Conditions</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}>
                                        <InfoIcon name='info-outline' color='#f09839' size={22} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Privacy Policy</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('ContactUs')}>
                                        <ContactUsIcon name='contacts-outline' color='#f09839' size={22} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Contact Us</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', height: 50, margin: 5, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, padding: 10, marginBottom: 20 }}
                                        onPress={() => this.props.log_out()}>
                                        <LogOutIcon name='logout' color='#f09839' size={20} style={{ flex: 2 }} />
                                        <Text style={{ flex: 3, fontSize: 15, }}>Log Out</Text>
                                        <ArrowRightIcon name='right' color='#555' size={20} style={{ flex: 1, textAlign: 'right' }} />
                                    </TouchableOpacity>
                                </ScrollView>
                        }
                    </View>
                </Fragment >
            )
        }
    }

    edit_profile = (user) => {
        this.props.navigation.navigate('EditProfile', { 'user': { user } });
    }

}




const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    log_out: () => {
        dispatch(log_out())
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(Setting);


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
        flex: 1

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
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        // flex:1,
        // height: "100%",
        width: '100%',
        height: 250,
        // borderColor: '#222',
        // borderWidth: 2
    },
});