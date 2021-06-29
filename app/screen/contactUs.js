import React, { Fragment } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
    Linking
} from 'react-native';
import { connect } from 'react-redux';


class ContactUs extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            input_name: null,
            input_message: null,
            add_button_loading: false
        }
    }

    render() {

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ margin: 15 }}>
                        <Text style={{ fontSize: 16, marginBottom: 20, fontWeight: '500' }}>Feel free to get in touch with Oh My Trash Team. </Text>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Linking.openURL('https://www.ohmytrash.com/')}>
                            <Text style={{ fontSize: 14, marginBottom: 10, }}>Website :
                            <Text style={{ fontStyle: 'italic', color: 'blue' }}> https://www.ohmytrash.com/ </Text>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Linking.openURL('mailto:ohmytrashmm@gmail.com')}>
                            <Text style={{ fontSize: 14, marginBottom: 10, }}>Gmail :
                            <Text style={{ fontStyle: 'italic', color: 'blue' }}> ohmytrashmm@gmail.com </Text>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Linking.openURL('https://www.facebook.com/ohmytrashmm')}>
                            <Text style={{ fontSize: 14, marginBottom: 20, }}>Facebook :
                            <Text style={{ fontStyle: 'italic', color: 'blue' }}> https://www.facebook.com/ohmytrashmm </Text>
                            </Text>
                        </TouchableOpacity>
                        <TextInput style={{ color: '#222', padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 45 }}
                            placeholder={"Name"} onChangeText={(input) => { this.setState({ input_name: input }) }} />
                        <TextInput style={{ color: '#222', padding: 10, borderWidth: 1, borderColor: "#9E9E9E", borderRadius: 5, marginBottom: 10, minHeight: 100 }}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            multiline={true}
                            placeholder={"Message"} onChangeText={(input) => { this.setState({ input_message: input }) }} />
                        {
                            this.state.add_button_loading ?

                                <ActivityIndicator size="large" color='#f09839' style={{ height: 45, marginVertical: 16 }} ></ActivityIndicator>

                                :

                                <TouchableOpacity style={{ marginVertical: 20, height: 45, backgroundColor: '#f09839', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                                    onPress={() => this.confirm()}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Message</Text>
                                </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </Fragment>
        )
    }

    confirm() {

        const { input_name, input_message, } = this.state;
        if (input_name && input_message) {

            this.setState({ add_button_loading: true })

            setTimeout(() => this.setState({ add_button_loading: false }), 1000);


        } else {
            alert("Fill name and message!");
        }
    }

}

const mapStateToProps = state => ({
    user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
    add_news: (data, callback) => {
        dispatch(add_news(data, callback));
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);

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