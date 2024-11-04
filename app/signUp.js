import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome, FontAwesome6, MaterialCommunityIcons, Zocial } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboard from '../components/CustomKeyboard';
import { useAuth } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';


export default function SignUp() {
  const router = useRouter();
  const [loading,setLoading]=useState(false);
  const {register} = useAuth();
  const userName = useRef("");
  const email = useRef("");
  const password = useRef("");
  const profile = useRef("");
  profile.current = ""


  const handleRegister = async() => {
    if(!email.current  || !password.current || !userName.current){
      Alert.alert("Please enter all the mandatory fields")
      return;
    }
      setLoading(true);
      let response = await register(email.current,password.current,userName.current,profile.current)
      setLoading(false);
      if(!response.success){
        Alert.alert(response.msg)
      }
  }
  return (
    <CustomKeyboard>
      <StatusBar style='light'/>
      <View style={{paddingTop:hp(8), paddingBottom:wp(5)}} className="flex-1 gap-12 px-1.5">
        {/*Signin image*/}
        <View className="items-center">
          <Image style={{height:hp(15), width:wp(100)}} resizeMode='contain' source={require('../assets/images/Messager.jpg')}/>
        </View>

        <View className="gap-10">
          <Text style={{fontSize:hp(5)}} className="font-bold text-center tracking-wider text-neutral-300">Sign Up</Text>
          {/*Inputs*/}
          <View className="gap-4">
          <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <FontAwesome name="user" size={hp(3.3)} color="black" />
              <TextInput 
              onChangeText={value=>userName.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              placeholder='User Name'/>
            </View>
            <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <MaterialCommunityIcons name="email" size={hp(3.3)} color="black"/>
              <TextInput 
              onChangeText={value=>email.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              placeholder='Email Address'/>
            </View>
          
            <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <MaterialCommunityIcons name="lock" size={hp(3.3)} color="black"/>
              <TextInput 
              onChangeText={value=>password.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              secureTextEntry
              placeholder='Password'/>
            </View>
            <View className="gap-10">
            <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <AntDesign name="profile" size={hp(3.3)} color="black" />
              <TextInput 
              onChangeText={value=>profile.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              placeholder='Profile Picture'/>
            </View>
          
          {/*SignUp button*/}
          <View style={{height:hp(6.5)}}>
            {
              loading?(
                <View className="justify-center items-center flx-row">
                  <Loading size={hp(6.5)} />
                </View>

              ):(<TouchableOpacity onPress={handleRegister} style={{height:hp(6.5)}} className="bg-red-700 rounded-2xl justify-center items-center flx-row">
              <Text style={{fontSize:hp(3)}} className="text-white font-bold tracking-wider" >Sign Up</Text>
            </TouchableOpacity>)
            }
          </View>
          </View>
          
          <View className="flex-row justify-center">
            <Text style={{fontSize:hp(1.8)}} className="font-semibold text-neutral-300">Already have an account?</Text>
            <Pressable onPress={()=> router.push('signIn')}>
              <Text style={{fontSize:hp(1.8)}} className="font-bold text-indigo-700"> Sign In</Text>
            </Pressable>
          </View>
          </View>
        </View>
      </View>
      </CustomKeyboard>
  )
}