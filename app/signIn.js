import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { MaterialCommunityIcons, Zocial } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboard from '../components/CustomKeyboard';
import { useAuth } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';


export default function SignIn() {
  const router = useRouter();
  const {login} = useAuth();
  const [loading,setLoading]=useState(false);
  const email = useRef("");
  const password = useRef("");

  const handleLogin = async() => {
    if(!email.current  || !password.current){
      Alert.alert("Please enter all the mandatory fields")
      return;
    }
    setLoading(true)
    let response = await login(email.current,password.current)
    setLoading(false)
    if(!response.success)
      Alert.alert(response.msg)
  }
  const handleForgotPass = () =>{
    Alert.alert("This feature will be developed when the email verification feature is added!!")
  }
  return (
    <CustomKeyboard>
      <StatusBar style='light'/>
      <View style={{paddingTop:hp(8), paddingBottom:wp(5)}} className="flex-1 gap-12 px-1.5">
        {/*Signin image*/}
        <View className="items-center">
          <Image style={{height:hp(30), width:wp(100)}} resizeMode='contain' source={require('../assets/images/Messager.jpg')}/>
        </View>

        <View className="gap-10">
          <Text style={{fontSize:hp(5)}} className="font-bold text-center tracking-wider text-neutral-300">Sign In</Text>
          {/*Inputs*/}
          <View className="gap-4">
          <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
            <MaterialCommunityIcons name="email" size={hp(3.3)} color="black"/>
            <TextInput 
            onChangeText={value=>email.current=value}
            style={{fontSize:hp(2)}} 
            className="flex-1 font-semibold" 
            placeholder='Email Address'/>
          </View>
          <View className="gap-3">
          <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
            <MaterialCommunityIcons name="lock" size={hp(3.3)} color="black"/>
            <TextInput 
            onChangeText={value=>password.current=value}
            style={{fontSize:hp(2)}} 
            className="flex-1 font-semibold" 
            secureTextEntry
            placeholder='Password'/>
          </View>
          <Pressable onPress={handleForgotPass}>
          <Text style={{fontSize:hp(2)}} className="font-semibold text-right text-neutral-300">Forgot Password?</Text>
          </Pressable>
          </View>
          {/*Signin button*/}
          <View style={{height:hp(6.5)}}>
            {
              loading?(
                <View className="justify-center items-center flx-row">
                  <Loading size={hp(6.5)} />
                </View>

              ):(<TouchableOpacity onPress={handleLogin} style={{height:hp(6.5)}} className="bg-red-700 rounded-2xl justify-center items-center flx-row">
              <Text style={{fontSize:hp(3)}} className="text-white font-bold tracking-wider" >Sign In</Text>
            </TouchableOpacity>)
            }
          </View>
          
          <View className="flex-row justify-center">
            <Text style={{fontSize:hp(1.8)}} className="font-semibold text-neutral-300">Don't have an account?</Text>
            <Pressable onPress={()=> router.push('signUp')}>
              <Text style={{fontSize:hp(1.8)}} className="font-bold text-indigo-700"> Sign up</Text>
            </Pressable>
          </View>
          </View>
        </View>
      </View>
      </CustomKeyboard>
  )
}