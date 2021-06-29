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

class ItemDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        this.state = {
            item: params.item,
            token: null,
            image_modal_visibility: false,
            image_index: 0
        }
    }


    render() {


        const { item } = this.state;
        const item_image = item.image;

        let images = [];
        item_image.map(img => images.push({ url: img }));


        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView style={{ padding: 15 }}>

                    {
                        item.image.length === 1 ?

                            < TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true, image_index: 0 })}>
                                <Image source={{ uri: item_image[0] }} style={{ height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5, marginBottom: 10 }} />
                            </TouchableOpacity>

                            :

                            <ScrollView
                                style={{
                                    minHeight: 200,
                                    marginVertical: 10,
                                    borderColor: '#222',
                                }}
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {
                                    item.image.map((item, index) => (

                                        <TouchableOpacity key={index} style={{ marginRight: 5 }} onPress={() => this.setState({ image_modal_visibility: true, image_index: index })}>
                                            <Image source={{ uri: item }} style={{ width: 250, height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5 }} />
                                        </TouchableOpacity>

                                    ))
                                }

                            </ScrollView>

                    }

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f09839' }} opacity={1}>{item.name}</Text>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 15 }} opacity={1}>
                            {item.description}
                        </Text>
                    </View>
                    <View style={{ minHeight: 100, borderWidth: 1, borderRadius: 3, borderColor: '#222', padding: 10, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'center', alignItems: 'center' }} >
                            <Text style={{ flex: 1, color: '#f09839', fontSize: 16, fontWeight: 'bold' }} >Date</Text>
                            <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }} >Price</Text>
                            <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }} >Min</Text>
                            <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }}>Max</Text>
                            <Text style={{ flex: 0.5, color: '#f09839', fontSize: 16, fontWeight: 'bold' }}>Unit</Text>
                        </View>

                        {
                            item.price.length > 0 ?
                                item.price.map((i, item) => this.render_item_price(i, item))
                                :
                                <View style={{ height: 40, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 14, }}>No price is added !</Text>
                                </View>
                        }
                    </View>
                </ScrollView>
                <Modal visible={this.state.image_modal_visibility} transparent={true} onRequestClose={this._toggleModal}>
                    <ImageViewer
                        index={this.state.image_index}
                        imageUrls={images}
                        enableSwipeDown={true}
                        onCancel={this._toggleModal}
                    />
                </Modal>
            </Fragment >
        )
    }

    render_item_price = (item, index) => {

        return (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 10, flex: 1 }} >
                <Text style={{ flex: 1, }} >{item.date}</Text>
                <Text style={{ flex: 0.5 }}>{item.currency}</Text>
                <Text style={{ flex: 0.5, }} >{item.min_price} </Text>
                <Text style={{ flex: 0.5, }}>{item.max_price}</Text>
                <Text style={{ flex: 0.5 }}>{item.unit}</Text>
            </View>
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

export default connect(null)(ItemDetail);


const styles = StyleSheet.create({
    container: {
        // flex:1,
        // justifyContent: 'center',
        // alignItems: 'center',
        height: 300,
        alignItems: 'stretch'
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    // mediaPlayer: {
    //   position: 'absolute',
    //   top: 0,
    //   left: 0,
    //   bottom: 0,
    //   right: 0,
    //   backgroundColor: 'black',
    //   justifyContent:'center',
    //   alignItems:'center'
    // },
    mediaPlayer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        // height:300,
        backgroundColor: 'black',
        // justifyContent: 'center',
        // alignItems:'center',
    },
});
