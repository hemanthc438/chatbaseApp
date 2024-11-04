import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { AntDesign, FontAwesome, FontAwesome6, MaterialCommunityIcons, Zocial } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import CustomKeyboard from '../../components/CustomKeyboard';
import { useAuth } from '../../context/authContext';
import { StatusBar } from 'expo-status-bar';
import HeaderReset from '../../components/HeaderReset';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';


export default function ForgotPassword() {
  const router = useRouter();
  const [loading,setLoading]=useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const oldPassword = useRef("");
  const password = useRef("");
  const rePassword = useRef("");

  const handleReset = async() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user?.email,
      oldPassword.current
  );
  try{
    console.log(credential)
     await reauthenticateWithCredential(user, credential);
     if(!oldPassword.current  || !password.current || !rePassword.current){
      Alert.alert("Please enter all the mandatory fields")
      return;
    }
    if(password.current == oldPassword.current){
      Alert.alert("New password shouldn't be same as old password")
      return;
    }
    if(password.current != rePassword.current){
        Alert.alert("Both the passwords are not same")
      return;
    }
      setLoading(true);
      try{
        await updatePassword(user,rePassword.current)
        Alert.alert("Success", "Password updated successfully!");
        console.log({user})
        router.back()
      }catch(e){
        if(e.message.includes("(auth/weak-password)")){
          Alert.alert("Password should be at least 6 characters")
        }
      }
      setLoading(false);
    }catch(e){
      if(e.message.includes("Firebase: Error (auth/invalid-credential)")){
        Alert.alert("current password entered is wrong! please enter the correct password")
      }
    }
  }
  return (
    <CustomKeyboard>
      <StatusBar style='light'/>
      <HeaderReset/>
      <View style={{paddingTop:hp(3), paddingBottom:wp(5)}} className="flex-1 gap-12 px-1.5 border border-t-neutral-700">

        <View className="gap-10 ">
          <Text style={{fontSize:hp(5)}} className="font-bold text-center tracking-wider text-neutral-300">{user?.email}</Text>
          {/*Inputs*/}
          <View className="gap-4">
            <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <MaterialCommunityIcons name="lock" size={hp(3.3)} color="black"/>
              <TextInput 
              onChangeText={value=>oldPassword.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              secureTextEntry
              placeholder='Old Password'/>
            </View>
            <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <MaterialCommunityIcons name="lock" size={hp(3.3)} color="black"/>
              <TextInput 
              onChangeText={value=>password.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              secureTextEntry
              placeholder='New Password'/>
            </View>
            <View style={{height:hp(7)}} className="flex-row items-center gap-4 px-4 bg-neutral-400 rounded-2xl" >
              <MaterialCommunityIcons name="lock" size={hp(3.3)} color="black"/>
              <TextInput 
              onChangeText={value=>rePassword.current=value}
              style={{fontSize:hp(2)}} 
              className="flex-1 font-semibold" 
              secureTextEntry
              placeholder='Re enter Password'/>
            </View>
          
          {/*SignUp button*/}
          <View style={{height:hp(6.5)}}>
            {
              loading?(
                <View className="justify-center items-center flx-row">
                  <Loading size={hp(6.5)} />
                </View>

              ):(<TouchableOpacity onPress={handleReset} style={{height:hp(6.5)}} className="bg-red-700 rounded-2xl justify-center items-center flx-row">
              <Text style={{fontSize:hp(3)}} className="text-white font-bold tracking-wider" >Reset</Text>
            </TouchableOpacity>)
            }
          </View>
          </View>
        </View>
      </View>
      </CustomKeyboard>
  )
}