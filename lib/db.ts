import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface Form {
  id: string;
  user_id: string | null;
  name: string;
  slug: string | null;
  yaml_config: string;
  webhook_url: string | null;
  theme: string | null;  // Added for theme support
  generate_invoice: boolean;  // Enable invoice generation for this form
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Submission {
  id: string;
  form_id: string;
  answers: Record<string, any>;
  metadata?: Record<string, any>;
  submitted_at: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  company_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export const db = {
  // Get form by ID (public - for form filling)
  async getForm(id: string): Promise<Form | null> {
    try {
      const result = await sql`
        SELECT * FROM forms
        WHERE id = ${id} AND is_active = true
        LIMIT 1
      `;
      return (result[0] as Form) || null;
    } catch (error) {
      console.error('Error fetching form:', error);
      return null;
    }
  },

  // Get form by slug
  async getFormBySlug(slug: string): Promise<Form | null> {
    try {
      const result = await sql`
        SELECT * FROM forms
        WHERE slug = ${slug} AND is_active = true
        LIMIT 1
      `;
      return (result[0] as Form) || null;
    } catch (error) {
      console.error('Error fetching form by slug:', error);
      return null;
    }
  },

  // Get all forms for a specific user
  async getAllForms(userId: string): Promise<Form[]> {
    try {
      const result = await sql`
        SELECT * FROM forms
        WHERE is_active = true AND user_id = ${userId}
        ORDER BY created_at DESC
      `;
      return result as Form[];
    } catch (error) {
      console.error('Error fetching forms:', error);
      return [];
    }
  },

  // Create new form with user_id
  async createForm(data: {
    user_id: string;
    name: string;
    slug?: string;
    yaml_config: string;
    webhook_url?: string;
    theme?: string;
    generate_invoice?: boolean;
  }): Promise<Form | null> {
    try {
      const result = await sql`
        INSERT INTO forms (user_id, name, slug, yaml_config, webhook_url, theme, generate_invoice)
        VALUES (${data.user_id}, ${data.name}, ${data.slug || null}, ${data.yaml_config}, ${data.webhook_url || null}, ${data.theme || 'dark'}, ${data.generate_invoice || false})
        RETURNING *
      `;
      return (result[0] as Form) || null;
    } catch (error) {
      console.error('Error creating form:', error);
      return null;
    }
  },

  // Update form (must be owner)
  async updateForm(id: string, userId: string, data: {
    name?: string;
    slug?: string;
    yaml_config?: string;
    webhook_url?: string;
    theme?: string;
    generate_invoice?: boolean;
  }): Promise<Form | null> {
    try {
      // First get the current form
      const current = await sql`
        SELECT * FROM forms
        WHERE id = ${id} AND user_id = ${userId}
        LIMIT 1
      `;

      if (!current || current.length === 0) {
        return null;
      }

      // Apply updates
      const updated = {
        name: data.name !== undefined ? data.name : current[0].name,
        slug: data.slug !== undefined ? data.slug : current[0].slug,
        yaml_config: data.yaml_config !== undefined ? data.yaml_config : current[0].yaml_config,
        webhook_url: data.webhook_url !== undefined ? data.webhook_url : current[0].webhook_url,
        theme: data.theme !== undefined ? data.theme : current[0].theme,
        generate_invoice: data.generate_invoice !== undefined ? data.generate_invoice : current[0].generate_invoice,
      };

      const result = await sql`
        UPDATE forms
        SET
          name = ${updated.name},
          slug = ${updated.slug},
          yaml_config = ${updated.yaml_config},
          webhook_url = ${updated.webhook_url},
          theme = ${updated.theme},
          generate_invoice = ${updated.generate_invoice},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      return (result[0] as Form) || null;
    } catch (error) {
      console.error('Error updating form:', error);
      return null;
    }
  },

  // Delete form (must be owner)
  async deleteForm(id: string, userId: string): Promise<boolean> {
    try {
      await sql`
        UPDATE forms 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id} AND user_id = ${userId}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      return false;
    }
  },

  // Verify form ownership
  async verifyFormOwnership(formId: string, userId: string): Promise<boolean> {
    try {
      const result = await sql`
        SELECT COUNT(*) as count FROM forms
        WHERE id = ${formId} AND user_id = ${userId} AND is_active = true
      `;
      return parseInt(result[0]?.count || '0') > 0;
    } catch (error) {
      console.error('Error verifying form ownership:', error);
      return false;
    }
  },

  // Create submission
  async createSubmission(data: {
    form_id: string;
    answers: Record<string, any>;
    metadata?: Record<string, any>;
  }): Promise<Submission | null> {
    try {
      const result = await sql`
        INSERT INTO submissions (form_id, answers, metadata)
        VALUES (${data.form_id}, ${JSON.stringify(data.answers)}, ${JSON.stringify(data.metadata || {})})
        RETURNING *
      `;
      return (result[0] as Submission) || null;
    } catch (error) {
      console.error('Error creating submission:', error);
      return null;
    }
  },

  // Get submissions for a form (must be owner)
  async getSubmissions(formId: string, userId: string, limit: number = 100): Promise<Submission[]> {
    try {
      // First verify ownership
      const isOwner = await this.verifyFormOwnership(formId, userId);
      if (!isOwner) {
        return [];
      }

      const result = await sql`
        SELECT * FROM submissions
        WHERE form_id = ${formId}
        ORDER BY submitted_at DESC
        LIMIT ${limit}
      `;
      return result as Submission[];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },

  // Get submission count for a form
  async getSubmissionCount(formId: string, userId: string): Promise<number> {
    try {
      // First verify ownership
      const isOwner = await this.verifyFormOwnership(formId, userId);
      if (!isOwner) {
        return 0;
      }

      const result = await sql`
        SELECT COUNT(*) as count FROM submissions
        WHERE form_id = ${formId}
      `;
      return parseInt(result[0]?.count || '0');
    } catch (error) {
      console.error('Error counting submissions:', error);
      return 0;
    }
  },

  // Get user profile by user_id
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const result = await sql`
        SELECT * FROM user_profiles
        WHERE user_id = ${userId}
        LIMIT 1
      `;
      return (result[0] as UserProfile) || null;
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
      return (result[0] as UserProfile) || null;
    } catch (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }
  }
};
