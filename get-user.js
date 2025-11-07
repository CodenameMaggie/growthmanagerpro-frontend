const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    console.log('[Get User] Fetching user:', userId);

    // Get user (excluding password for security)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, status, user_type, advisor_id, permissions, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      console.error('[Get User] Error:', error);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('[Get User] User found:', user.email);

    return res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('[Get User] Server error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};
