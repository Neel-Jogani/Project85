import * as React from 'react'
import { View, Text, TouchableOpacity,StyleSheet,SafeAreaView,Platform,StatusBar,Image } from 'react-native'   
import * as Google from 'expo-google-app-auth'
import firebase from 'firebase'

export default class LoginScreen extends React.Component{

    signInWithGoogleAsync=async()=> {
        try {
          const result = await Google.logInAsync({
            behaviour: 'web',
            androidClientId: '1045961418091-1s3jk2q4akvet0jehtmrplrtoi6a83at.apps.googleusercontent.com',
            iosClientId: '1045961418091-hv3ecfs63f7k77ifcu257mj7o08v4vm2.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            this.onSignIn(result)
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          console.log(e.message)
          return { error: true };
        }
      }
      onSignIn=(googleUser)=>{
        var unsubscribe= firebase.auth().onAuthStateChanged((firebaseUser)=>{
          unsubscribe()
          if(!this.isUserEqual(googleUser,firebaseUser)){
            var credantials= firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            )
          firebase
          .auth()
          .signInWithCredential(credantials)
          .then(function(result){
              if(result.additionalUserInfo.isNewUser){
                  firebase
                  .database()
                  .ref('/users/'+ result.user.uid)
                  .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: 'dark'
                  })
                  .then(function(snapshot){})
              }
          })
            .catch((error)=>{})
        }
                else{
                    console.log('the user has already signed into firebase')
                }
        })

      }
      isUserEqual=(googleUser,firebaseUser)=>{
            if(firebaseUser){
                var providerData= firebase.providerData
                for(var i=0; i<providerData.length;i++){
                    if(providerData[i].providerId===firebase.auth.GoogleAuthProvider.PROVIDER_ID && providerData[i].uid===googleUser.getBasicProfile().getId()){
                        return true
                    }
                }
            }
            return false
      }
render(){
    return(
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.signInWithGoogleAsync()}>
                <Text>Sign-In with Google</Text>
            </TouchableOpacity>
        </View>
    )
}
}