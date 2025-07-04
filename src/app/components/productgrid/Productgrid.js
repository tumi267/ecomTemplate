'use client'
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
  } from "../../../components/ui/card.jsx"
import { Button } from "../../../components/ui/button"
import Image from 'next/image.js'
import styles from './ProductGrid.module.css'
import Link from 'next/link.js'
import AddToCartButton from '../AddToCartButton/AddToCartButton.js'
function ProductGrid({title,items,selector}) {
  const [cardinfo, setcardinfo] = useState([]);

 useEffect(()=>{
  if(selector){
    const seller=items.find((e)=>{return e.name==selector})
    setcardinfo(seller?.items);
   }else{
    setcardinfo(items)
   }
 }
 ,[items])

// add to cart
const regex = (text, numWords) => {
    if (!text) return '';
    // Split by whitespace and filter out empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    // Return the first numWords words joined back together
    return words.slice(0, numWords).join(' ') + (words.length > numWords ? '...' : '');
  };
  return (
    <div>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.card_contain}>
        {cardinfo?.map((e,i)=>{
        return<Card key={i} className={styles.card}>
        <Link href={`/products/${e.name}`} className={styles.link}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>{e.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.image_wrapper}>
              <Image src='/next.svg' alt={e.name} fill />
            </div>
          </CardContent>
        </Link>
      
        <CardDescription className={styles.description}>
          {regex(e.description, 7)}
        </CardDescription>
      
        <AddToCartButton product={e} />
      
        <CardDescription className={styles.price}>R {e.price}</CardDescription>
      </Card>
        })}
        </div>
    </div>
  )
}

export default ProductGrid