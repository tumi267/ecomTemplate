// app/api/updatecategory/route.ts
import { NextResponse } from 'next/server'
import { updateCategory } from '../../libs/category'

export async function PUT(req) {
  const body = await req.json()
  const { id, name, description } = body

  console.log(name, description, id)

  if (!id || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const updated = await updateCategory(id, { name, description })
    return NextResponse.json(updated)
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

