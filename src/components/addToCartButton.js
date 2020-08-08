import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { requestLogin } from '../store/actions/authenticationAction';

function AddToCartButton(props) {
  const { setAdded, isOffline, isLoading, setLoading, session, requestLogin } = props
  const addItemToCart = () => {
    if(session.isSessionAuthenticated) {
      setLoading(true)
      if(props.addToCart) {
        props.addToCart(props.item)
      }
      if(setAdded) {
        setAdded(true)
      }
    } else {
      requestLogin()
    }
  }

  if(isOffline) {
    return (
      <View style={{ width: 70, padding: 5, borderRadius: 5}}>
        <Text style={{textAlign: 'center', color: 'grey'}}>Offline</Text>
      </View>
    )
  } else if (isLoading) {
    return (
      <View style={{ width: 70, padding: 5, borderRadius: 5 }}>
        <Text style={{textAlign: 'center', color: 'black'}}>Loading..</Text>
      </View>
    )
  } else {
    return (
      <TouchableOpacity onPress={() => addItemToCart()}>
        <View style={{ width: 70, padding: 5, borderRadius: 5, backgroundColor: '#d4d4d4' }}>
          <Text style={{textAlign: 'center', color: 'black'}}>Add</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = state => ({session: state.session})

export default connect(mapStateToProps, {requestLogin})(AddToCartButton);