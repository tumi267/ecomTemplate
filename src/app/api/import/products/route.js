// /app/api/import/products/route.js
import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { uniqeProduct, createProduct, updateProduct, findCategoryByName, findSupplierByEmail } from '../../../libs/product'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const csvText = new TextDecoder('utf-8').decode(arrayBuffer)

    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    })

    let importedCount = 0

    for (const record of records) {
      const {
        name,
        sku,
        description,
        imagePath,
        price,
        cost,
        qty,
        category,        // name of the category
        supplierEmail,   // to link to supplier
        trackQty,
        bestSeller,
        weekSale,
        discount,
      } = record

      if (!name || !sku || !price || !qty || !category) continue // required fields

      const categoryRecord = await findCategoryByName(category)
      if (!categoryRecord) continue // skip if category not found

      let supplierId = null
      if (supplierEmail) {
        const supplier = await findSupplierByEmail(supplierEmail)
        if (supplier) supplierId = supplier.id
      }

      const productData = {
        name,
        sku,
        description: description || '',
        imagePath: imagePath || null,
        categoryId: categoryRecord.id,
        supplierId,

        price: parseFloat(price),
        cost: cost ? parseFloat(cost) : 0,
        qty: parseInt(qty),
        currency: 'ZAR',

        trackQty: trackQty === 'true' || false,
        bestSeller: bestSeller === 'true' || false,
        weekSale: weekSale === 'true' || false,
        discount: discount ? parseFloat(discount) : 0,
      }

      const existing = await uniqeProduct(sku)

      if (existing) {
        // Preserve image if missing in CSV
        if (!productData.imagePath) {
          productData.imagePath = existing.imagePath
        }
        await updateProduct(existing.id, productData)
      } else {
        await createProduct(productData)
      }

      importedCount++
    }

    return NextResponse.json({ message: `Imported ${importedCount} products` })
  } catch (error) {
    console.error('Product import error:', error)
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 })
  }
}
