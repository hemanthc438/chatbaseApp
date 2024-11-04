import { View,Text } from "react-native";
import React, { useEffect } from "react";
import {Slot, useRouter, useSegments} from "expo-router";
// Import your global CSS file
import "../global.css"
import { AuthContextProvider, useAuth } from "../context/authContext";
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout=()=>{
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();
    useEffect(()=>{
        if(typeof isAuthenticated=='undefined') return;
        const inApp = segments[0] == ('app');
        if(isAuthenticated && !inApp){
            //navigate to home
            router.replace('home');
        }else if(isAuthenticated == false){
            //navigate to signin
            router.replace('signIn');
        }
    },[isAuthenticated])

    return <Slot/>
}

export default function RootLayout(){
    return(
        <MenuProvider>
            <AuthContextProvider>
                <MainLayout />
            </AuthContextProvider>
        </MenuProvider>
    )
}