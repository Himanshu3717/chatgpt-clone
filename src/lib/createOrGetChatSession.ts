import { supabase } from './supabase';

export async function createChatSession(userId: string, title = 'New Chat') {
  console.log('Creating chat session for user:', userId);
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat session:', error);
    throw new Error(error.message);
  }
  return data;
}

export async function getUserSessions(userId: string) {
  console.log('Getting sessions for user:', userId);
  
  // First, get the user's ID from the users table
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('auth0_id', userId)
    .single();

  if (userError) {
    console.error('Error finding user:', userError);
    throw new Error('User not found');
  }

  if (!user) {
    console.error('No user found for auth0_id:', userId);
    throw new Error('User not found');
  }

  // Then get the sessions for that user
  const { data: sessions, error: sessionsError } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (sessionsError) {
    console.error('Error getting sessions:', sessionsError);
    throw new Error(sessionsError.message);
  }

  console.log('Found sessions:', sessions);
  return sessions;
} 