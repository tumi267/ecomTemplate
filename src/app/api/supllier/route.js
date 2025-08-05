import { NextResponse } from 'next/server'
import { createSupplier, getSingleSupplier, updateSupplier } from '../../libs/suppliers'
import { updateProduct } from '../../libs/product' // Make sure this import exists and is correct

// Get supplier by ID
export async function POST(req) {
  try {
    const body = await req.json()
    const { id } = body

    const res = await getSingleSupplier(id)
    return NextResponse.json(res)
  } catch (error) {
    console.error('Error in GET supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update or create supplier, then update linked product
export async function PUT(req) {
  try {
    const body = await req.json()
    const { id, suplierdata, product } = body

    // Clone and prepare data
    const supplierData = { ...suplierdata }
    let productData = { ...product }

    // Create or update supplier
    const supplierRes = id
      ? await updateSupplier(id, supplierData)
      : await createSupplier(supplierData)

    // Update product with the new or existing supplier ID
    if (product?.id) {
      productData.supplierId = supplierRes.id
      delete productData.category;
      delete productData.variants;
      await updateProduct(product.id, productData)
    }

    return NextResponse.json({ supplier: supplierRes })
  } catch (error) {
    console.error('Error in PUT supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
