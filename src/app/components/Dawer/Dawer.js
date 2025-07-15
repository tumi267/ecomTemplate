'use client'

import React, { useEffect } from 'react'
import styles from './Dawer.module.css'
import Link from 'next/link'
import { useMenuStore } from '../../../app/libs/menu'

function Dawer() {
  // Destructure everything at once from the store
  const {
    isOpen,
    closeMenu,
    categories,
    fetchCategories,
    loading,
    error,
  } = useMenuStore()

  // Fetch categories on first load
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [fetchCategories, categories.length])

  // Build the full menu items (with fallback)
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(
      Array.isArray(categories)
        ? categories.map((e) => ({ label: e.name, href: `/category/${e.name}?id=${e.id}` }))
        : []
    ),
    { label: 'Cart', href: '/cart' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <div className={isOpen ? styles.contain : styles.closed}>
      <div className={styles.drawer_box}>
        <button className={styles.btn} onClick={closeMenu}>x</button>

        {loading && <p className="text-sm text-gray-500 px-4">Loading categories...</p>}
        {error && <p className="text-sm text-red-500 px-4">Error: {error}</p>}

        <ul className={styles.link_contain}>
          {menuItems.map(({ label, href }) => (
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
