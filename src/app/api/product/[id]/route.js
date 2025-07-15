import { NextResponse } from 'next/server'
import { updateProduct, deleteProduct } from '../../../libs/product'

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
