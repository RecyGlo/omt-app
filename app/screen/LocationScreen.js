import React, {Fragment} from 'react';
import {
  View,
  TextInput,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';

class LocationScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    let params = this.props.route.params;
    let latitude = params.latitude ? params.latitude : 16.9239;
    let longitude = params.longitude ? params.longitude : 96.2270;
    this.state = {
      latitude: latitude,
      longitude: longitude,
    }
  }

  isFloat = (n) =>{
    return Number(n) === n && n % 1 !== 0;
  }

  set_location = () => {
    if(!this.isFloat(parseFloat(this.state.latitude)) || !this.isFloat(parseFloat(this.state.longitude))){
      Alert.alert('Please add a correct coordinate.');
    } else {
      const currentRegion = this.state;
      this.props.navigation.navigate('EditProfile', { currentRegion });
    }
    
  }

  render() {
    return (
      <Fragment>
        <StatusBar backgroundColor={'#f09839'} />
        <View style={{margin: 30}}>
          <TextInput
            style={{
              color: '#222',
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: '#9E9E9E',
              borderRadius: 5,
              marginBottom: 10,
              minHeight: 45,
            }}
            keyboardType="decimal-pad"
            placeholder={'Lattitude'}
            onChangeText={(input) => {
              this.setState({latitude: input});
            }}
          />
          <TextInput
            style={{
              color: '#222',
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: '#9E9E9E',
              borderRadius: 5,
              marginBottom: 10,
              minHeight: 45,
            }}
            keyboardType="decimal-pad"
            placeholder={'Longitude'}
            onChangeText={(input) => {
              this.setState({longitude: input});
            }}
          />
            <TouchableOpacity style={styles.fabBtn} onPress={this.set_location}>
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Set Location</Text>
            </TouchableOpacity>
        </View>
      </Fragment>
    );
  }
}


export default LocationScreen;

let styles = StyleSheet.create({
  fabBtn: {
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F09839',
    elevation: 3
}
});
