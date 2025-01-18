// app/api/translate/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/lib/db';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    try {
        const { text, id, targetLanguage = 'zh-CN' } = await request.json();

        if (!text || !id) {
            return NextResponse.json(
                { error: 'Text and record ID are required' },
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": "You are a professional translator specializing in English to Chinese translation. Provide accurate translations while maintaining the original meaning and style. For educational content, include relevant explanations and vocabulary notes."
                },
                {
                    "role": "user",
                    "content": `Translate the following English text to ${targetLanguage}. Keep the paragraph structure. 
          
Original text:
${text}
          
Please format your response as JSON with the following structure:
{
  "translation": "translated text",
  "notes": [
    {
      "term": "English term",
      "translation": "Chinese translation",
      "explanation": "Brief explanation or usage note"
    }
  ]
}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const translationResult = JSON.parse(response.choices[0].message.content);

        // Save translation to database
        const db = getDb();
        const updateResult = await db.query(
            `UPDATE tts_records 
             SET learning_guide = $1 
             WHERE id = $2
             RETURNING *`,
            [translationResult, id]
        );

        if (updateResult.rowCount === 0) {
            return NextResponse.json(
                { error: 'Record not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(translationResult);

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: 'Failed to translate text' },
            { status: 500 }
        );
    }
}