'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
// import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ArrowRightIcon from 'react-native-vector-icons/AntDesign';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreIcon from 'react-native-vector-icons/Fontisto';

class ReverseVendingScreen extends Component {
  render() {
    return (
      <View style={{backgroundColor: '#f09839', flex: 1}}>
        {/* Recycle Now For Great Reward */}
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={require('../../asset/image/rvm_icon.png')}
              style={{
                // flex: 1,
                width: 100,
                height: 100,
              }}
            />
          </View>

          <View style={{flex: 2}}>
            <Text style={{fontWeight: '700', fontSize: 20, color: '#ffffff'}}>
              Smart Reverse Vending
            </Text>
            <Text
              style={{marginTop: 5, color: '#ffffff', textAlign: 'justify'}}>
              Collects empty beverage containers at the source with a
              pre-established reward system.
            </Text>
          </View>
        </View>
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              backgroundColor: '#FFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              marginTop: 20,
            }}>
            {/* <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <MaterialCommunityIcon
                  onPress={() =>
                    this.props.navigation.navigate('ReverseVending')
                  }
                  name="slot-machine"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>
                  Nearby RVMs
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <MaterialIcon
                  name="qr-code-scanner"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                  onPress={() => this.props.navigation.navigate('MarketPlace')}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>Scan QR Code</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <MaterialCommunityIcon
                  name="information"
                  color="#f09839"
                  size={30}
                  onPress={() => this.props.navigation.navigate('Item')}
                  // style={{ width: 50, height: 50}}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>
                  More Info
                </Text>
              </View>
            </View> */}
            <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              zIndex: 2,
              // elevation: 5,
              backgroundColor: '#ffffff',
              borderRadius: 20,
              // marginVertical: 20,
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../asset/image/1.png')}
                style={{
                  // flex: 1,
                  width: 50,
                  height: 50,
                }}
              />
            </View>

            <View style={{flex: 3}}>
              <Text style={{color: '#333333', textAlign: 'justify'}}>
                Scan QR code from a Reverse Vending Machine Thourght the QR Code Scanner within this app.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              zIndex: 2,
              // elevation: 5,
              backgroundColor: '#ffffff',
              borderRadius: 20,
              // marginVertical: 20,
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../asset/image/2.png')}
                style={{
                  // flex: 1,
                  width: 50,
                  height: 50,
                }}
              />
            </View>

            <View style={{flex: 3}}>
              <Text style={{color: '#333333', textAlign: 'justify'}}>
                Enter empty plastic bottles through the port on the machine.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              zIndex: 2,
              // elevation: 5,
              backgroundColor: '#ffffff',
              borderRadius: 20,
              // marginVertical: 20,
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require('../../asset/image/3.png')}
                style={{
                  // flex: 1,
                  width: 50,
                  height: 50,
                }}
              />
            </View>

            <View style={{flex: 3}}>
              <Text style={{color: '#333333', textAlign: 'justify'}}>
                Retrieve reward points after recycling the bottles. Enjoy yor rewards on the services.
              </Text>
            </View>
          </View>
          </ScrollView>
        {/* <View
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: '#FFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            marginTop: 20,
          }}>
        </View> */}
      </View>
    );
  }
}

export default ReverseVendingScreen;

const styles = StyleSheet.create({});
