'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from './NavAdmin.module.css'
function NavAdmin() {
    const links=['dashboard','category','products','customers','sales','orders']
    const [isMounted, setIsMounted] = useState(false)
    const [showNav, setShowNav] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    useEffect(() => {
        setIsMounted(true)
    
        const handleScroll = () => {
          const currentScrollY = window.scrollY
    
          if (currentScrollY > lastScrollY && currentScrollY > 60) {
            setShowNav(false) // scrolling down
          } else {
            setShowNav(true) // scrolling up
          }
    
          setLastScrollY(currentScrollY)
        }
    
        window.addEventListener('scroll', handleScroll)
    
        return () => {
          window.removeEventListener('scroll', handleScroll)
        }
      }, [lastScrollY])
  return (
 
        <ul className={styles.contain}>{links.map((e,i)=>{
        return <li key={i}>
            <Link className={styles.links} href={e=='dashboard'?'/admin':`/admin/${e}`}>{e.toUpperCase()}</Link>
            </li>
    })}
    </ul>
  
  )
}

export default NavAdmin