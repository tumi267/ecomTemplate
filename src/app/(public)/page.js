
import Image from 'next/image'
import db from '../libs/db.json'
import Hero from '../components/hero/Hero'
import ClassicGrid from '../components/classicgrid/ClassicGrid'
import ProductGrid from '../components/productgrid/Productgrid'
import { getCategory } from '../libs/category'
import {getHeroes} from '../libs/hero'
import { getBestSellers, getWeekSales } from '../libs/product'
export default async function Home() {
 const categories =await getCategory()
 const bestSellers =await getBestSellers()
 const weekSale = await getWeekSales()
 const heros =await getHeroes()
 let hero1 = heros.find(e => e.id === 1);
 let hero2 = heros.find(e => e.id === 2);
 let hero3 = heros.find(e => e.id === 3);
 let hero4 = heros.find(e => e.id === 4);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Hero
    src={hero1?.imageUrl?hero1.imageUrl:'/next.svg'}
    alt={hero1?.altText?hero1.altText:'/next.svg'}
    />
    <ClassicGrid
    title='Categories'
    items={categories}
    prod={false}
    />
    <Hero
    src={hero2?.imageUrl?hero2.imageUrl:'/next.svg'}
    alt={hero2?.altText?hero2.altText:'/next.svg'}
    />
    <ProductGrid
    title='Best Sellers'
    items={bestSellers}
    selector='best seller'
    />
    <Hero
    src={hero3?.imageUrl?hero3.imageUrl:'/next.svg'}
    alt={hero3?.altText?hero3.altText:'/next.svg'}
    />
    <ProductGrid
    title='weekly sale'
    items={weekSale}
    selector='week sale'
    />
    <Hero
    src={hero4?.imageUrl?hero4.imageUrl:'/next.svg'}
    alt={hero4?.altText?hero4.altText:'/next.svg'}
    />
    </main>
  )
}
