export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type VoiceGenderType = 'MALE' | 'FEMALE' | 'NEUTRAL';

export interface TranslationNote {
  term: string;
  translation: string;
  explanation: string;
}

export interface Translation {
  translation: string;
  notes: TranslationNote[];
}

export interface TTSRecord {
  id: string;
  keyword: string;
  script: string;
  s3_url: string;
  language_code: string;
  difficulty: string;
  voice_name: string;
  voice_gender: string;
  created_at: string;
  updated_at?: string;
  learning_guide?: Translation; // Add this new field
}

export interface Database {
  public: {
    Tables: {
      tts_records: {
        Row: TTSRecord;
        Insert: Omit<TTSRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<TTSRecord, 'id' | 'created_at'>>;
      };
    };
    Enums: {
      difficulty_level: DifficultyLevel;
      voice_gender_type: VoiceGenderType;
    };
  };
} 