// /app/api/variants/[id]/route.ts
import { NextResponse } from 'next/server'
import {
  getVariantById,
  updateVariant,
  deleteVariant,
} from '../../../libs/product'

// GET /api/variants/[id]
export async function GET(req, { params }) {
  try {
    const variant = await getVariantById(params.id)
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }
    return NextResponse.json(variant)
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching variant' }, { status: 500 })
  }
}

// PUT /api/variants/[id]
export async function PUT(req, { params }) {
  try {
    const data = await req.json()

    const updated = await updateVariant(params.id, data)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 })
  }
}

// DELETE /api/variants/[id]
export async function DELETE(req, { params }) {
  try {
    const deleted = await deleteVariant(params.id)
    return NextResponse.json(deleted)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 })
  }
}
