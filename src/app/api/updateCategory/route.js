// app/api/updatecategory/route.ts
import { NextResponse } from 'next/server'
import { updateCategory } from '../../libs/category'

export async function PUT(req) {
  const body = await req.json()
  const { id, name, description,image } = body

  if (!id || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
const imagePath=image
  try {
    const updated = await updateCategory(id, { name, description,imagePath })
    return NextResponse.json(updated)
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

