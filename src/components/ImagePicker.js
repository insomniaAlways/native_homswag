import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ImageBackground, StyleSheet, Text, Platform, PermissionsAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'react-native-unimodules';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import storage from '@react-native-firebase/storage';
import ProfilePicPlaceholder from '../assets/images/profile_pic_placeholder.png'

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react-native';
import ShowAlert from '../controllers/alert';

const ImagePickerView = (props) => {
  const { image, setImage, user_id, isEdit, isUploading, setUploding, isOffline } = props
  const [ status, setStatus ] = useState()
  const [ progress, setProgress ] = useState()

  const reset = () => {
    setUploding(false)
  }

  const startModule = () =>{
    if(isOffline) {
      ShowAlert('Oops!', 'Seems like you are not connected to Internet')
    } else {
      getPermissionAsync();
    }
  }

  const progressStatus = (snapshot) => {
    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(Math.round(percentage))
    switch (snapshot.state) {
      case 'paused':
        return setStatus(snapshot.state)
      case 'running':
        return setStatus(snapshot.state)
      default: setStatus(snapshot.state)
    }
  }

  const catchError = (error) => {
    Sentry.captureEvent(error)
    reset()
    switch (error.code) {
      case 'storage/unauthorized': {
        return ShowAlert('Oops!', error.code)
      }
      case 'storage/canceled': {
        return ShowAlert('Oops!', error.code)
      }
      case 'storage/unknown': {
        return ShowAlert('Oops!', error.code)
      }
    }
  }

  const uploadImage = async (uri, fileExtention) => {
    try {
      const fileName =  `${user_id}_${uuidv4()}`
      let ref = storage().ref().child('profile_pic/' + fileName);
      const uploadTask = ref.putFile(uri);
      uploadTask.on('state_changed',
      (snapshot) => progressStatus(snapshot),
      (error) => catchError(error),
      () => ref.getDownloadURL()
      .then((url) => setImage(url)))
    } catch (e) {
      ShowAlert('Oops!', e)
      reset()
      Sentry.captureException(error)
    }
  }

  const getPermissionAsync = async () => {
    try {
      if(Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Homswag File Access Permission',
            message:
              'Homswag needs access to your files ' +
              'for setting profile picture..',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          _pickImage()
        } else {
          ShowAlert('Permission Required', 'Sorry, we need file system permissions to make this work!');
        }
      } else if (Platform.OS === 'ios') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          ShowAlert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        } else {
          _pickImage()
        }
      }
    } catch (err) {
      ShowAlert('Oops!', err)
      Sentry.captureException(error)
    }
  }

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.5
      });

      if (!result.cancelled) {
        setUploding(true)
        let fileExtention =  result.uri.split('.').pop()
        uploadImage(result.uri, fileExtention)
      }
    } catch(e) {
      ShowAlert('Oops!', e)
      Sentry.captureEvent(error)
    }
  };

  return (
    <View style={props.styles.profilePicContainer}>
      { image ?
        <View style={props.styles.profilePic}>
          <Image style={props.styles.profilePic} source={{uri: image}}/>
        </View>:
        <TouchableOpacity onPress={startModule} disabled={!isEdit || isUploading}>
          <ImageBackground style={styles.profilePicPlaceHolder} source={ProfilePicPlaceholder}>
            <View style={{paddingBottom: 10, paddingRight: 10, backgroundColor: 'transparent'}}>
              <FontAwesome name="camera" size={24} />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      }
      { isEdit &&
        <View style={{paddingTop: 5}}>
        { isUploading ?
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Roboto-LightItalic', fontSize: 12}}>{progress}%</Text>
            <Text style={{fontFamily: 'Roboto-LightItalic', fontSize: 12}}>Uploading...</Text>
          </View> :
          <TouchableOpacity onPress={startModule} style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>Change</Text>
          </TouchableOpacity>
        }
        </View> 
      }
    </View>
  )
}

export default ImagePickerView;

const styles = StyleSheet.create({
  profilePicPlaceHolder: {
    height: 140,
    width: 140,
    borderRadius: 70,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
})