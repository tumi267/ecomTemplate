import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { UniqueSupplier, createSupplier, updateSupplier } from '../../../libs/suppliers'

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
      columns: true,       // Use header row as keys
      skip_empty_lines: true,
    })

    let importedCount = 0

    for (const record of records) {
      const { name, email, phone, address, notes } = record
      let exists=await UniqueSupplier(email)
      if (exists) {
        const {id} = exists
        await updateSupplier(id, { name, email, phone, address, notes })
      } else {
        
        await createSupplier({ name, email, phone, address, notes })
      }
      importedCount++
    }

    return NextResponse.json({ message: `Imported ${importedCount} suppliers` })
  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json({ error: 'Failed to import CSV' }, { status: 500 })
  }
}