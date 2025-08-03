'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Nav.module.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartStore } from '../../libs/store'
import { useMenuStore } from '../../../app/libs/menu';
import MouseOverCart from '../mouseOverCart/MouseOverCart';
import LoginUser from '../LoginUser/LoginUser'

function Nav() {
  const [isMounted, setIsMounted] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const hoverTimeout = useRef(null)

  const openMenu = useMenuStore((s) => s.openMenu)

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )

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
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current)
    setShowCartPreview(true)
  }

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowCartPreview(false)
    }, 1000) // 1 seconds delay
  }
  return (
    <div className={`${styles.nav_contain} ${!showNav ? styles.hide : ''}`}>
      <ul className={styles.nav_links_contain}>
        <li><button className={styles.link} 
        onClick={()=>{openMenu()}}>menu</button></li>
        <span className={styles.right_nav}>
          <LoginUser/>
          <span className={styles.cart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
            <Link href={'/cart'}>
              <ShoppingCartIcon sx={{ color: 'aliceblue' }} />
              <span className={styles.link_2}>{totalItems}</span>
            </Link>
            {showCartPreview && <MouseOverCart />}
          </span>
        </span>
      </ul>
    </div>
  )
}

export default Nav
