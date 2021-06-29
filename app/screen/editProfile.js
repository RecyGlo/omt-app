import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import MapView, {Marker} from 'react-native-maps';
import EditIcon from 'react-native-vector-icons/MaterialIcons';
import AddPhotoIcon from 'react-native-vector-icons/MaterialIcons';
import MapMarkerIcon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  StatusBar,
  StyleSheet,
  BackHandler,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import ImageViewer from 'react-native-image-zoom-viewer';
import DeleteIcon from 'react-native-vector-icons/Feather';
import CountryPicker from 'react-native-country-picker-modal';
import auth from '@react-native-firebase/auth';
import {edit_profile} from '../redux/actions/userAction';

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

const brandColor = '#f09839';

class EditProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    let {user} = this.props.route.params.user;

    this.state = {
      profile_image: user.profileImage,
      image_selected: user.profileImage ? true : false,
      image_modal_visibility: false,
      new_password_changed: false,
      new_phone_number_changed: false,
      image: [],
      input_username: user.name,
      input_password: null,
      input_confirm_password: null,
      input_phone_number: user.phoneNumber,
      input_address: user.location ? user.location.address : null,
      input_latitude: user.location
        ? user.location.coordinate
          ? user.location.coordinate.lat
          : null
        : null,
      input_longitude: user.location
        ? user.location.coordinate
          ? user.location.coordinate.lng
          : null
        : null,
      input_email: user.email,
      new_image_selected: false,
      update_button_loading: false,
      phone_number_update_click: false,
      enter_code: false,
      spinner: false,
      country: {
        cca2: 'MM',
        callingCode: '95',
      },
      phone: '',
      confirm_result: null,
      verification_code: '',
      //currentRegion: props.navigation.state.params ? this.props.navigation.state.params.currentRegion : null
    };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.route.params.currentRegion) {
      const location = this.props.route.params.currentRegion;
      console.log('Location');
      console.log(location);
      this.setState({
        input_latitude: parseFloat(location.latitude),
        input_longitude: parseFloat(location.longitude),
      });
    }
  }

  phone_number_update = () => {
    this.setState((state) => {
      return {
        phone_number_update_click: !state.phone_number_update_click,
      };
    });
  };

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  onImagePick = async (type) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        const options = {
          title: 'Select Profile Image',
          saveToPhotos: false,
          includeBase64: true,
          maxWidth: 500,
          maxHeight: 500,
          mediaType: 'photo',
        };

        if (type == 'camera') {
            launchCamera(options, (response) => {
                console.log(response);
                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.error) {
                  alert(response.error);
                } else {
                  console.log(response);
                  this.setState({
                    profile_image: response,
                    image: [...this.state.image, response],
                    image_selected: true,
                    new_image_selected: true,
                  });
                }
            });
        } else {
            launchImageLibrary(options, (response) => {
                console.log(response);
                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.error) {
                  alert(response.error);
                } else {
                  console.log(response);
                  this.setState({
                    profile_image: response,
                    image: [...this.state.image, response],
                    image_selected: true,
                    new_image_selected: true,
                  });
                }
            });
        }
        
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  pin_location = (input_latitude, input_longitude) => {
    this.props.navigation.navigate('PinNewLocation', {
      latitude: input_latitude,
      longitude: input_longitude,
    });
  };

  add_lat_lng = (input_latitude, input_longitude) => {
    this.props.navigation.navigate('LocationScreen', {
      latitude: input_latitude,
      longitude: input_longitude,
    });
  };

  _toggleModal = () => {
    this.setState((state) => {
      return {
        image_modal_visibility: !state.image_modal_visibility,
      };
    });
  };

  toggle_password_change = () => {
    this.setState((state) => {
      return {
        new_password_changed: !state.new_password_changed,
      };
    });
  };

  handle_send_code = () => {
    // Request to send OTP
    const {country, phone} = this.state;
    let phone_number = '+' + country.callingCode + phone;
    this.setState({spinner: true});
    auth()
      .signInWithPhoneNumber(phone_number)
      .then((confirm_result) => {
        this.setState({confirm_result});
        // console.log(confirm_result);
        this.setState({
          spinner: false,
          enter_code: true,
          input_phone_number: phone_number,
        });
        Alert.alert('Sent!', "We've sent you a verification code", [
          {
            text: 'OK',
          },
        ]);
      })
      .catch((error) => {
        this.setState({spinner: false});
        alert(error.message);
        console.log(error);
      });
  };

  handle_verify_code = () => {
    // Request for OTP verification
    const {confirm_result, verification_code} = this.state;
    console.log(verification_code);
    if (verification_code.length === MAX_LENGTH_CODE) {
      this.setState({spinner: true});
      confirm_result
        .confirm(verification_code)
        .then((user) => {
          console.log(user);
          // this.setState({ userId: user.uid })
          // alert(`Verified! ${user.uid}`)
          this.setState({
            spinner: false,
            phone_number_update_click: false,
            new_phone_number_changed: true,
          });
          Alert.alert(
            'Success!',
            'You have successfully verified your phone number.',
          );
        })
        .catch((error) => {
          if (
            error.message ===
            '[auth/session-expired] The sms code has expired. Please re-send the verification code to try again.'
          ) {
            this.setState({
              spinner: false,
              phone_number_update_click: false,
              new_phone_number_changed: true,
            });
            Alert.alert(
              'Success!',
              'You have successfully verified your phone number.',
            );
          } else {
            this.setState({spinner: false});
            alert(error.message);
          }
          console.log(error);
        });
    } else {
      alert('Please enter a 6 digit OTP code.');
    }
  };

  enter_phone_or_code = (val) => {
    if (!this.state.enter_code) {
      this.setState({phone: val});
      return;
    } else {
      this.setState({verification_code: val});
    }
  };

  submit_phone_verification = () => {
    this.state.enter_code ? this.handle_verify_code() : this.handle_send_code();
  };

  change_country = (country) => {
    this.setState({country: country});
  };

  render_footer = () => {
    if (this.state.enter_code)
      return (
        <View>
          <Text
            style={{margin: 10, fontSize: 14, textAlign: 'center'}}
            onPress={() => this.setState({enter_code: false})}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={{marginTop: 30, fontSize: 12, color: 'grey'}}>
          By tapping "Send confirmation code" above, we will send you an SMS to
          confirm your phone number. Message &amp; data rates may apply.
        </Text>
      </View>
    );
  };

  render_country_picker = () => {
    if (this.state.enter_code) return <View />;

    return (
      <CountryPicker
        style={styles.countryPicker}
        onSelect={this.change_country}
        countryCode={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        withFilter
      />
    );
  };

  render_calling_code = () => {
    if (this.state.enter_code) return <View />;

    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            color: brandColor,
            fontFamily: 'Helvetica',
            fontWeight: 'bold',
            paddingRight: 10,
          }}>
          +{this.state.country.callingCode}
        </Text>
      </View>
    );
  };

  render() {
    const {
      new_password_changed,
      update_button_loading,
      image_selected,
      new_image_selected,
      profile_image,
      image,
      input_username,
      input_phone_number,
      input_password,
      input_confirm_password,
      input_address,
      input_email,
      input_latitude,
      input_longitude,
    } = this.state;

    let headerText = `What's your ${
      this.state.enter_code ? 'verification code' : 'phone number'
    }?`;
    let buttonText = this.state.enter_code
      ? 'Verify confirmation code'
      : 'Send confirmation code';
    let textStyle = this.state.enter_code
      ? {
          height: 50,
          textAlign: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          fontFamily: 'Courier',
        }
      : {};

    const images = [];
    if (new_image_selected) {
      const {image} = this.state;
      image.map((img) => images.push({url: img.uri}));
    } else {
      images.push({url: profile_image});
    }

    return (
      <Fragment>
        <StatusBar backgroundColor={'#f09839'} />
        {this.state.phone_number_update_click ? (
          <View style={{flex: 1, margin: 20}}>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 60,
                fontSize: 22,
                margin: 20,
                color: '#4A4A4A',
              }}>
              {headerText}
            </Text>

            <View style={{flexDirection: 'row'}}>
              {this.render_country_picker()}
              {this.render_calling_code()}

              <TextInput
                name={this.state.enter_code ? 'code' : 'phoneNumber'}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={this.enter_phone_or_code}
                placeholder={
                  this.state.enter_code ? '_ _ _ _ _ _' : 'Phone Number'
                }
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                style={[
                  {padding: 0, margin: 0, flex: 1, fontSize: 20},
                  textStyle,
                ]}
                returnKeyType="go"
                autoFocus
                // placeholderTextColor={brandColor}
                // selectionColor={brandColor}
                maxLength={this.state.enter_code ? 6 : 20}
                onSubmitEditing={this.submit_phone_verification}
              />
            </View>

            <TouchableOpacity
              style={{
                marginTop: 30,
                height: 50,
                backgroundColor: brandColor,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}
              onPress={this.submit_phone_verification}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Helvetica',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {buttonText}
              </Text>
            </TouchableOpacity>

            {this.render_footer()}

            {this.state.spinner && (
              <ActivityIndicator
                size="large"
                color="#f09839"
                style={{height: 45, marginVertical: 16}}></ActivityIndicator>
            )}
          </View>
        ) : (
          <View style={{padding: 10}}>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                {this.state.image_selected ? (
                  this.state.new_image_selected ? (
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({image_modal_visibility: true})
                        }>
                        <Image
                          source={{uri: profile_image.uri}}
                          style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'cover',
                            borderWidth: 1,
                            borderColor: '#222',
                            borderRadius: 5,
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            profile_image: {},
                            image: [],
                            image_selected: false,
                          })
                        }
                        style={{
                          position: 'absolute',
                          right: 1,
                          top: 1,
                          zIndex: 2,
                        }}>
                        <DeleteIcon
                          name="delete"
                          style={{color: 'red', fontSize: 30}}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({image_modal_visibility: true})
                        }>
                        <Image
                          source={{uri: profile_image}}
                          style={{
                            width: 100,
                            height: 100,
                            resizeMode: 'cover',
                            borderWidth: 1,
                            borderColor: '#222',
                            borderRadius: 5,
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            profile_image: {},
                            image_selected: false,
                          })
                        }
                        style={{
                          position: 'absolute',
                          right: 1,
                          top: 1,
                          zIndex: 2,
                        }}>
                        <DeleteIcon
                          name="delete"
                          style={{color: 'red', fontSize: 30}}
                        />
                      </TouchableOpacity>
                    </View>
                  )
                ) : (
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderColor: '#222222',
                      borderWidth: 1,
                      borderRadius: 7,
                      width: 100,
                      height: 100,
                    }}
                    onPress={() => this._menu.show()}>
                    <AddPhotoIcon
                      name="add-a-photo"
                      size={60}
                      color={'#f09839'}></AddPhotoIcon>
                    <Text
                      style={{
                        color: '#222222',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}>
                      Pick Photo
                    </Text>
                    <Menu
                      ref={(ref) => {
                        this._menu = ref;
                      }}>
                      <MenuItem
                        onPress={() => this.onImagePick('camera')}>
                        {' '}
                        Take Photo
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        onPress={() => this.onImagePick('library')}>
                        {' '}
                        Choose From Library
                      </MenuItem>
                    </Menu>
                  </TouchableOpacity>
                )}

                <View
                  style={{flexDirection: 'column', marginLeft: 20, flex: 1}}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#f09839',
                    }}>
                    Name
                  </Text>
                  <TextInput
                    style={{
                      color: '#222',
                      borderBottomWidth: 1,
                      borderBottomColor: '#222222',
                      minHeight: 45,
                    }}
                    placeholder={'Username'}
                    value={input_username}
                    onChangeText={(input) => {
                      this.setState({input_username: input});
                    }}></TextInput>
                </View>
              </View>

              <View style={{flexDirection: 'column', marginBottom: 10}}>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: '#f09839'}}>
                  Phone Number
                </Text>
                <TextInput
                  style={{
                    color: '#222',
                    borderBottomWidth: 1,
                    borderBottomColor: '#222',
                    minHeight: 45,
                  }}
                  placeholder={'Phone Number'}
                  value={input_phone_number}
                  editable={false}></TextInput>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 1,
                    bottom: 1,
                    zIndex: 2,
                  }}
                  onPress={() => this.phone_number_update()}>
                  <EditIcon
                    name="edit"
                    style={{
                      color: 'green',
                      fontSize: 30,
                      padding: 2,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'column', marginBottom: 10}}>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: '#f09839'}}>
                  Password
                </Text>
                <TextInput
                  style={{
                    color: '#222',
                    borderBottomWidth: 1,
                    borderBottomColor: '#222222',
                    minHeight: 45,
                  }}
                  placeholder={'Password'}
                  value={'****'}
                  editable={false}></TextInput>

                {new_password_changed ? (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 1,
                      bottom: 1,
                      zIndex: 2,
                    }}
                    onPress={this.toggle_password_change}>
                    <DeleteIcon
                      name="delete"
                      style={{
                        color: 'red',
                        fontSize: 30,
                        padding: 2,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 1,
                      bottom: 1,
                      zIndex: 2,
                    }}
                    onPress={this.toggle_password_change}>
                    <EditIcon
                      name="edit"
                      style={{
                        color: 'green',
                        fontSize: 30,
                        padding: 2,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {new_password_changed && (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#222',
                    marginBottom: 5,
                  }}>
                  <View style={{flexDirection: 'column', margin: 5}}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: '#f09839',
                      }}>
                      New Password
                    </Text>
                    <TextInput
                      style={{
                        color: '#222',
                        borderBottomWidth: 1,
                        borderBottomColor: '#222',
                        minHeight: 45,
                      }}
                      placeholder={'New  Password'}
                      secureTextEntry={true}
                      value={input_password}
                      onChangeText={(input) => {
                        this.setState({input_password: input});
                      }}></TextInput>
                  </View>
                  <View style={{flexDirection: 'column', margin: 5}}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        color: '#f09839',
                      }}>
                      Confirm Password
                    </Text>
                    <TextInput
                      style={{
                        color: '#222',
                        borderBottomWidth: 1,
                        borderBottomColor: '#222',
                        minHeight: 45,
                      }}
                      placeholder={'Confrim Password'}
                      secureTextEntry={true}
                      value={input_confirm_password}
                      onChangeText={(input) => {
                        this.setState({input_confirm_password: input});
                      }}></TextInput>
                  </View>
                </View>
              )}

              <View style={{flexDirection: 'column', marginBottom: 10}}>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: '#f09839'}}>
                  Email
                </Text>
                <TextInput
                  style={{
                    color: '#222',
                    borderBottomWidth: 1,
                    borderBottomColor: '#222222',
                    minHeight: 45,
                  }}
                  placeholder={'Email'}
                  value={input_email}
                  onChangeText={(input) => {
                    this.setState({input_email: input});
                  }}></TextInput>
              </View>

              <View style={{flexDirection: 'column', marginBottom: 10}}>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: '#f09839'}}>
                  Address
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#222222',
                    minHeight: 45,
                  }}
                  multiline={true}
                  placeholder={'Address'}
                  value={input_address}
                  onChangeText={(input) => {
                    this.setState({input_address: input});
                  }}></TextInput>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#222',
                  flexDirection: 'column',
                  marginBottom: 10,
                }}>
                {input_latitude ? (
                  <MapView
                    // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      width: '100%',
                      height: 150,
                    }}
                    region={{
                      latitude: input_latitude,
                      longitude: input_longitude,
                      latitudeDelta: 0.00115,
                      longitudeDelta: 0.00121,
                    }}>
                    <Marker
                      draggable={true}
                      coordinate={{
                        latitude: input_latitude,
                        longitude: input_longitude,
                      }}>
                      <MapMarkerIcon name="map-pin" color="black" size={40} />
                    </Marker>
                  </MapView>
                ) : (
                  <View style={{width: '100%', height: 150}}>
                    <Text>No location is added!</Text>
                  </View>
                )}

                {/* <TouchableOpacity
                  style={{
                    backgroundColor: '#f09839',
                    position: 'absolute',
                    right: 1,
                    bottom: 1,
                    zIndex: 2,
                    shadowColor: '#FFF',
                  }}
                  onPress={() =>
                    this.pin_location(input_latitude, input_longitude)
                  }>
                  <EditIcon
                    name="edit"
                    style={{color: '#FFF', fontSize: 30, padding: 2}}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f09839',
                    position: 'absolute',
                    right: 1,
                    bottom: 1,
                    zIndex: 2,
                    shadowColor: '#FFF',
                  }}
                  onPress={() => this._menu.show()} >
                    <Menu
                        ref={ref => { this._location_menu = ref }}
                        button={<EditIcon
                          name="edit"
                          style={{color: '#FFF', fontSize: 30, padding: 2}}
                          onPress={() => this._location_menu.show()}
                        />}
                    >
                        <MenuItem onPress={() => { this._location_menu.hide(); this.pin_location(input_latitude, input_longitude) }}>Choose Location on Map</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={() => { this._location_menu.hide(); this.add_lat_lng(input_latitude, input_longitude) }}>Set coordinate</MenuItem>
                        <MenuDivider />
                    </Menu>
                </TouchableOpacity>
              </View>

              {update_button_loading ? (
                <ActivityIndicator
                  size="large"
                  color="#F09839"
                  style={{height: 45, marginVertical: 16}}></ActivityIndicator>
              ) : (
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => this.update_profile()}>
                  <View>
                    <Text
                      style={{color: '#FFF', fontSize: 15, fontWeight: '700'}}>
                      Update
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
        <Modal
          visible={this.state.image_modal_visibility}
          transparent={true}
          onRequestClose={this._toggleModal}>
          <ImageViewer imageUrls={images} enableSwipeDown={true} />
        </Modal>
      </Fragment>
    );
  }

  async update_profile() {
    let {
      new_image_selected,
      image_selected,
      profile_image,
      input_username,
      input_phone_number,
      input_password,
      input_confirm_password,
      input_email,
      input_address,
      input_latitude,
      input_longitude,
      new_password_changed,
      new_phone_number_changed,
    } = this.state;
    if (input_username) {
      if (new_password_changed) {
        if (input_password != input_confirm_password) {
          alert('New Password do not match!');
          return;
        }
      }

      // this.setState({ update_button_loading: true })

      // const location = {
      //     "address": input_address,
      //     "coordinate": {
      //         "lat": Number(input_latitude),
      //         "lng": Number(input_longitude),
      //     }
      // };

      let data = new FormData();
      data.append('name', input_username);
      if (new_image_selected) {
        data.append('profileImage', {
          uri: profile_image.uri,
          type: profile_image.type,
          name: 'image.' + profile_image.type.split('/')[1],
        });
      } else {
        data.append('profileImage', null);
      }
      if (new_phone_number_changed) {
        data.append('phoneNumber', input_phone_number);
      }
      if (new_password_changed) {
        data.append('password', input_password);
      }
      if (input_email) {
        data.append('email', input_email);
      }
      let location;
      if (input_address) {
        location = {
          address: input_address,
        };
      }
      if (input_latitude) {
        location = {
          coordinate: {
            lat: Number(input_latitude),
            lng: Number(input_longitude),
          },
        };
      }
      if (input_address && input_latitude) {
        location = {
          address: input_address,
          coordinate: {
            lat: Number(input_latitude),
            lng: Number(input_longitude),
          },
        };
      }
      if (location) {
        data.append('location', JSON.stringify(location));
      }
      this.props.edit_profile(this.props.user._id, data, () =>
        this.props.navigation.goBack(),
      );
    } else {
      alert('Enter Username.');
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  edit_profile: (user_id, data, callback) => {
    dispatch(edit_profile(user_id, data, callback));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

let styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  txtInput: {
    paddingHorizontal: 10,
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222222',
    borderRadius: 3,
    marginBottom: 10,
    // backgroundColor: 'rgba(25, 30, 31,0.5)',
  },
  iconStyle: {
    fontSize: 25,
    marginLeft: 25,
    color: '#ffffff',
  },
  circleIcon: {
    fontSize: 25,
    color: '#FFEB3B',
  },
  image: {
    resizeMode: 'cover',
    marginBottom: 10,
    width: 200,
    height: 200,
    borderRadius: 250,
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: 22,
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1,
    marginTop: 15,
  },
  loginBtn: {
    height: 45,
    backgroundColor: '#f09839',
    borderRadius: 5,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTxt: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFEB3B',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  button: {
    marginHorizontal: 14,
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imgBackground: {
    flex: 1,
    width: null,
    height: null,
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  modalBtnStyle: {
    backgroundColor: '#191e1f',
    borderRadius: 0,
    height: 60,
  },
});
