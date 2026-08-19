import { Injectable } from '@nestjs/common';

export interface GenerationRecord {
  id: string;
  userId: string;
  personImageUrl: string;
  clothingImageUrl: string;
  clothingCategory: string;
  resultImageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class GenerationHistoryService {
  private generations = new Map<string, GenerationRecord>();

  save(record: GenerationRecord) {
    this.generations.set(record.id, record);
  }

  findById(id: string): GenerationRecord | undefined {
    return this.generations.get(id);
  }

  findByUserId(userId: string): GenerationRecord[] {
    return Array.from(this.generations.values())
      .filter((g) => g.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  delete(id: string, userId: string): boolean {
    const record = this.generations.get(id);
    if (!record || record.userId !== userId) return false;
    this.generations.delete(id);
    return true;
  }

  update(id: string, updates: Partial<GenerationRecord>) {
    const record = this.generations.get(id);
    if (record) {
      Object.assign(record, updates, { updatedAt: new Date().toISOString() });
    }
  }
}
