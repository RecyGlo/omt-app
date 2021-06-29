import React, { Fragment } from 'react';
// import Video from 'react-native-video';
// import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
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

const url = 'https://www.dropbox.com/s/0x2ke57h7wv49ll/Sample_512x288.mp4'

class NewsDetail extends React.PureComponent {

    constructor(props) {
        super(props);
        let params = this.props.route.params;
        this.state = {
            news: params.news,
            news_image: null,
            video_modal_visibility: false,
            token: null,
            images: [],
            currentTime: 0,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: false,
            // playerState: PLAYER_STATES.PLAYING,
            screenType: 'content',
            image_modal_visibility: false,
            image_index: 0
        }

    }

    componentDidMount() {
        const { news } = this.state;
        const news_image = news.image;
        let images = [];
        news_image.map(img => images.push({ url: img }));
        this.setState({ images: images })
    }



    onSeek = seek => {
        //Handler for change in seekbar
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        //Handler for Video Pause
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    };

    onReplay = () => {
        //Handler for Replay
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };

    onLoad = data => this.setState({ duration: data.duration, isLoading: false });

    onLoadStart = data => this.setState({ isLoading: true });

    onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });

    onError = () => alert('Oh! ', error);

    exitFullScreen = () => {
        alert('Exit full screen');
    };

    enterFullScreen = () => { };

    onFullScreen = () => {
        if (this.state.screenType == 'content')
            this.setState({ screenType: 'cover' });
        else this.setState({ screenType: 'content' });
    };

    // render() {
    // let params = this.props.navigation.state.params;
    // let news = params.news;
    //     return (
    //         <Fragment>
    //             <StatusBar backgroundColor={"#f09839"} />
    //             <ScrollView style={{ padding: 15 }}>
    // {/* <TouchableOpacity onPress={() => this.setState({video_modal_visibility:true})}>
    // <Image
    //     source={{ uri: news.image }} style={{ height: 200, alignItems: 'center', borderRadius: 5, width: '100%', marginBottom: 15 }} opacity={0.9}>
    // </Image>
    // </TouchableOpacity>
    // <View style={{ marginBottom: 15 }}>
    //     <Text style={{ fontSize: 15 }} opacity={1}>{news.title}</Text>
    // </View>
    // <View style={{ marginBottom: 15 }}>
    //     <Text style={{ fontSize: 15 }} opacity={1}>
    //         {news.content}
    //     </Text>
    // </View>
    // <Modal
    //     // animationType="slide"
    //     transparent={false}
    //     visible={this.state.video_modal_visibility}
    //     onRequestClose={() => this.setState({video_modal_visibility:false})}>
    //     <View style={{
    //         flex: 1,
    //         justifyContent: 'center',
    //         backgroundColor: 'black',

    //     }} >
    //         <Video
    //             url={url}
    //             autoPlay
    //             fullScreenOnly
    //         // lockPortraitOnFsExit
    //         />
    //     </View>
    // </Modal> */}
    //                 <View style={{
    //                     flex: 1,
    //                     justifyContent: 'center',
    //                     backgroundColor: 'black',

    //                 }} >
    //                     <Video
    //                         source={{ uri: url }}   // Can be a URL or a local file.
    //                         ref={(ref) => {
    //                             this.player = ref
    //                         }}
    //                         onBuffer={this.onBuffer}              // Callback when remote video is buffering
    //                         onError={this.videoError}
    //                     // autoPlay
    //                     // fullScreenOnly
    //                     // lockPortraitOnFsExit
    //                     />
    //                 </View>
    //             </ScrollView>
    //         </Fragment>

    //     )
    // }


    render() {

        const { news, images } = this.state;

        return (
            <Fragment>
                <StatusBar backgroundColor={"#f09839"} />
                <ScrollView style={{ padding: 15 }}>


                    {/* {
                        this.state.video_modal_visibility ?

                            <View style={{
                                height: 200, alignItems: 'center', borderRadius: 5, width: '100%', marginBottom: 15,
                                justifyContent: 'center',
                                backgroundColor: 'black',

                            }} >

                                <Video
                                    onEnd={this.onEnd}
                                    onLoad={this.onLoad}
                                    onLoadStart={this.onLoadStart}
                                    onProgress={this.onProgress}
                                    paused={this.state.paused}
                                    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                    resizeMode={'cover'}
                                    onFullScreen={this.state.isFullScreen}
                                    source={{ uri: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4' }}
                                    style={styles.mediaPlayer}
                                    volume={10}
                                />
                                <MediaControls
                                    duration={this.state.duration}
                                    isLoading={this.state.isLoading}
                                    mainColor="#333"
                                    onFullScreen={this.onFullScreen}
                                    onPaused={this.onPaused}
                                    onReplay={this.onReplay}
                                    onSeek={this.onSeek}
                                    onSeeking={this.onSeeking}
                                    playerState={this.state.playerState}
                                    progress={this.state.currentTime}
                                // toolbar={this.renderToolbar()}
                                />
                            </View>

                            :

                            <TouchableOpacity onPress={() => this.setState({ video_modal_visibility: true })}>
                                <Image
                                    source={{ uri: news.image }} style={{ height: 200, alignItems: 'center', borderRadius: 5, width: '100%', marginBottom: 15 }} opacity={0.9}>
                                </Image>
                            </TouchableOpacity>



                    } */}

                    {/* <ScrollView style={{ height: 200 }} horizontal={true} showsHorizontalScrollIndicator  > */}
                    {
                        news.image.length === 1 ?

                            < TouchableOpacity onPress={() => this.setState({ image_modal_visibility: true, image_index: 0 })}>
                                <Image source={{ uri: news.image[0] }} style={{ height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5, marginBottom: 10 }} />
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
                                    news.image.map((item, index) => (

                                        <TouchableOpacity key={index} style={{ marginRight: 5 }} onPress={() => this.setState({ image_modal_visibility: true, image_index: index })}>
                                            <Image source={{ uri: item }} style={{ width: 250, height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#222', borderRadius: 5 }} />
                                        </TouchableOpacity>

                                    ))
                                }

                            </ScrollView>
                    }

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f09839' }} opacity={1}>{news.title}</Text>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 15 }} opacity={1}>
                            {news.content}
                        </Text>
                    </View>

                    {/* <Modal
                        // animationType="slide"
                        transparent={false}
                        visible={this.state.video_modal_visibility}
                        onRequestClose={() => this.setState({ video_modal_visibility: false })}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: 'black',

                        }} >
                            <Video
                                onEnd={this.onEnd}
                                onLoad={this.onLoad}
                                onLoadStart={this.onLoadStart}
                                onProgress={this.onProgress}
                                paused={this.state.paused}
                                ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                resizeMode={this.state.screenType}
                                onFullScreen={this.state.isFullScreen}
                                source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                                style={styles.mediaPlayer}
                                volume={10}
                            />
                            <MediaControls
                                duration={this.state.duration}
                                isLoading={this.state.isLoading}
                                mainColor="#333"
                                onFullScreen={this.onFullScreen}
                                onPaused={this.onPaused}
                                onReplay={this.onReplay}
                                onSeek={this.onSeek}
                                onSeeking={this.onSeeking}
                                playerState={this.state.playerState}
                                progress={this.state.currentTime}
                            // toolbar={this.renderToolbar()}
                            />
                        </View>
                    </Modal> */}

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

    _toggleModal = () => {
        this.setState(state => {
            return {
                image_modal_visibility: !state.image_modal_visibility
            }
        });
    }

}

export default connect(null)(NewsDetail);


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

// let styles = StyleSheet.create(
//     {
//         root: {
//             backgroundColor: '#191e1f'
//         },
//         title: {
//             marginBottom: 5,
//             color: '#ECC951'
//         },
//     }
// );