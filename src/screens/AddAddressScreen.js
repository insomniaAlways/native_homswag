import React, { useState, useEffect }from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Text, PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps';
import FloatingInput from '../components/input-helpers.js/floatingInput';
import { connect } from 'react-redux';
import { geoCoding, getPlace } from '../store/actions/locationActions';
import { creatNew, fetchAddress } from '../store/actions/addressActions';
import { KeyboardAvoidingView } from '../components/KeyboardAvoidView'
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Label } from 'native-base';
import { Permissions } from 'react-native-unimodules';
import { brandColor, brandLightBackdroundColor } from '../style/customStyles';
import * as Location from 'expo-location';

const initialRegion = {
  latitude: 12.97194,
  longitude: 77.59369,
  latitudeDelta: 0.1422,
  longitudeDelta: 0.0401,
}

const locationValueObject = {
  formatedAddress: '',
  geometry: {},
  place_id: '',
  localAddress: '',
  landmark: '',
}

function AddressScreen(props) {
  const [ coordinates, setCoodinates ] = useState()
  const { location, addNewAddress, getfetchAddress, navigation, networkAvailability, getGeoCoding, getPlaceDetails } = props
  const previousScreen = navigation.getParam('previousRoute')
  const [ isCurrentLoactionLoaded, setCoodinatesLoaded ] = useState(false)
  const [ locationValue, setLocationValue ] = useState(locationValueObject)
  const [ isLoading, setLoading ] = useState(false)

  const setGeocoding = ({formatedAddress, geometry}) => {
    setLocationValue({...locationValue, formatedAddress: formatedAddress, geometry: geometry})
    setLoading(false)
  }

  const onError = () => {
    setLoading(false)
    alert("We need location service permission to fetch your current location")
  }

  const onRegionChange = (latitude, longitude) => {
    setCoodinates({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0101,
    })
    async function saveData() {
      try {
        if(networkAvailability.offline) {
          setLoading(false)
          alert('Seems like you are not connected to Internet')
        } else {
          const locationResponse = await Location.reverseGeocodeAsync({latitude, longitude})
          let formatted_address = `${locationResponse[0].name}, ${locationResponse[0].street}, ${locationResponse[0].city}, ${locationResponse[0].postalCode}, ${locationResponse[0].region}, ${locationResponse[0].country}`
          setGeocoding({
            formatedAddress: formatted_address,
            geometry: { latitude: latitude, longitude: longitude },
          })
          setCoodinatesLoaded(true)
          setLoading(false)
        }
      } catch(e) {
        alert(e, location.error)
        setLoading(false)
      }
    }
    saveData()
  }

  useEffect(() => {
    if(location && location.error) {
      alert(error)
    }
  }, [location.error])

  const debounceCall = _.debounce(onRegionChange, 500);


  async function getPemission() {
    try {
      let { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          onError()
        }
      }
    } catch (e) {
      console.log(e)
      alert(e)
    }
  }

  useEffect(() => {
    if(!isCurrentLoactionLoaded) {
      getPemission()
    }
  }, [])

  const save = async () => {
    setLoading(true)
    try {
      let geoCoding = await getGeoCoding(locationValue.geometry.latitude, locationValue.geometry.longitude)
      await addNewAddress({address: {...locationValue, place_id: geoCoding.place_id, place_url: geoCoding.place_url}})
      await getfetchAddress()
      setLoading(false)
      navigation.goBack()
    } catch(e) {
      alert(e)
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView extraHeight={100} showsVerticalScrollIndicator={false}>
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={isCurrentLoactionLoaded && coordinates && coordinates.latitude ? styles.padding_b : styles.padding_a}>
          <MapView style={{height: 300}}
            initialRegion={initialRegion}
            onRegionChangeComplete={({latitude, longitude}) => debounceCall(latitude, longitude)}
            showsUserLocation={true}
            loadingEnabled={true}
            onUserLocationChange={getPemission}
            showsMyLocationButton={true}
            showsCompass={true}
            followsUserLocation={true}/>
          { isCurrentLoactionLoaded && coordinates && coordinates.latitude && 
            <View style={{position: 'absolute', top: 115, left: '48%', justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesome name="map-marker" size={40} color="red" />
            </View>
          }
        </View>
        <View style={{flex: 3, paddingLeft: 30, paddingRight: 30, paddingTop: 5, justifyContent: 'center'}}>
          {locationValue && locationValue.formatedAddress ? 
            <View style={{paddingTop: 10}}>
              <Text style={{color: 'rgba(0,0,0,0.5)'}}>Location</Text>
              <Text style={{marginTop: 5}}>{locationValue.formatedAddress}</Text>
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
  location : state.location,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  getGeoCoding: (latitude, longitude) => dispatch(geoCoding(latitude, longitude)),
  addNewAddress: (locationValue) => dispatch(creatNew(locationValue)),
  getfetchAddress: () => dispatch(fetchAddress()),
  getPlaceDetails: (place_id) => dispatch(getPlace(place_id))
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