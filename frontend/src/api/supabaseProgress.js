import { supabase } from './supabase'

/**
 * Sync user progress to Supabase `user_progress` table.
 * Falls back gracefully if table is not yet created in Supabase SQL editor.
 */
export async function saveUserProgressToSupabase({ userId, targetRole, completedSkills }) {
  if (!userId || !targetRole) return null

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          target_role: targetRole,
          completed_skills: completedSkills,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,target_role' }
      )
      .select()

    if (error) {
      console.warn('Supabase progress sync skipped (table may need setup):', error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn('Supabase sync error:', err)
    return null
  }
}

/**
 * Fetch user progress from Supabase `user_progress` table.
 */
export async function fetchUserProgressFromSupabase(userId, targetRole) {
  if (!userId || !targetRole) return null

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('completed_skills')
      .eq('user_id', userId)
      .eq('target_role', targetRole)
      .maybeSingle()

    if (error || !data) return null
    return data.completed_skills || []
  } catch {
    return null
  }
}
