import Image from 'next/image'
import db from '../libs/db.json'
import Hero from '../components/hero/Hero'
import ClassicGrid from '../components/classicgrid/ClassicGrid'
import ProductGrid from '../components/productgrid/Productgrid'
import { getCategory } from '../libs/category'
import { getBestSellers, getWeekSales } from '../libs/product'
export default async function Home() {
 const categories =await getCategory()
 const bestSellers =await getBestSellers()
 const weekSale = await getWeekSales()
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    <ClassicGrid
    title='Categories'
    items={categories}
    prod={false}
    />
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    <ProductGrid
    title='Best Sellers'
    items={bestSellers}
    selector='best seller'
    />
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    <ProductGrid
    title='weekly sale'
    items={weekSale}
    selector='week sale'
    />
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    </main>
  )
}
