export type DocumentType = 'course' | 'correction' | 'exercise' | 'summary';

export interface Document {
  id: number;
  title: string;
  type: DocumentType;
  sessionId: number;
  sessionTitle: string;
  subject: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: string;
  fileName: string;
  restricted: boolean;
}
