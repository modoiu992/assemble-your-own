import { Message } from './api';
import { supabase } from './supabase';

export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface DBMessage {
  role: string;
  content: string;
  created_at: string;
}

export class ChatStorage {
  static async saveConversation(conversation: SavedConversation): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        return;
      }

      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversation.id)
        .maybeSingle();

      const conversationData = {
        user_id: user.id,
        title: conversation.title,
        updated_at: new Date().toISOString(),
      };

      let convId = conversation.id;

      if (existing) {
        await supabase
          .from('conversations')
          .update(conversationData)
          .eq('id', conversation.id);
      } else {
        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert({ ...conversationData, id: conversation.id })
          .select('id')
          .single();

        if (error) throw error;
        if (newConv) convId = newConv.id;
      }

      const { data: existingMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', convId);

      const existingCount = existingMessages?.length || 0;
      const newMessages = conversation.messages.slice(existingCount);

      if (newMessages.length > 0) {
        const messagesToInsert = newMessages.map(msg => ({
          conversation_id: convId,
          role: msg.role,
          content: msg.content,
          created_at: msg.timestamp.toISOString(),
        }));

        await supabase
          .from('messages')
          .insert(messagesToInsert);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  static async getAllConversations(): Promise<SavedConversation[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((conv: any) => ({
        id: conv.id,
        title: conv.title,
        messages: [],
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
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id, title, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (convError || !convData) return null;

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('role, content, created_at')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      return {
        id: convData.id,
        title: convData.title,
        messages: (messages || []).map((msg: DBMessage) => ({
          id: Math.random().toString(36),
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        })),
        createdAt: new Date(convData.created_at),
        updatedAt: new Date(convData.updated_at),
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
