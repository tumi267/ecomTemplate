import Image from 'next/image'
import db from './libs/db.json'
import Hero from './components/hero/Hero'
import ClassicGrid from './components/classicgrid/ClassicGrid'
import ProductGrid from './components/productgrid/Productgrid'
export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    <ClassicGrid
    title='Categories'
    items={db.categories}
    prod={false}
    />
    <ProductGrid
    title='Best Sellers'
    items={db.categories}
    selector='Caps'
    />
    </main>
  )
}
