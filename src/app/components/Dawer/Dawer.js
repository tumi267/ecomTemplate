'use client'
import React from 'react'
import styles from './Dawer.module.css'
import Link from 'next/link'
import { useMenuStore } from '../../../app/libs/menu'

function Dawer() {
  const isOpen = useMenuStore((s) => s.isOpen)
  const closeMenu = useMenuStore((s) => s.closeMenu)

  return (
    <div className={isOpen ? styles.contain : styles.closed}>
      <div className={styles.drawer_box}>
        <button className={styles.btn} onClick={closeMenu}>x</button>
        <ul className={styles.link_contain}>

          {[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'T shirts', href: '/category/T-Shirts' },
            { label: 'Caps', href: '/category/Caps' },
            { label: 'Track Suits', href: '/category/Tracksuits' },
            { label: 'Cart', href: '/cart' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <li key={href} onClick={closeMenu}>
              <Link href={href} className={styles.links}>
                {label}
              </Link>
            </li>
          ))}

        </ul>
      </div>
    </div>
  )
}

export default Dawer
