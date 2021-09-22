import * as React from 'react'
import {View,ActivityIndicator} from 'react-native'
import firebase from 'firebase'


export default class Loading extends React.Component{
 
    checkIfLoggedIn=()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.props.navigation.navigate('Dashboard')
            }
            else{
                this.props.navigation.navigate('Login')
            }
        })
    }

    componentDidMount(){
        this.checkIfLoggedIn()
    }

    render(){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems: 'center' }}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }
    }