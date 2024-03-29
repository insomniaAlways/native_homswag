import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Text, PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import MapView from 'react-native-maps';
import FloatingInput from '../components/input-helpers.js/floatingInput';
import { connect } from 'react-redux';
import { geoCoding } from '../store/actions/locationActions';
import { creatNew, fetchAddress } from '../store/actions/addressActions';
import { KeyboardAvoidingView } from '../components/KeyboardAvoidView'
import { debounce, isNil } from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Label } from 'native-base';
import { brandColor, brandLightBackdroundColor } from '../style/customStyles';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';
import Geolocation from 'react-native-geolocation-service';

const initialRegion = {
  latitude: 12.97194,
  longitude: 77.59369,
  latitudeDelta: 0.0022,
  longitudeDelta: 0.0001,
}

const locationValueObject = {
  formatedAddress: '',
  coordinate: {},
  place_id: '',
  localAddress: '',
  landmark: '',
}

function AddressScreen(props) {
  const [ coordinates, setCoodinates ] = useState(initialRegion)
  const { locationModel, addNewAddress, getfetchAddress, navigation, networkAvailability, getGeoCoding } = props
  const [ isCurrentLoactionLoaded, setCoodinatesLoaded ] = useState(false)
  const [ locationValue, setLocationValue ] = useState(locationValueObject)
  const [ isLoading, setLoading ] = useState(false)

  const setGeocoding = ({formatedAddress, coordinate}) => {
    setLocationValue({...locationValue, formatedAddress: formatedAddress, coordinate: coordinate})
    setLoading(false)
  }

  const onRegionChange = (latitude, longitude) => {
    setCoodinatesLoaded(false)
    setCoodinates({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0001,
      longitudeDelta: 0.001,
    })
    saveData(latitude, longitude)
  }
  
  const saveData = async (latitude, longitude) => {
    try {
      if(networkAvailability.offline) {
        setLoading(false)
        ShowAlert('Oops!', 'Seems like you are not connected to Internet')
      } else {
        getGeoCoding(latitude, longitude)
      }
    } catch(e) {
      if(e && e.message) {
        ShowAlert('Oops!', e.message)
      } else {
        ShowAlert('Oops!', e)
      }
      Sentry.captureException(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    if(!locationModel.isLoading && !locationModel.error && Object.keys(locationModel.values).length) {
      setGeocoding({
        formatedAddress: locationModel.values.formatedAddress,
        coordinate: { latitude: locationModel.values.coordinate.latitude, longitude: locationModel.values.coordinate.longitude },
      })
      setCoodinatesLoaded(true)
      setLoading(false)
    } else if(!locationModel.isLoading && locationModel.error) {
      if(locationModel.error && locationModel.error.message) {
        ShowAlert('Oops!', locationModel.error.message)
      } else {
        ShowAlert('Oops!', locationModel.error)
      }
      Sentry.captureException(locationModel.error)
    }
  }, [locationModel])

  const debounceCall = debounce(onRegionChange, 1000);

  const onError = (text) => {
    setLoading(false)
    let message = text || "We need location service permission to fetch your current location"
    ShowAlert('Permission Required', message)
    Sentry.captureEvent(text)
  }

  const hasLocationPermissionIOS = async () => {
    try {
      const openSetting = () => {
        Linking.openSettings().catch(() => {
          ShowAlert('Unable to open settings');
        });
      };
      const status = await Geolocation.requestAuthorization('whenInUse');
  
      if (status === 'granted') {
        return true;
      }
  
      if (status === 'denied') {
        onError();
      }
  
      if (status === 'disabled') {
        Alert.alert(
          `Turn on Location Services to allow "Homeswag" to determine your location.`,
          '',
          [
            { text: 'Go to Settings', onPress: openSetting },
            { text: "Don't Use Location", onPress: onError },
          ],
        );
      }
  
      return false;
    } catch (err) {
      if(err && err.message) {
        ShowAlert('Oops!', err.message)
      } else {
        ShowAlert('Oops!', err)
      }
      Sentry.captureException(err)
      return false
    }
  };

  const hasLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const hasPermission = await hasLocationPermissionIOS();
        return hasPermission;
      }
  
      if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
      }
  
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
  
      if (hasPermission) {
        return true;
      }
  
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
  
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
  
      if (status === PermissionsAndroid.RESULTS.DENIED) {
        onError('Location permission denied by user.')
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        onError('Location permission revoked by user.')
      }
  
      return false;
    } catch (err) {
      if(err && err.message) {
        ShowAlert('Oops!', err.message)
      } else {
        ShowAlert('Oops!', err)
      }
      Sentry.captureException(err)
      return false
    }
  };

  const getPemission = async () => {
    try {
      const hasLocationPermission = await hasLocationPermission();
      if(hasLocationPermission) {
        getCurrentPosition()
      }
    } catch (err) {
      if(err && err.message) {
        ShowAlert('Oops!', err.message)
      } else {
        ShowAlert('Oops!', err)
      }
      Sentry.captureException(err)
    }
  }

  const onPositionSuccess = ({latitude, longitude}) => {
    if(!isNil(latitude) && !isNil(longitude)) {
      onRegionChange(latitude, longitude)
    }
  }

  const onPositionError = (error) => {
    setCoodinatesLoaded(true)
    switch (error.code) {
      case 1: {
        return hasLocationPermission()
      }
      case 2: {
        return ShowAlert('Oops!', "Location provider not available")
      }
      case 3: {
        return ShowAlert('Oops!', "We are not able to fetch your current location.")
      }
      case 5: {
        return ShowAlert('Location service is disabled', 'Please turn on your location service.')
      }
      default:
        if(error && error.message) {
          ShowAlert('Oops!', error.message)
        } else {
          ShowAlert('Oops!', error)
        }
    }
  }

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(onPositionSuccess, onPositionError, {enableHighAccuracy: true, showLocationDialog: true})
  }

  useLayoutEffect(() => {
    hasLocationPermission()
  }, [])

  const save = async () => {
    const { formatedAddress, place_id, place_url, coordinate } = locationModel.values
    setLoading(true)
    try {
      await addNewAddress({address: {...locationValue, formatedAddress, place_id, place_url, coordinate}})
      await getfetchAddress()
      setLoading(false)
      navigation.goBack()
    } catch(e) {
      if(e && e.message) {
        ShowAlert('Oops!', e.message)
      } else {
        ShowAlert('Oops!', e)
      }
      setLoading(false)
      Sentry.captureException(e)
    }
  }

  return (
    <KeyboardAvoidingView extraHeight={100} showsVerticalScrollIndicator={false}>
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={isCurrentLoactionLoaded && coordinates && coordinates.latitude ? styles.padding_b : styles.padding_a}>
          <MapView style={{height: 300}}
            initialRegion={coordinates}
            onRegionChangeComplete={({latitude, longitude}) => debounceCall(latitude, longitude)}
            showsUserLocation={true}
            animateCamera={() => ({"center": coordinates})}
            loadingEnabled={true}
            provider={'google'}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={false}
          />
          { coordinates && coordinates.latitude && 
            <View style={{position: 'absolute', top: 115, left: '48%', justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesome name="map-marker" size={40} color="red" />
            </View>
          }
        </View>
        <View style={{flex: 3, paddingLeft: 30, paddingRight: 30, paddingTop: 10, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', borderColor: '#a9d5de', borderRadius: 5, backgroundColor: '#f8ffff', borderWidth: 1, padding: 5}}>
            <Text style={{paddingRight: 8, paddingTop: 8}}><FontAwesome name="info-circle" /></Text>
            <Text style={{color: 'rgba(0,0,0,0.5)', fontSize: 12}}>
              Move Location Markers To Desired Locations To Accurately Point The Address.
            </Text>
          </View>
          {locationModel && locationModel.values && locationModel.values.formatedAddress ? 
            <View style={{paddingTop: 10}}>
              <Text style={{color: 'rgba(0,0,0,0.5)'}}>Location</Text>
              <Text style={{marginTop: 5}}>{locationModel.values.formatedAddress}</Text>
            </View> :
            <View style={{borderBottomWidth: 1, borderColor: '#eee', marginTop: 30}}>
              <Label style={{fontSize: 18, color: 'rgba(0,0,0,0.64)'}}>Location</Label>
            </View>
          }
          <FloatingInput label="House No/Room no" style={{paddingTop: 10}}
            setValue={setLocationValue}
            value={locationValue.localAddress}
            previousState={locationValue}
            itemKey={'localAddress'}
            disabled={false}/>
          <FloatingInput label="Landmark" style={{paddingTop: 10}}
            setValue={setLocationValue}
            value={locationValue.landmark}
            previousState={locationValue}
            itemKey={'landmark'}
            disabled={false}/>
          <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
            {networkAvailability.offline ? 
              <View style={{width: 150, backgroundColor: brandLightBackdroundColor, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 20}}>
                <Text style={{color: '#fff', width: '100%', textAlign: 'center'}}>Not connected to Internet</Text>
              </View> :
              <TouchableOpacity style={{width: 150, backgroundColor: brandColor, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 20}} onPress={() => save()}>
                <Text style={{color: '#fff', width: '100%', textAlign: 'center'}}>Save Address</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        presentationStyle={'overFullScreen'}
        onRequestClose={() => {
          return false;
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.controlContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const mapStateToProps = state => ({
  locationModel : state.location,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  getGeoCoding: (latitude, longitude) => dispatch(geoCoding(latitude, longitude)),
  addNewAddress: (locationValue) => dispatch(creatNew(locationValue)),
  getfetchAddress: () => dispatch(fetchAddress()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddressScreen);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlContainer: {
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#3366FF',
  },

  padding_a: {
    padding: 1
  },
  padding_b: {
    padding: 2
  }
})