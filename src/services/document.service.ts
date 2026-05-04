import { Document } from '../models';
import { DOCUMENTS } from '../data/mock-data';

export interface DocumentServiceInterface {
  getDocuments(): Promise<Document[]>;
  getDocumentsForSession(sessionId: number): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | null>;
}

export const DocumentService: DocumentServiceInterface = {
  async getDocuments(): Promise<Document[]> {
    return [...DOCUMENTS];
  },

  async getDocumentsForSession(sessionId: number): Promise<Document[]> {
    return DOCUMENTS.filter((d) => d.sessionId === sessionId);
  },

  async getDocumentById(id: number): Promise<Document | null> {
    return DOCUMENTS.find((d) => d.id === id) ?? null;
  },
};
