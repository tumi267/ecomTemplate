'use client'
import React from 'react'
import styles from './Dawer.module.css'
import Link from 'next/link'
import { useMenuStore } from '@/app/libs/menu'
function Dawer() {
    const isOpen = useMenuStore((s) => s.isOpen)
  const closeMenu = useMenuStore((s) => s.closeMenu)
  const toggleMenu =useMenuStore((s)=>{s.toggleMenu})
  return (
    <div className={isOpen==true?styles.contain:styles.closed}>
        <div className={styles.drawer_box}>
            <button className={styles.btn} onClick={()=>{
                closeMenu()
            }}>x</button>
            <ul className={styles.link_contain}>
                <li>
                <Link href={'/'}
                className={styles.links}
                >Home</Link>
                </li>

                <li>
                <Link href={'/products'}
                className={styles.links}
                >Products</Link>
                </li>
                <li>
                <Link href={'/category/T-Shirts'}
                className={styles.links}
                >T shirts</Link>
                </li>
                <li>

                <Link href={'/category/Caps'}
                className={styles.links}
                >Caps</Link>
                </li>

                <li>
                <Link href={'/category/Tracksuits'}
                className={styles.links}
                >Track Suits</Link>
                </li>

                <li>
                <Link href={'/cart'}
                className={styles.links}
                >Cart</Link>
                </li>

                <li>
                <Link href={'/contact'}
                className={styles.links}
                >Contact</Link>
                </li>
            </ul>

        </div>
    </div>
  )
}

export default Dawer