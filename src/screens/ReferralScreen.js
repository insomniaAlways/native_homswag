import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Share,
  Image
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import ShowAlert from "../controllers/alert";
import * as Sentry from "@sentry/react-native";
import { brandColor } from "../style/customStyles";
import Referral from "../assets/images/referral.png";
import { requestLogin } from "../store/actions/authenticationAction";

const ReferralScreen = (props) => {
  const { currentUserModel, session, requestLoginUser } = props;
  const { user_meta } = currentUserModel.values;

  const onShare = async () => {
    try {
      await Share.share(
        {
          message: `Hey Dear
*Use this Referral code*
And get instant 325 rewards points from *Homswag* after completing your first Order, they are Safe and hygienic salon services provider at Home, For Men and Women.
You will even get rewards on every orders you complete with them, *They follow all safety measures*.
Referral Code: *${user_meta.referral_code}*.
Android: https://play.google.com/store/apps/details?id=com.capaz.homswag,
iOS: https://apps.apple.com/in/app/homswag/id1519588025`
        },
        {
          subject: "Download Homswag App",
          dialogTitle: "Download Homswag App"
        }
      );
    } catch (error) {
      if (error && error.message) {
        ShowAlert("Opps!", error.message);
      } else {
        ShowAlert("Opps!", error);
      }
      Sentry.captureEvent(error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <View
          style={{ paddingHorizontal: 10, paddingVertical: 10, marginTop: 40 }}
        >
          <Text style={{ fontSize: 18, fontFamily: "Roboto-MediumItalic" }}>
            Refer and Earn rewards
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 30
          }}
        >
          <View style={{ paddingHorizontal: 30, alignItems: "center" }}>
            <View>
              <Image source={Referral} style={{ width: 200, height: 200 }} />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Roboto-Medium",
                textAlign: "center",
                marginTop: 30
              }}
            >
              Invite your friends and get reward points.
            </Text>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Invite your Friends to Homswag services. They get instant 325
              rewards points. And you get 650 rewards points after completion
              the order.
            </Text>
            {session.isSessionAuthenticated ? (
              <TouchableOpacity onPress={onShare} style={{ marginTop: 30 }}>
                <View
                  style={{
                    width: 150,
                    paddingVertical: 10,
                    backgroundColor: brandColor,
                    borderRadius: 20,
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "white" }}>Share</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={{ marginTop: 30 }}>
                <View
                  style={{
                    width: 150,
                    paddingVertical: 5,
                    backgroundColor: "#a9d5de",
                    alignItems: "center",
                    borderRadius: 5
                  }}
                >
                  <Text>Login first to Share</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
          <View style={styles.backButton}>
            <FontAwesome name="angle-right" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    justifyContent: "center",
    alignContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
    width: "100%"
  },
  backButton: {
    paddingTop: 7,
    paddingBottom: 7,
    width: 150,
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#6495ed"
  }
});
const mapStateToProps = (state) => ({
  currentUserModel: state.currentUser,
  session: state.session
});

const mapDispatchToProps = (dispatch) => ({
  requestLoginUser: () => dispatch(requestLogin)
});
export default connect(mapStateToProps, mapDispatchToProps)(ReferralScreen);
