import { sql } from '@vercel/postgres';

export interface Form {
  id: string;
  user_id: string | null;
  name: string;
  slug: string | null;
  yaml_config: string;
  webhook_url: string | null;
  theme: string | null;  // Added for theme support
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

export const db = {
  // Get form by ID (public - for form filling)
  async getForm(id: string): Promise<Form | null> {
    try {
      const result = await sql<Form>`
        SELECT * FROM forms 
        WHERE id = ${id} AND is_active = true
        LIMIT 1
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching form:', error);
      return null;
    }
  },

  // Get form by slug
  async getFormBySlug(slug: string): Promise<Form | null> {
    try {
      const result = await sql<Form>`
        SELECT * FROM forms 
        WHERE slug = ${slug} AND is_active = true
        LIMIT 1
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching form by slug:', error);
      return null;
    }
  },

  // Get all forms for a specific user
  async getAllForms(userId: string): Promise<Form[]> {
    try {
      const result = await sql<Form>`
        SELECT * FROM forms 
        WHERE is_active = true AND user_id = ${userId}
        ORDER BY created_at DESC
      `;
      return result.rows;
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
    theme?: string;  // Added theme parameter
  }): Promise<Form | null> {
    try {
      const result = await sql<Form>`
        INSERT INTO forms (user_id, name, slug, yaml_config, webhook_url, theme)
        VALUES (${data.user_id}, ${data.name}, ${data.slug || null}, ${data.yaml_config}, ${data.webhook_url || null}, ${data.theme || 'dark'})
        RETURNING *
      `;
      return result.rows[0] || null;
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
    theme?: string;  // Added theme parameter
  }): Promise<Form | null> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (data.name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(data.name);
      }
      if (data.slug !== undefined) {
        updates.push(`slug = $${paramCount++}`);
        values.push(data.slug);
      }
      if (data.yaml_config !== undefined) {
        updates.push(`yaml_config = $${paramCount++}`);
        values.push(data.yaml_config);
      }
      if (data.webhook_url !== undefined) {
        updates.push(`webhook_url = $${paramCount++}`);
        values.push(data.webhook_url);
      }
      if (data.theme !== undefined) {
        updates.push(`theme = $${paramCount++}`);
        values.push(data.theme);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);
      values.push(id);

      const query = `
        UPDATE forms 
        SET ${updates.join(', ')}
        WHERE user_id = $${paramCount++} AND id = $${paramCount}
        RETURNING *
      `;

      const result = await sql.query<Form>(query, values);
      return result.rows[0] || null;
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
      const result = await sql<{ count: string }>`
        SELECT COUNT(*) as count FROM forms 
        WHERE id = ${formId} AND user_id = ${userId} AND is_active = true
      `;
      return parseInt(result.rows[0]?.count || '0') > 0;
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
      const result = await sql<Submission>`
        INSERT INTO submissions (form_id, answers, metadata)
        VALUES (${data.form_id}, ${JSON.stringify(data.answers)}, ${JSON.stringify(data.metadata || {})})
        RETURNING *
      `;
      return result.rows[0] || null;
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

      const result = await sql<Submission>`
        SELECT * FROM submissions 
        WHERE form_id = ${formId}
        ORDER BY submitted_at DESC
        LIMIT ${limit}
      `;
      return result.rows;
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

      const result = await sql<{ count: string }>`
        SELECT COUNT(*) as count FROM submissions 
        WHERE form_id = ${formId}
      `;
      return parseInt(result.rows[0]?.count || '0');
    } catch (error) {
      console.error('Error counting submissions:', error);
      return 0;
    }
  }
};
