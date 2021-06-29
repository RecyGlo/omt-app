import React, { Fragment } from 'react';
import {
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    Text,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';

class NotificationDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        this.state = {
            notification: params.notification,
            image_modal_visibility: false
        }

    }


    render() {

        const { notification } = this.state;

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView style={{ padding: 15 }}>
                    {
                        notification.image &&

                        < TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true })}>
                            <Image source={{ uri: notification.image }} style={{ height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5, marginBottom: 10 }} />
                        </TouchableOpacity>

                    }

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f09839' }} opacity={1}>{notification.title}</Text>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 15 }} opacity={1}>
                            {notification.message}
                        </Text>
                    </View>
                </ScrollView>
                <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                    <ImageViewer
                        imageUrls={notification.image}
                        enableSwipeDown={true}
                        onCancel={this._toggleModal}
                    />
                </Modal>
            </Fragment >
        )
    }

    _toggleModal = () => {
        this.setState(state => {
            return {
                image_modal_visibility: !state.image_modal_visibility
            }
        });
    }

}

export default connect(null)(NotificationDetail);


const styles = StyleSheet.create({
    container: {
        height: 300,
        alignItems: 'stretch'
    },
});

