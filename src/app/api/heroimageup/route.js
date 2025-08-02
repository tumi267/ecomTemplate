import { NextResponse } from 'next/server';
import { createHeroes, updateHero } from '../../libs/category';

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, imageUrl, altText, position } = body;

    // Validate payload
    if (!imageUrl || !altText || typeof position !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let result;

    try {
      // Attempt update first
      result = await updateHero({ id, imageUrl, altText, position });
      console.log('Hero updated:', result);
    } catch (updateError) {
      console.warn('Update failed, attempting to create:', updateError);

      // Fallback to create
      result = await createHeroes({ imageUrl, altText, position });
      console.log('Hero created:', result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('POST handler error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
