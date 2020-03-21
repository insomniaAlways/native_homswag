import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import PlaceHolderTextInput from '../components/placeHolderTextInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { fetchUser, updateUser } from '../store/actions/userActions';
import { KeyboardAvoidingView } from '../components/KeyboardAvoidView';
import _ from 'lodash';
import ImagePickerView from '../components/ImagePicker';
import { brandLightBackdroundColor, statusBarLightColor } from '../style/customStyles';

function ProfileScreen(props) {
  const { currentUserModel, getUser, updateUserDetails, networkAvailability } = props
  const [ currentUserObject, updateCurrentUser ] = useState({...currentUserModel.values})
  const [ isEdit, setEdit ] = useState(false)
  const [ isLoading, setLoading ] = useState(false)
  const [ isUploading, setUploding ] = useState(false)

  const updateProfile = () => {
    if(currentUserObject.name && typeof(currentUserObject.name) == "string" && currentUserObject.name.length > 0) {
      setLoading(true)
      updateUserDetails(_.omitBy({
        name: currentUserObject.name,
        alt_phone: currentUserObject.alt_phone,
        image_source: currentUserObject.image_source,
        email: currentUserObject.email
      }, _.isNil))
    } else {
      alert("Please enter your name. Thank You!")
    }
  }

  const imageUploaded = (uri) => {
    updateCurrentUser({...currentUserObject, image_source: uri})
    setUploding(false)
  }

  useLayoutEffect(() => {
    if(!networkAvailability.isOffline) {
      async function fetchRecords() {
        await getUser()
      }
      fetchRecords()
    }
  }, [])

  useEffect(() => {
    if(!currentUserModel.isLoading && currentUserModel.error) {
      setLoading(false)
      if(currentUserModel.error.message) {
        alert(currentUserModel.error.message)
      } else {
        alert(currentUserModel.error)
      }
    } else if(!currentUserModel.isLoading && _.isNil(currentUserModel.error)){
      setLoading(false)
      setEdit(false)
      updateCurrentUser({...currentUserModel.values})
    }
  }, [currentUserModel.isLoading, currentUserModel.error])

  const cancelEdit = () => {
    updateCurrentUser({...currentUserModel.values})
    setEdit(false)
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView>
      <StatusBar backgroundColor={statusBarLightColor} barStyle={"dark-content"} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F7F9FC"}}>
        <View style={{backgroundColor: "#F7F9FC", justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.container}>
            <View style={styles.profilePicContainer}>
              <ImagePickerView
                styles={styles}
                image={currentUserObject.image_source}
                setImage={imageUploaded}
                user_id={currentUserModel.values.id}
                isEdit={isEdit}
                isOffline={networkAvailability.isOffline}
                isUploading={isUploading}
                setUploding={setUploding}
                />
            </View>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: 'auto', marginHorizontal: 40}}>
              {isEdit ? 
                <TouchableOpacity onPress={() => cancelEdit()}>
                  <Text>Cancel</Text>
                </TouchableOpacity>:
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              }
            </View>
            {isEdit ? 
              <View style={styles.detialsContainer}>
                <View style={styles.item}>
                  <Text style={styles.label}>Name :</Text>
                  <PlaceHolderTextInput
                    placeholder="Name"
                    containerStyle={styles.placeholderInput}
                    styles={styles.field}
                    value={currentUserObject.name}
                    setValue={updateCurrentUser}
                    previousState={currentUserObject}
                    itemKey="name"
                    editable={!isLoading}/>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>Phone :</Text>
                  <Text style={[styles.placeholderInput, styles.field]}>{currentUserObject.phone}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>Alt. Phone :</Text>
                  <PlaceHolderTextInput
                    placeholder="Alternate Phone"
                    containerStyle={styles.placeholderInput}
                    styles={styles.field}
                    value={currentUserObject.alt_phone}
                    setValue={updateCurrentUser}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    previousState={currentUserObject}
                    itemKey="alt_phone"
                    editable={!isLoading}/>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>Email :</Text>
                  <PlaceHolderTextInput
                    placeholder="Email"
                    containerStyle={styles.placeholderInput}
                    styles={styles.field}
                    value={currentUserObject.email}
                    setValue={updateCurrentUser}
                    previousState={currentUserObject}
                    itemKey="email"
                    editable={!isLoading}/>
                </View>
              </View> :
              <View style={styles.detialsContainer}>
                <View style={styles.item}>
                  <Text style={styles.label}>Name :</Text>
                  {currentUserObject.name ? 
                    <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyMediumItalic]}>{currentUserObject.name}</Text>:
                    <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyLightItalic]}>Not Available</Text>
                  }
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>Phone :</Text>
                  <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyMediumItalic]}>{currentUserObject.phone}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>Alt. Phone :</Text>
                  {currentUserObject.alt_phone ? 
                    <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyMediumItalic]}>{currentUserObject.alt_phone}</Text> :
                    <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyLightItalic]}>Not Available</Text>
                  }
                </View>
                <View style={styles.item}>
                  <Text style={styles.label}>Email :</Text>
                  {currentUserObject.email ? 
                    <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyMediumItalic]}>{currentUserObject.email}</Text> :
                    <Text style={[styles.placeholderInput, styles.field, styles.textFontFamilyLightItalic]}>Not Available</Text>
                  }
                </View>
              </View>
            }
          </View>
        </View>
        <View style={styles.backButtonContainer}>
          {isLoading ? 
            <View>
                <View style={styles.backButton}>
                  <Text style={{color: "#fff"}}>Saving..</Text>
                </View>
              </View> :
            <View>
              {isEdit ? 
                <View>
                  {networkAvailability.isOffline ? 
                    <TouchableOpacity disabled={true}>
                      <View style={[styles.backButton, {backgroundColor: brandLightBackdroundColor}]}>
                        <Text style={{color: "#fff"}}>Save</Text>
                      </View>
                    </TouchableOpacity> :
                    <TouchableOpacity onPress={updateProfile}>
                      <View style={styles.backButton}>
                        <Text style={{color: "#fff"}}>Save</Text>
                      </View>
                    </TouchableOpacity> 
                  }
                </View> :
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
                  <View style={styles.backButton}>
                    <FontAwesome name="angle-right" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              }
            </View>
          }
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Constants.statusBarHeight,
    // borderWidth: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20
  },
  profilePicContainer: {
    height: 180,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePic: {
    height: 140,
    width: 140,
    borderRadius: 70
  },
  detialsContainer: {
    minHeight: 250,
    paddingHorizontal: 10,
    alignItems: 'center',
    // marginHorizontal: 20
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  placeholderInput: {
    width: '64%',
  },

  textFontFamilyMediumItalic: {
    fontFamily: 'Roboto-MediumItalic'
  },

  textFontFamilyLightItalic: {
    fontFamily: 'Roboto-LightItalic',
    fontSize: 13
  },

  field: {
    paddingHorizontal: 10
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 30
  },

  backButton: {
    paddingTop: 7,
    paddingBottom: 7,
    width: 150,
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#6495ed'
  },

  label: {
    width: '26%',
    textAlign: 'left',
    justifyContent: 'center',
    fontFamily: 'Roboto-Regular'
  }

})

const mapStateToProps = state => ({
  currentUserModel: state.currentUser,
  networkAvailability: state.networkAvailability
})

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(fetchUser()),
  updateUserDetails: (data) => dispatch(updateUser(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);