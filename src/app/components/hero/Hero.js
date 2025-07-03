import Image from 'next/image'
import React from 'react'
import styles from './Hero.module.css'
function Hero({src,alt}) {
  return (
    <div className={styles.hero_contain}>
      
      <Image src={src} alt={alt} fill/>
    </div>
  )
}

export default Hero