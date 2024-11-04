import { View, Text, Platform, Alert } from 'react-native'
import React from 'react'
import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { MenuItem } from './CustomMenuItems'


export default function HeaderReset({user}) {
  const router = useRouter();
  const ios=Platform.OS==='ios'
  return (
    <Stack.Screen
        options={{
            title:"", 
            headerShadowVisible:false,
            contentStyle: { backgroundColor: '#737373'},
            headerStyle: { backgroundColor: 'black'},
            headerLeft:()=>(
              <View className="flex-row bg-black">      
              {ios && (
                  <TouchableOpacity onPress={()=>router.back()}>
                      <Ionicons name="chevron-back-circle-outline" size={hp(4)} color="white" />
                  </TouchableOpacity>
              )}
              <View className="flex-row items-center">
                <Text style={{fontSize:hp(3)}} className="pl-3 font-bold text-white">Reset Password</Text>
              </View>
              </View>
          ),
         }}
    >

    </Stack.Screen>
  )
}
const Divider =()=>{
  return (
    <View className="p-[1px] w-full bg-neutral-500"></View>
  )
}