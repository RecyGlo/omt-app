import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { get_wallet_by_userid } from '../../redux/actions/walletAction';
// import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import ArrowRightIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class WalletScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    this.props.get_wallet_by_userid(this.props.user._id);
  }

  render() {
    const { wallet } = this.props;
    return (
      <View style={{backgroundColor: '#f09839', flex: 1}}>
        <StatusBar backgroundColor={'#f09839'} />
        {/* <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            height: 50,
            backgroundColor: '#f09839',
          }}>
        </View> */}

        {/* <Text
          style={{
            color: '#ffffff',
            fontSize: 20,
            lineHeight: 50,
            fontWeight: '700',
            paddingHorizontal: 20,
          }}>
          Wallet
        </Text> */}
        {/* <Text style={{ height: 50, lineHeight: 50, textAlign: 'left', fontSize: 20}}>Wallet</Text> */}
        <Text
          style={{
            height: 50,
            lineHeight: 50,
            textAlign: 'center',
            fontSize: 30,
            color: '#ffffff',
            fontWeight: '700',
            marginVertical: 20,
            marginBottom: 40,
          }}>
          {wallet ? wallet.balance.toString() : 0} Kyats
        </Text>
        {/* <TouchableHighlight style={{
          backgroundColor: '#ffffff',
          marginHorizontal: 30,
          padding: 15,
          borderRadius: 10,
          marginVertical: 20,
        }}>
          <Text style={{ textAlign: 'center', fontSize: 18, color: '#f09839', fontWeight: '700' }}>PAY</Text>
        </TouchableHighlight> */}

        <TouchableHighlight
          style={{
            backgroundColor: '#ffffff',
            marginHorizontal: 30,
            padding: 15,
            borderRadius: 10,
            marginTop: 80,
            zIndex: 1,
            alignSelf: 'center',
            position: 'absolute',
            elevation: 4,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="payments"
              color="#f09839"
              size={20}
              style={{
                marginRight: 10,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 13,
                color: '#333333',
                fontWeight: '500',
                alignItems: 'center',
              }}
              onPress={() => Alert.alert('Wallet Payment', 'Coming Soon...')}>
              Pay with your digital wallet
            </Text>
          </View>
        </TouchableHighlight>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}>
          <Text
            style={{
              flex: 1,
              color: '#333333',
              fontSize: 20,
              lineHeight: 50,
              fontWeight: '700',
            }}>
            Transactions
          </Text>
          {(wallet.transactions && JSON.stringify(wallet.transactions) !== '[]') && <Text>{JSON.stringify(wallet.transactions)}</Text>}
          {(wallet.transactions && JSON.stringify(wallet.transactions) !== '[]') ?
          <>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: 50,
              margin: 5,
              borderBottomColor: '#e2e2e2',
              borderBottomWidth: 1,
              padding: 10,
            }}
            onPress={() => this.setState({display_profile: true})}>
            <FontAwesome5Icon
              name="hand-holding-usd"
              color="#f09839"
              size={20}
              style={{flex: 1}}
            />
            <Text style={{flex: 5, fontSize: 12}}>
              Recycling at Machine #123456
            </Text>
            <Text
              style={{
                flex: 2,
                fontSize: 12,
                textAlign: 'right',
                color: 'green',
              }}>
              + 100.00
            </Text>
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
            onPress={() => this.setState({display_profile: true})}>
            <FontAwesome5Icon
              name="hand-holding-usd"
              color="#f09839"
              size={20}
              style={{flex: 1}}
            />
            <Text style={{flex: 5, fontSize: 12}}>Pay at MM Bus Ticket</Text>
            <Text
              style={{flex: 2, fontSize: 12, textAlign: 'right', color: 'red'}}>
              - 50.00
            </Text>
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
            onPress={() => this.setState({display_profile: true})}>
            <FontAwesome5Icon
              name="hand-holding-usd"
              color="#f09839"
              size={20}
              style={{flex: 1}}
            />
            <Text style={{flex: 5, fontSize: 12}}>
              Recycling at Machine #123456
            </Text>
            <Text
              style={{
                flex: 2,
                fontSize: 12,
                textAlign: 'right',
                color: 'green',
              }}>
              + 50.00
            </Text>
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
            onPress={() => this.setState({display_profile: true})}>
            <FontAwesome5Icon
              name="hand-holding-usd"
              color="#f09839"
              size={20}
              style={{flex: 1}}
            />
            <Text style={{flex: 5, fontSize: 12}}>
              Recycling at Machine #123456
            </Text>
            <Text
              style={{
                flex: 2,
                fontSize: 12,
                textAlign: 'right',
                color: 'green',
              }}>
              + 25.00
            </Text>
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
            onPress={() => this.setState({display_profile: true})}>
            <FontAwesome5Icon
              name="hand-holding-usd"
              color="#f09839"
              size={20}
              style={{flex: 1}}
            />
            <Text style={{flex: 5, fontSize: 12}}>Pay at 123 service</Text>
            <Text
              style={{flex: 2, fontSize: 12, textAlign: 'right', color: 'red'}}>
              - 100.00
            </Text>
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
            onPress={() => this.setState({display_profile: true})}>
            <FontAwesome5Icon
              name="hand-holding-usd"
              color="#f09839"
              size={20}
              style={{flex: 1}}
            />
            <Text style={{flex: 5, fontSize: 12}}>Registration Reward</Text>
            <Text
              style={{
                flex: 2,
                fontSize: 12,
                textAlign: 'right',
                color: 'green',
              }}>
              + 1000.00
            </Text>
          </TouchableOpacity>
          </>
          : 
          <Text style={{ textAlign: 'center', marginTop: 50}}>No Transaction</Text>
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  wallet: state.wallet.wallet_by_userid,
})

const mapDispatchToProps = dispatch => ({
  get_wallet_by_userid: (user_id) => {
      dispatch(get_wallet_by_userid(user_id));
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);

const styles = StyleSheet.create({});
