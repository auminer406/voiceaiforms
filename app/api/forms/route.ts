import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// GET /api/forms - List user's forms
// GET /api/forms?id=xxx - Get specific form (if user owns it)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (id) {
      const form = await db.getForm(id);
      if (!form) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }
      
      // Verify ownership
      if (form.user_id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      return NextResponse.json(form);
    }

    if (slug) {
      const form = await db.getFormBySlug(slug);
      if (!form) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }
      
      // Verify ownership
      if (form.user_id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      
      return NextResponse.json(form);
    }

    // Get all user's forms
    const forms = await db.getAllForms(userId);
    return NextResponse.json(forms);
  } catch (error) {
    console.error('GET /api/forms error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/forms - Create new form
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, yaml_config, webhook_url } = body;

    if (!name || !yaml_config) {
      return NextResponse.json(
        { error: 'Name and yaml_config are required' },
        { status: 400 }
      );
    }

    // Validate YAML can be parsed
    const yaml = await import('yaml');
    try {
      yaml.parse(yaml_config);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid YAML configuration' },
        { status: 400 }
      );
    }

    const form = await db.createForm({
      user_id: userId,
      name,
      slug,
      yaml_config,
      webhook_url,
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Failed to create form' },
        { status: 500 }
      );
    }

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('POST /api/forms error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/forms - Update existing form
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, slug, yaml_config, webhook_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    // Validate YAML if provided
    if (yaml_config) {
      const yaml = await import('yaml');
      try {
        yaml.parse(yaml_config);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid YAML configuration' },
          { status: 400 }
        );
      }
    }

    const form = await db.updateForm(id, userId, {
      name,
      slug,
      yaml_config,
      webhook_url,
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('PUT /api/forms error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/forms?id=xxx - Delete form
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    const success = await db.deleteForm(id, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Form not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/forms error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}