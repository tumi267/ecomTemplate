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
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    <ProductGrid
    title='Best Sellers'
    items={db.categories}
    selector='best seller'
    />
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    <ProductGrid
    title='weekly sale'
    items={db.categories}
    selector='week sale'
    />
    <Hero
    src={'/next.svg'}
    alt={'hero'}
    />
    </main>
  )
}
