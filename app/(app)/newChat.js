import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useLocalSearchParams, useRouter } from 'expo-router';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { getDocs, query, where } from 'firebase/firestore';
import { usersref } from '../../firebaseConfig';
import Loading from '../../components/Loading';
import ChatListUsers from '../../components/ChatListUsers';
import HeaderNewChat from '../../components/HeaderNewChat';

export default function NewChat() {
    const item= useLocalSearchParams();
    const {user}=useAuth()
    const {router}=useRouter()
    const [search,setSearch] = useState("")
    const [ users,setUsers ] = useState([])
    const [ displayUsers,setDisplayUsers ] = useState([])
    const [ usersSearched,setUsersSearched ] = useState([])
    if(item.profileURL==""){item.profileURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT43Q1CTrvRfckF6osuwyT4-TOYrBRWTYSUCc-plMWXrIkbARNsWnCAA67TQE7he2qEJ1Y&usqp=CAU.png"}
    useEffect(()=>{
      if(user?.userId)
        getUsers();
    },[])
    useEffect(()=>{
      handleSearch()
    },[search])
    
    const getUsers = async() => {
      try{
    const q= query(usersref, where("userId","!=",user?.userId));  
    const querySnapshot = await getDocs(q)
    let data=[];
    querySnapshot.forEach(doc=>{
      data.push({...doc.data()});
    });
    setUsers(data)
    setDisplayUsers(data)
  }
  catch(e){
    console.log(e)
  }
  }
  const handleSearch =() =>{
    setDisplayUsers([])
    setUsersSearched([])
    console.log(search)
    if(search=="")setDisplayUsers(users)
    else{
      users.forEach(data=>{
        if(data?.username.toLowerCase().includes(search.toLowerCase()))
        usersSearched.push(data)
      })
      setDisplayUsers(usersSearched)
    }
  }
  return (
    <View className="flex-1 ">
    <StatusBar style='light'/>
    <HeaderNewChat user={item} router={router}/>
    <View style={{paddingTop:hp(2), paddingBottom:wp(1)}} className="bg-black flex-1 gap-2.5 px-1.5 border border-t-neutral-700">
          <View className="px-3 rounded-3xl bg-neutral-400">
          <TextInput
            value={search}
            placeholder='search'
            onChangeText={setSearch}
          ></TextInput>
          </View>
        <View className="px-5">
        <Text style={{fontSize:hp(2)}} className="text-neutral-300">Users on ChatBase</Text>
      </View>
        {
        users.length>0? 
        (<ChatListUsers currentUser={user} users={displayUsers} />):
        (
              <Loading size={hp(2)}/>
        )
      }
        
      </View> 
  </View>
  )
}