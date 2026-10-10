import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GONE_BODY = {
  error: 'Academic reports and supervisor workflows have been removed from MANTECH Nexus per SRS section 2. Focus is on placement pipeline, candidate discovery, and billing via WhatsApp.',
  deprecated: true,
  docs: 'See README.md section 2 for scope changes.',
};

export async function GET(_request: NextRequest) {
  return NextResponse.json(GONE_BODY, { status: 410 });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json(GONE_BODY, { status: 410 });
}

export async function PATCH(_request: NextRequest) {
  return NextResponse.json(GONE_BODY, { status: 410 });
}

export async function PUT(_request: NextRequest) {
  return NextResponse.json(GONE_BODY, { status: 410 });
}

export async function DELETE(_request: NextRequest) {
  return NextResponse.json(GONE_BODY, { status: 410 });
}
