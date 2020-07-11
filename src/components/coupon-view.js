import React, { useState } from 'react';
import FloatingInput from './input-helpers.js/floatingInput';
import { TouchableOpacity, View, Text } from 'react-native';
import { brandColor } from '../style/customStyles';
import { connect } from 'react-redux';
import { applyReferral } from '../store/actions/referral.action';
import ShowAlert from '../controllers/alert';

function CouponView(props) {
  const { applyReferralCode, isLoading, toggleModal } = props
  const [couponCode, setCoupon] = useState('');

  const applyCoupon = () => {
    if(couponCode && typeof(couponCode) == "string" && couponCode.trim && couponCode.trim().length) {
      applyReferralCode({
        referral_code: couponCode
      })
      toggleModal(false)
    } else {
      ShowAlert('Invalide Code', "Please enter a valid code")
    }
  };

  return (
    <View>
      <FloatingInput
        label={'Enter code here'}
        labelStyle={{
          paddingTop: 0
        }}
        value={couponCode}
        setValue={setCoupon}
      />
      <View
        style={{
          justifyContent: 'center',
          width: '100%',
          alignItems: 'center',
          marginTop: 10
        }}>
        <TouchableOpacity onPress={applyCoupon} disabled={isLoading}>
          <View
            style={{
              backgroundColor: brandColor,
              width: 90,
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Text style={{ color: '#fff' }}>Apply</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const mapDispatchToProps = dispatch => ({
  applyReferralCode: (data) => dispatch(applyReferral(data)) 
})

export default connect(null, mapDispatchToProps)(CouponView);
