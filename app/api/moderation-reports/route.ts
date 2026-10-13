import { NextResponse } from 'next/server';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { AuthError, jsonError, requireUser } from '@/lib/authz';
import { fileReport } from '@/lib/moderation-reports';
import {
  isReportReason,
  isReportTargetType,
  normalizeReportDetails,
  reportNeedsDetails,
} from '@/lib/report-reasons';

/**
 * POST /api/moderation-reports — file a report against an opportunity or an
 * intern passport. Requires a signed-in, non-suspended member; one report per
 * member per target (repeat submissions return 409 so the UI can show a calm
 * "you already reported this" message).
 *
 * NOTE: the older /api/reports route is a deliberate 410 — academic reports
 * were removed per the SRS. Moderation reports live here instead.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const limit = rateLimit(clientKey(request, 'moderation-report:file'), {
      limit: 10,
      windowMs: 600_000,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many reports in a short time, please retry later.' },
        { status: 429 },
      );
    }

    const body = (await request.json().catch(() => null)) as {
      targetType?: unknown;
      targetId?: unknown;
      reason?: unknown;
      details?: unknown;
    } | null;
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    if (!isReportTargetType(body.targetType)) {
      return NextResponse.json({ error: 'Unknown report target' }, { status: 400 });
    }
    if (typeof body.targetId !== 'string' || body.targetId.trim().length === 0) {
      return NextResponse.json({ error: 'Missing report target id' }, { status: 400 });
    }
    if (!isReportReason(body.reason)) {
      return NextResponse.json({ error: 'Please choose a reason' }, { status: 400 });
    }
    if (reportNeedsDetails(body.reason, body.details)) {
      return NextResponse.json(
        { error: 'Please describe the issue when choosing "Something else"' },
        { status: 400 },
      );
    }

    const result = await fileReport({
      reporterId: user.id,
      targetType: body.targetType,
      targetId: body.targetId.trim(),
      reason: body.reason,
      details: normalizeReportDetails(body.details),
    });

    if (result.ok) return NextResponse.json({ id: result.id }, { status: 201 });
    switch (result.code) {
      case 'TARGET_NOT_FOUND':
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      case 'SELF_REPORT':
        return NextResponse.json(
          { error: 'You cannot report your own content' },
          { status: 403 },
        );
      case 'DUPLICATE':
      default:
        return NextResponse.json(
          { error: 'You have already reported this content' },
          { status: 409 },
        );
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(jsonError(error).body, { status: error.status });
    }
    console.error('[moderation-reports] filing failed:', error);
    return NextResponse.json({ error: 'Could not file the report' }, { status: 400 });
  }
}