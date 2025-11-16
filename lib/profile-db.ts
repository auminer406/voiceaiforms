import { neon } from '@neondatabase/serverless';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  company_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export const profileDb = {
  // Get user profile by user_id
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const result = await sql`
        SELECT * FROM user_profiles
        WHERE user_id = ${userId}
        LIMIT 1
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Create or update user profile
  async upsertUserProfile(data: {
    user_id: string;
    email: string;
    company_name?: string;
  }): Promise<UserProfile | null> {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const result = await sql`
        INSERT INTO user_profiles (user_id, email, company_name)
        VALUES (${data.user_id}, ${data.email}, ${data.company_name || null})
        ON CONFLICT (user_id)
        DO UPDATE SET
          email = EXCLUDED.email,
          company_name = EXCLUDED.company_name,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }
  }
};
