import { TTSRecord, DifficultyLevel } from '@/types/database';
import { getDb } from '@/lib/db';

export async function getTTSRecords(
  page: number = 1,
  limit: number = 20,
  filters?: {
    language?: string;
    difficulty?: DifficultyLevel;
  }
): Promise<TTSRecord[]> {
  const offset = (page - 1) * limit;
  let query = `
    SELECT * FROM tts_records
    WHERE 1=1
  `;
  const values: any[] = [];
  let paramCount = 1;

  if (filters?.language) {
    query += ` AND language_code = $${paramCount}`;
    values.push(filters.language);
    paramCount++;
  }

  if (filters?.difficulty) {
    query += ` AND difficulty = $${paramCount}`;
    values.push(filters.difficulty);
    paramCount++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const db = getDb();
  console.log('Executing query:', query, 'with values:', values);
  const result = await db.query(query, values);
  console.log('Records from database:', result.rows.map(row => ({ id: row.id, keyword: row.keyword })));
  return result.rows;
}

export async function getTTSRecordById(id: string): Promise<TTSRecord | null> {
  const db = getDb();
  console.log('Fetching record with ID:', id);
  const result = await db.query(
    'SELECT * FROM tts_records WHERE id = $1',
    [id]
  );
  console.log('Query result:', result.rows[0]);
  return result.rows[0] || null;
}

export async function getLanguages(): Promise<string[]> {
  const db = getDb();
  const result = await db.query(
    'SELECT DISTINCT language_code FROM tts_records ORDER BY language_code'
  );
  return result.rows.map((row: { language_code: string }) => row.language_code);
}

export async function createTTSRecord(record: Omit<TTSRecord, 'id' | 'created_at'>): Promise<TTSRecord> {
  const db = getDb();
  const result = await db.query(
    `INSERT INTO tts_records 
      (keyword, script, s3_url, language_code, difficulty, voice_name, voice_gender) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      record.keyword,
      record.script,
      record.s3_url,
      record.language_code,
      record.difficulty,
      record.voice_name,
      record.voice_gender,
    ]
  );
  return result.rows[0];
}

export async function updateTTSRecord(
  id: string,
  record: Partial<Omit<TTSRecord, 'id' | 'created_at'>>
): Promise<TTSRecord | null> {
  const fields = Object.keys(record);
  if (fields.length === 0) return null;

  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
  const values = fields.map(field => (record as any)[field]);

  const db = getDb();
  const result = await db.query(
    `UPDATE tts_records 
    SET ${setClause} 
    WHERE id = $1 
    RETURNING *`,
    [id, ...values]
  );

  return result.rows[0] || null;
} 