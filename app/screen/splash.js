import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import { get_user_info, update_access_token } from '../redux/actions/userAction';
// import * as Animatable from 'react-native-reanimated';
import jwtDecode from 'jwt-decode';
// import slides from '../service/appWalkthroughSlide';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { UserSetUp, HomeSetUp, BottomTab } from './../app';
import OneSignal from 'react-native-onesignal';

class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            first_time_app_opening: false,
            connection_status: true,
        }


        OneSignal.init("24076781-f30d-4725-9e06-d5d8aaf9563a");

        // OneSignal.addEventListener('received', this.onReceived);
        // OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.addEventListener('ids', this.onIds);
    }

    // componentWillUnmount() {
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    // OneSignal.removeEventListener('ids', this.onIds);
    // }

    // onReceived(notification) {
    //     alert("Notification received: ", notification);
    // }

    // onOpened(openResult) {
    //     alert('Message: ', openResult.notification.payload.body);
    //     alert('Data: ', openResult.notification.payload.additionalData);
    //     alert('isActive: ', openResult.notification.isAppInFocus);
    //     alert('openResult: ', openResult);
    // }

    // onIds(device) {
    //     // console.log('Device info: ', device.userId);
    //     // this.setState({ input_device_id: device.userId });
    // }


    slides = [
        {
            key: 'k1',
            title: 'Welcome to Oh My Trash',
            text: 'Oh My Trash is a personal waste management app & waste trading matching platform.',
            // image: {
            //     uri: 'https://oh-my-trash.s3-ap-southeast-1.amazonaws.com/oh_my_trash.png'
            // },
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

    async componentDidMount() {

        const keys = ['access_token', 'user_id'];
        await AsyncStorage.multiGet(keys).then((data) => {
            this.setState({ first_time_app_opening: false });
            if (data[0][1]) {
                const access_token = data[0][1];
                const user_id = data[1][1];

                NetInfo.fetch().then((status) => {

                    if (status.isConnected == false) {
                        alert('No Internet Connection!');
                        this.setState({ connection_status: false });
                    } else {
                        if (this.checkJWTExpire(access_token)) {
                            this.props.update_access_token(() => this.props.navigation.navigate('Login'));
                        } else {
                            this.props.get_user_info(user_id)
                        }
                    }
                })
            } else {
                this.setState({ first_time_app_opening: true });
            }
        })
            .catch(() => {
                this.setState({ first_time_app_opening: true });
            }
            );
    }

    checkJWTExpire = (access_token) => {
        const { exp } = jwtDecode(access_token);
        if (exp > new Date().getTime() / 1000) {
            return false;
        }
        return true;
    }

    on_done_all_slides = () => {
        this.setState({ first_time_app_opening: false });
    };

    on_skip_slides = () => {
        this.setState({ first_time_app_opening: false });
    };

    render() {


        setTimeout(() => {
            this.setState({ progress: 1 });
        }, 3000);
        if (this.state.progress == 1) {
            if (this.state.connection_status) {
                if (this.state.first_time_app_opening) {
                    return (
                        <AppIntroSlider slides={this.slides} onDone={this.on_done_all_slides}
                            showSkipButton={true}
                            onSkip={this.on_skip_slides} />
                    )
                } else {
                    if (this.props.user) {
                        // return <BottomTab />
                        return <HomeSetUp />
                    } else {
                        return <UserSetUp />
                    }
                }
            }
        } else {
            return (
                <View style={styles.container}>
                    <ImageBackground style={styles.image} source={require('../asset/image/oh_my_trash.png')} />
                    <Text style={styles.textc}>Oh My Trash</Text>
                </View>
            )
        }
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    get_user_info: (user_id) => {
        dispatch(get_user_info(user_id));
    },
    update_access_token: () => {
        dispatch(update_access_token());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);


let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f09839',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textc: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 20
    },
    progress: {
        backgroundColor: '#e5e5e5'
    },
    MainContainer: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 25,
        color: '#222',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
        color: '#222',
        fontSize: 20,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    }
});