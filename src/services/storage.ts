import { Message } from './api';
import { supabase } from './supabase';

export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class ChatStorage {
  static async saveConversation(conversation: SavedConversation): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversation.id)
        .maybeSingle();

      const conversationData = {
        id: conversation.id,
        user_id: 'default-user',
        title: conversation.title,
        messages: conversation.messages,
        created_at: conversation.createdAt.toISOString(),
        updated_at: conversation.updatedAt.toISOString(),
      };

      if (existing) {
        await supabase
          .from('conversations')
          .update(conversationData)
          .eq('id', conversation.id);
      } else {
        await supabase
          .from('conversations')
          .insert(conversationData);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  static async getAllConversations(): Promise<SavedConversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', 'default-user')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((conv: any) => ({
        id: conv.id,
        title: conv.title,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.created_at),
        updatedAt: new Date(conv.updated_at),
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  static async getConversation(id: string): Promise<SavedConversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        messages: data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  static async deleteConversation(id: string): Promise<void> {
    try {
      await supabase
        .from('conversations')
        .delete()
        .eq('id', id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }

  static generateConversationTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (!firstUserMessage || !firstUserMessage.content) return 'Nuova Conversazione';

    const title = firstUserMessage.content.slice(0, 50);
    return title.length < firstUserMessage.content.length ? title + '...' : title;
  }
}
