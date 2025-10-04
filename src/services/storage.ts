import { Message } from './api';
import { supabase } from '@/integrations/supabase/client';

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
        .from('chats')
        .select('id')
        .eq('id', conversation.id)
        .maybeSingle();

      const chatData = {
        user_id: user.id,
        title: conversation.title,
        updated_at: new Date().toISOString(),
      };

      let chatId = conversation.id;

      if (existing) {
        await supabase
          .from('chats')
          .update(chatData)
          .eq('id', conversation.id);
      } else {
        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({ 
            ...chatData, 
            id: conversation.id,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (error) throw error;
        if (newChat) chatId = newChat.id;
      }

      const { data: existingMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_id', chatId);

      const existingCount = existingMessages?.length || 0;
      const newMessages = conversation.messages.slice(existingCount);

      if (newMessages.length > 0) {
        const messagesToInsert = newMessages.map(msg => ({
          chat_id: chatId,
          user_id: user.id,
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
        .from('chats')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map((chat: any) => ({
        id: chat.id,
        title: chat.title,
        messages: [],
        createdAt: new Date(chat.created_at),
        updatedAt: new Date(chat.updated_at),
      }));
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  static async getConversation(id: string): Promise<SavedConversation | null> {
    try {
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('id, title, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (chatError || !chatData) return null;

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('role, content, created_at')
        .eq('chat_id', id)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      return {
        id: chatData.id,
        title: chatData.title,
        messages: (messages || []).map((msg: DBMessage) => ({
          id: Math.random().toString(36),
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        })),
        createdAt: new Date(chatData.created_at),
        updatedAt: new Date(chatData.updated_at),
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  static async deleteConversation(id: string): Promise<void> {
    try {
      // Delete messages first (due to foreign key)
      await supabase
        .from('messages')
        .delete()
        .eq('chat_id', id);

      // Then delete the chat
      await supabase
        .from('chats')
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
