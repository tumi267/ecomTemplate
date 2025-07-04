'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import db from '../../libs/db.json'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '../../../components/ui/button'
import AddToCartButton from '@/app/components/AddToCartButton/AddToCartButton'
import styles from './product.module.css'

function Page() {
  const params = useParams()
  const regex = (text) => decodeURIComponent(text)
  const [prodinfo, setprodinfo] = useState([])

  useEffect(() => {
    const items = db.categories.flatMap((e) => e.items)
    const item = items.find((e) => e.name === regex(params.id))
    setprodinfo(item)
  }, [params])

  return (
<div className={styles.productPage}>
  <h1 className={styles.title}>{regex(params.id)}</h1>

  <div className={styles.productGrid}>
    {/* LEFT: Image */}
    <div className={styles.imageBox}>
      {/* Replace with real product image if available */}
      <img src="/next.svg" alt={regex(params.id)} className={styles.image} />
    </div>

    {/* RIGHT: Details Accordion */}
    <div className={styles.detailsBox}>
      <Accordion type="single" collapsible className={styles.accordion}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>{prodinfo?.description}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>R {prodinfo?.price}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Sizes</AccordionTrigger>
          <AccordionContent className={styles.options}>
            {prodinfo?.sizes?.map((e, i) => (
              <Button key={i} variant="outline" className={styles.optionBtn}>
                {e}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent className={styles.options}>
            {prodinfo?.colors?.map((e, i) => (
              <Button key={i} variant="outline" className={styles.optionBtn}>
                {e}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className={styles.cartBtn}>
        <AddToCartButton product={prodinfo} />
      </div>
    </div>
  </div>
</div>

  )
}

export default Page
