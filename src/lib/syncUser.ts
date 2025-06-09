import { supabase } from './supabase';

export async function syncUser(auth0User: {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}) {
  // First, try to get the existing user
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('auth0_id', auth0User.sub)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw new Error(fetchError.message);
  }

  if (existingUser) {
    return existingUser;
  }

  // If user doesn't exist, create them
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      auth0_id: auth0User.sub,
      email: auth0User.email || '',
      name: auth0User.name || '',
      picture: auth0User.picture || '',
    })
    .select('id')
    .single();

  if (insertError) throw new Error(insertError.message);
  return newUser;
} 