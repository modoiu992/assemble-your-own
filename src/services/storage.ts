import { Message } from './api';

export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class ChatStorage {
  private static readonly STORAGE_KEY = 'ai-drive-chats';

  static saveConversation(conversation: SavedConversation): void {
    try {
      const conversations = this.getAllConversations();
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  static getAllConversations(): SavedConversation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const conversations = JSON.parse(stored);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  static getConversation(id: string): SavedConversation | null {
    const conversations = this.getAllConversations();
    return conversations.find(c => c.id === id) || null;
  }

  static deleteConversation(id: string): void {
    try {
      const conversations = this.getAllConversations();
      const filtered = conversations.filter(c => c.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  static generateConversationTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (!firstUserMessage) return 'Nuova Conversazione';
    
    const title = firstUserMessage.content.slice(0, 50);
    return title.length < firstUserMessage.content.length ? title + '...' : title;
  }
}
