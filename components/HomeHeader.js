import { View, Text, Platform, Pressable } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blurhash } from '../utils/commons';
import { useAuth } from '../context/authContext';
import { Image } from 'expo-image';
import {Menu,MenuOptions,MenuOption,MenuTrigger} from 'react-native-popup-menu';
import { MenuItem } from './CustomMenuItems';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const ios=Platform.OS==='ios'
export default function HomeHeader() {
    const {top} = useSafeAreaInsets();
    const {user,logout} = useAuth();
    const handleProfile=()=>{
      router.push({pathname:'./profile',params:user})
    }
    
  return (
    <View className="bg-neutral-500">
    <View style={{paddingTop: ios?top:top+10}} className="flex-row justify-between px-5 pb-6 bg-red-700 rounded-b-3xl">  
      <View>
        <Text style={{fontSize:hp(4)}} className="font-medium text-white">Chats</Text>
      </View>
          <Pressable onPress={handleProfile}>
          <Image
                style={{height:hp(4.5), aspectRatio:1, borderRadius:100}}
                source={user?.profileURL}
                placeholder={{ blurhash }}
                transition={500}
            />
            </Pressable>
    </View>
    </View>
  )
}
const Divider =()=>{
  return (
    <View className="p-[1px] w-full bg-neutral-500"></View>
  )
}