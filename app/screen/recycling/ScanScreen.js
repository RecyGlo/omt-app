'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;

// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';

import {firebase} from '@react-native-firebase/database';

const database = firebase
  .app()
  .database('https://ohmytrash-omt-17f0f.firebaseio.com');

class ScanScreen extends Component {
  onSuccess = (e) => {
    console.log(e.data);
    database
      .ref('/rvm/'+e.data)
      .once('value')
      .then((snapshot) => {
        console.log('User data: ', snapshot.val());
        if (snapshot.val() !== null) {
          let val = '';
          if (snapshot.val() == 'open') {
            val = 'close';
          } else {
            val = 'open';
          }
          database
          .ref('/rvm/'+e.data)
          .set(val)
          .then(() => console.log('Data set.', val));
        }
      });

    // database
    //   .ref('/rvm/'+e.data)
    //   .set(false)
    //   .then(() => console.log('Data set.'));
    this.props.navigation.navigate('Recycling');
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  };

  componentDidMount() {
    this.readData();
  }

  readData = () => {
    database
      .ref('/rvm/91161273')
      .once('value')
      .then((snapshot) => {
        console.log('User data: ', snapshot.val());
      });
  };
  render() {
    return (
        <Text>QR Code Scanner</Text>
      // <QRCodeScanner
      //   // containerStyle={{ paddingTop: 100 }}
      //   cameraStyle={{height: windowHeight - 130}}
      //   onRead={this.onSuccess}
      //   topViewStyle={{height: 0, flex: 0, zIndex: 1}}
      //   bottomViewStyle={{height: 0, flex: 0, zIndex: 0}}
      //   // flashMode={RNCamera.Constants.FlashMode.torch}
      //   // topContent={
      //   //   <TouchableOpacity style={styles.buttonTouchable}>
      //   //     <Text style={styles.buttonText}>Top</Text>
      //   //   </TouchableOpacity>
      //   // }
      //   bottomContent={
      //     <TouchableOpacity style={styles.buttonTouchable}>
      //       <Text style={styles.buttonText}>Scanning ...</Text>
      //     </TouchableOpacity>
      //   }
      // />
    );
  }
}

export default ScanScreen;

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    // color: 'rgb(0,122,255)',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    lineHeight: 22,
  },
  buttonTouchable: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    borderRadius: 5,
    // width: '20%',
    marginBottom: 100,
    height: 50,
    // textAlign: 'center',
    // lineHeight: 125
  },
});
