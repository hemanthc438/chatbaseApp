import { View, Text, Platform, Alert } from 'react-native'
import React from 'react'
import { router, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { MenuItem } from './CustomMenuItems'
import { useAuth } from '../context/authContext'


export default function Header({user}) {
  const router = useRouter();
  const ios=Platform.OS==='ios'
  const {logout} = useAuth();
  const handleReset = () =>{
    router.push({pathname:'/forgotPassword',params:"forgot"})
  }
  const handleLogout= async ()=>{
    await logout();
  }
  handleEditProfile=()=>{
    
  }
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
              <View className="flex-row items-center px-2">
                <Text style={{fontSize:hp(3)}} className="font-bold text-white">Profile</Text>
              </View>
              </View>
          ),
          headerRight:()=>(
            <View className="flex-row items-center gap-4">      
                <Menu>
                  <MenuTrigger customStyles={{
                    triggerWrapper:{}
                      }}>
                    <MaterialCommunityIcons name="menu" size={24} color="white" />
                  </MenuTrigger>
                    <MenuOptions customStyles={{
                      optionsContainer:{
                        borderRadius:12,
                        borderCurve:"continuous",
                        marginTop:40,
                        marginLeft:-30,
                        width:160,
                        backgroundColor:'gray'
                      }
                    }}>
                        <MenuItem
                          text="Reset password"
                          action={handleReset}
                          value={null}
                          icon={<MaterialCommunityIcons name="lock" size={hp(3.3)} color="black"/>}
                        />
                        <Divider/>
                        <MenuItem
                          text="Logout"
                          action={handleLogout}
                          value={null}
                          icon={<AntDesign name="logout" size={hp(2.7)} color="black" />}
                        />
                    </MenuOptions>
                  </Menu>
            </View>
        )
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