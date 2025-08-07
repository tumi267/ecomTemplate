// /app/api/import/categories/route.js
import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { UniqueCategory, createCategory, updateCategory } from '../../../libs/category'

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
      const { name, description, imagePath } = record

      if (!name) continue // skip invalid entries
      const exist=await UniqueCategory(name)
      const data = {
        name,
        description: description || null,
        imagePath: imagePath || null,
      }

      if (exist) {
        let {id}=exist
        if (data.imagePath==null){
            data.imagePath=exist.imagePath
            await updateCategory(id, data)
        }else{
            await updateCategory(id, data)
        }
      } else {
        await createCategory(data)
      }

      importedCount++
    }

    return NextResponse.json({ message: `Imported ${importedCount} categories` })
  } catch (error) {
    console.error('Category import error:', error)
    return NextResponse.json({ error: 'Failed to import categories' }, { status: 500 })
  }
}