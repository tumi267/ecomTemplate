'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from './Nav.module.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartStore } from '../../libs/store'

function Nav() {
  const [isMounted, setIsMounted] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

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

  return (
    <div className={`${styles.nav_contain} ${!showNav ? styles.hide : ''}`}>
      <ul className={styles.nav_links_contain}>
        <li><Link className={styles.link} href={'/'}>Home</Link></li>
        <span className={styles.right_nav}>
          <li><Link className={styles.link} href={'/products'}>Products</Link></li>
          <li><Link className={styles.link} href={'/contact'}>Contact</Link></li>
          <span className={styles.cart}>
            <Link href={'/cart'}>
              <ShoppingCartIcon sx={{ color: 'aliceblue' }} />
              <span className={styles.link_2}>{totalItems}</span>
            </Link>
          </span>
        </span>
      </ul>
    </div>
  )
}

export default Nav
