export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type VoiceGenderType = 'MALE' | 'FEMALE' | 'NEUTRAL';

export interface TTSRecord {
  id: string;
  keyword: string;
  script: string;
  s3_url: string;
  language_code: string;
  difficulty: DifficultyLevel;
  voice_name: string;
  voice_gender: VoiceGenderType;
  created_at: string;
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