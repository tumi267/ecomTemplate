'use client'
import React, { useState } from 'react'
import styles from './LoginUser.module.css'
import { SignIn, SignOutButton, useClerk } from '@clerk/nextjs'
import { useUserStore } from '../../libs/useUserStore'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs' // Assuming Clerk
function LoginUser() {
    const { user, isLoaded } = useUser() // from Clerk
  const setUser = useUserStore((state) => state.setUser)
  const clearUser = useUserStore((state) => state.clearUser)
    const [openSignIn,setSignIn]=useState(false)
    const [isSignout,setisSingout]=useState(false)
    const { signOut } = useClerk()
    useEffect(() => {
        if (isLoaded && user) {
          setUser({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          })
        }
      }, [isLoaded, user])
  return (
    <>
    {user?.firstName?<div><p className={styles.btn} onClick={()=>{setisSingout(true)}}>Welcome {user?.firstName}</p>
    {isSignout&&<button className={styles.btn} onClick={async () => { await signOut()
    clearUser()
    setisSingout(false)
    }}>Sign Out</button>}
    </div>:
    <p className={styles.btn} onClick={()=>{setSignIn(true)}}>Log in/sign up</p>}
    {openSignIn&&<div className={styles.signInMod}>
        <SignIn routing="hash"
        />
        <button className={styles.Btn} onClick={()=>{setSignIn(false)}}>x</button>
    </div>}
    </>
  )
}

export default LoginUser