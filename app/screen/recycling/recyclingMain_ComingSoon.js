import React, {Fragment} from 'react';
import {
  View,
  Image,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
// import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import StoreIcon from 'react-native-vector-icons/Fontisto';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const windowWidth = Dimensions.get('window').width;

class Recycling extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      display_profile: false,
      app_walkthrough: false,
    };
  }

  render() {
    return (
      <Fragment>
        <StatusBar backgroundColor={'#f09839'} />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            height: 50,
            backgroundColor: '#f09839',
          }}>
          <Text
            style={{
              flex: 1,
              color: '#ffffff',
              fontSize: 20,
              lineHeight: 50,
              fontWeight: '700',
            }}>
            Oh My Trash
          </Text>
          <MaterialIcon
            onPress={() => this.props.navigation.navigate('ScanScreen')}
            name="qr-code-scanner"
            color="#ffffff"
            size={40}
            style={{
              flex: 1,
              alignContent: 'flex-end',
              lineHeight: 50,
              textAlign: 'right',
            }}
          />
        </View>
        <View style={{flex: 1, backgroundColor: '#f09839'}}>
          {Platform.OS === 'ios' ? (
            <View
              style={{
                height: 180,
                backgroundColor: '#f09839',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <View style={{width: 120, height: 120, elevation: 10}}>
                <Image
                  source={require('../../asset/image/oh_my_trash.png')}
                  style={{width: 120, height: 120}}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                }}>
                Oh My Trash
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: 10,
                backgroundColor: '#f09839',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                zIndex: 0,
              }}>
              {/* <View
                style={{
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 22, color: '#ffffff'}}>Thet Mg Mg Toe</Text>
                <Text style={{fontSize: 18, color: '#ffffff'}}>0.50 points</Text>
              </View>
              <View
              style={{
                height: 100,
                paddingLeft: 30,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
                <Ionicon onPress={() => this.props.navigation.navigate('ScanScreen')} name="scan-circle" color='#ffffff' size={80} />
              </View> */}
            </View>
          )}
          <TouchableOpacity
            style={{
              height: 180,
              width: windowWidth - 40,
              margin: 20,
              borderRadius: 20,
              shadowColor: 'white',
              elevation: 10,
              justifyContent: 'center',
              // zIndex:999,
              // background color must be set
              backgroundColor: '#ffffff',
            }}
            // onPress={() => this.props.navigation.navigate('WalletScreen')}
            >
            <>
              <Text style={{
                textAlign: 'center',
                fontSize: 30,
                color: '#f09839',
                fontWeight: '700',
              }}>Coming Soon</Text>
            </>
          </TouchableOpacity>
          {/* <Image
            source={require('../../asset/image/omt_card.png')}
            style={{
              height: 180,
              width: windowWidth - 20,
              margin: 10,
              borderRadius: 20,
              // flex: 1,
            }}
          /> */}
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
            <View style={{flexDirection: 'row', height: 100}}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <AntDesignIcon
                  // onPress={() =>
                  //   this.props.navigation.navigate('ReverseVending')
                  // }
                  name="appstore1"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>
                  Something New
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <StoreIcon
                  name="shopping-store"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                  onPress={() => this.props.navigation.navigate('MarketPlace')}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>Market Place</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <FontAwesomeIcon
                  name="recycle"
                  color="#f09839"
                  size={30}
                  onPress={() => this.props.navigation.navigate('Item')}
                  // style={{ width: 50, height: 50}}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>
                  Recycle Items
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', height: 100}}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <FontAwesome5Icon
                  name="map-marked-alt"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                  onPress={() => this.props.navigation.navigate('JunkShop')}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>Junk Shops</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Ionicon
                  name="newspaper"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                  onPress={() => this.props.navigation.navigate('News')}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>News</Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <MaterialIcon
                  name="settings"
                  color="#f09839"
                  size={30}
                  // style={{ width: 50, height: 50}}
                  onPress={() => this.props.navigation.navigate('Setting')}
                />
                <Text style={{fontSize: 12, lineHeight: 30}}>Settings</Text>
              </View>
            </View>
            {/* <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                margin: 5,
                borderBottomColor: '#e2e2e2',
                borderBottomWidth: 1,
                padding: 10,
              }}
              onPress={() => this.setState({display_profile: true})}>
              <FontAwesomeIcon
                name="history"
                color="#f09839"
                size={20}
                style={{flex: 1}}
              />
              <Text style={{flex: 5, fontSize: 15}}>Point History</Text>
              <ArrowRightIcon
                name="right"
                color="#555"
                size={20}
                style={{flex: 1, textAlign: 'right'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                margin: 5,
                borderBottomColor: '#e2e2e2',
                borderBottomWidth: 1,
                padding: 10,
              }}
              onPress={() => this.edit_profile(user)}>
              <FontAwesome5Icon
                name="coins"
                color="#f09839"
                size={20}
                style={{flex: 1}}
              />
              <Text style={{flex: 5, fontSize: 15}}>Use your points</Text>
              <ArrowRightIcon
                name="right"
                color="#555"
                size={20}
                style={{flex: 1, textAlign: 'right'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                margin: 5,
                borderBottomColor: '#e2e2e2',
                borderBottomWidth: 1,
                padding: 10,
              }}
              onPress={() => this.props.navigation.navigate('Notification')}>
              <FontAwesome5Icon
                name="user-friends"
                color="#f09839"
                size={20}
                style={{flex: 1}}
              />
              <Text style={{flex: 5, fontSize: 15}}>Invite friends</Text>
              <ArrowRightIcon
                name="right"
                color="#555"
                size={20}
                style={{flex: 1, textAlign: 'right'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                height: 50,
                margin: 5,
                borderBottomColor: '#e2e2e2',
                borderBottomWidth: 1,
                padding: 10,
              }}
              onPress={() => Linking.openURL('https://bit.ly/2VWYKSc')}>
              <Ionicon
                name="information-circle"
                color="#f09839"
                size={20}
                style={{flex: 1}}
              />
              <Text style={{flex: 5, fontSize: 15}}>How it works?</Text>
              <ArrowRightIcon
                name="right"
                color="#555"
                size={20}
                style={{flex: 1, textAlign: 'right'}}
              />
            </TouchableOpacity> */}
          </ScrollView>
        </View>
      </Fragment>
    );
  }
}

export default Recycling;

let styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
