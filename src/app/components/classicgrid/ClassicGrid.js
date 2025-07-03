'use client'
import React from 'react'
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
  } from "../../../components/ui/card.jsx"
import Image from 'next/image.js'
import styles from './ClassicGrid.module.css'
import Link from 'next/link.js'
function ClassicGrid({title,items}) {
  return (
    <div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.card_contain}>
        {items.map((e,i)=>{
        return<Card key={i} className={styles.card}>
          <div className={styles.overlay}/>
          <Link className={styles.card_link} href={`/category/${e.name}`}>
          <div className={styles.image_wrapper}>
          <Image src='/next.svg' alt={e.name} fill />
          <CardTitle className={styles.cardTitle}>{e.name}</CardTitle>
          </div>
          </Link>
          </Card>
        })}
        </div>
    </div>
  )
}

export default ClassicGrid