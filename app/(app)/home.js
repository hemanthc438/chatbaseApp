import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator } from 'react-native';
import ChatList from '../../components/ChatList'
import Loading from '../../components/Loading';
import { roomsref, usersref} from '../../firebaseConfig';
import { and, doc, getDocs, onSnapshot, or, orderBy, query, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  const { logout,user } = useAuth();
  const [ users,setUsers ] = useState([])
  const [loading,setLoading]=useState(false);
  const updatedDate = new Date();
  useFocusEffect(
    useCallback(() => {
      getRoomUsers(); // Fetch users when the screen comes back into focus
    }, [])
  );
  useEffect(()=>{
      if(user?.uid)
        getRoomUsers();
  },[])
  const getRoomUsers=async()=>{
    if(user?.uid){
    try{
      setLoading(true)
      const q = query(roomsref,or(where("user1.userId","==",user?.uid),where("user2.userId","==",user?.uid)),orderBy("updatedAt","desc"))
      let unsub=onSnapshot(q,(snapshot)=>{
        let data=[];
        snapshot.forEach(doc=>{
          data.push({...doc.data()})
        });
        setUsers(data)
      })
      setLoading(false)
      return () => unsub();
    }catch(e){
      console.log("message",e.message);
    }}
    else return
  }
  const handleNewChat= ()=>{
    router.push({pathname:'./newChat',params:user})
  }
  return (
    <View className="flex-1 bg-black rounded-t-2xl border border-t-neutral-700">
      <StatusBar style='light'/>
      {loading?(
        <View className="justify-center items-center flx-row">
            <Loading size={hp(6.5)} />
        </View>
        ):(
          users.length>0? 
        (
          <View className="flex-1">
          <ChatList currentUser={user} users={users}/>
          <TouchableOpacity onPress={handleNewChat} style={styles.fab} className="rounded-2xl justify-center items-center">
            <MaterialIcons name="chat" size={24} color="white" />
        </TouchableOpacity>
          </View>
        ):
        ( 
              <View className="flex-1 items-center">
        <View className="items-center">
          <Image style={{height:hp(30), width:wp(100)}} resizeMode='contain' source={require('../../assets/images/Messager.jpg')}/>
        </View>
                <Text style={{fontSize:hp(4)}} className="text-white">
                      No chats yet!!
                </Text>
                <TouchableOpacity onPress={handleNewChat} style={styles.fab} className="rounded-2xl justify-center items-center">
                  <MaterialIcons name="chat" size={24} color="white" />
        </TouchableOpacity>
              </View>
        ))
      }
      
    </View>
  )
}
const styles = StyleSheet.create({
  fab:{
    position: 'absolute',
    right: 16,
    bottom: 25,
    width: 56,
    height: 56,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FFF',
    
  },
  textcon:{
    fontSize:50,
    
  }
})