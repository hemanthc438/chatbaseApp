import { createContext, useContext, useEffect, useState } from "react";
import firebase from 'firebase/app'
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword, signOut, updatePassword} from 'firebase/auth'
import { auth, db, usersref } from "../firebaseConfig"
import {doc, setDoc, getDoc, Timestamp, serverTimestamp, getDocs, where, query} from 'firebase/firestore'
export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined)

    useEffect(()=>{
      const unsub = onAuthStateChanged(auth, (user)=>{
        if(user){
            setIsAuthenticated(true);
            setUser(user)
            updateUserData(user.uid)
        }
        else
        {
            setIsAuthenticated(false);
            setUser(null)
        }
       })
       return unsub;
    },[])

    const updateUserData = async (uid) => {
        const docRef = doc(db, 'users',uid)
        const docSnapshot = await getDoc(docRef)

        if(docSnapshot.exists()){
            let data = docSnapshot.data()
            setUser({...user,username:data.username,profileURL:data.profileURL,userId:data.userId,updatedAt:serverTimestamp(),about:data.about})

        }
    }
    const login = async (email, password)=>{
        try{
            const response = await signInWithEmailAndPassword(auth, email, password)
            return {success:true}
        }catch(e){
            let msg=e.message
            if(msg.includes("auth/invalid-email"))
                msg="invalid mail"
            if(msg.includes("auth/invalid-credential"))
                msg="invalid credentials"
            return { success:false, msg}
        }
    }
    const logout = async ()=>{
        try{
            await signOut(auth);
            
        }catch(e){
            return {success:false, msg: e.message, error:e}
        }
    }
    const register = async (email, password, username, profileURL)=>{
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "users", response?.user?.uid),{
                username,
                profileURL,
                email,
                userId: response?.user?.uid,
                createdAt:serverTimestamp(),
                about:"Hey there! I'm using chatbase"
            })
            return { success:true, data: response?.user }
        }catch(e){
            let msg=e.message
            if(msg.includes("auth/invalid-email"))
                msg="invalid mail"
            else if(msg.includes("auth/email-already-in-use"))
                msg="Mail already registered"
            else if(msg.includes("auth/weak-password"))
                msg="Weak password, try a new one"
            return { success:false, msg}
        }
    }
    return(
        <AuthContext.Provider value={{user,isAuthenticated,login,logout,register,updateUserData}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth=()=>{
    const value = useContext(AuthContext)
    if(!value){
        throw new Error('UseAuth must be wrapped inside auth context provider')
    }
    return value;
}