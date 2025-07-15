import { NextResponse } from 'next/server'
import { updateProduct, deleteProduct, getSingleProduct } from '../../../libs/product'


export async function GET(req,
 { params}){
  const { id } = params

  try {
    const product = await getSingleProduct(id)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  } 
}
export async function PUT(req, { params }) {
  const body = await req.json()
  const { id } = params

  try {
    const updated = await updateProduct(id, body)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  const { id } = params

  try {
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
