import { prisma } from '@/lib/prisma';
import { notifyUser } from '@/lib/audit';

/**
 * Success-story loop.
 *
 * When an intern finishes an internship, we invite them — once — to share the
 * story on the public /testimonials page. Nothing is ever posted without them:
 * the invite is a notification linking to the submission form, and everything
 * submitted there still goes through admin approval. The guard checks for any
 * existing testimonial from the same email so a completed placement can never
 * spam the intern with repeat invites.
 */
export async function inviteSuccessStory(input: {
  userId: string;
  email: string;
  organizationName: string;
  internshipTitle: string;
}): Promise<void> {
  try {
    const existing = await prisma.testimonial.findFirst({
      where: { email: input.email },
      select: { id: true },
    });
    if (existing) return;

    await notifyUser({
      userId: input.userId,
      title: 'Share your success story',
      message: `Congratulations on completing your internship at ${input.organizationName}! Inspire other students across Cameroon — tell us how it went on the Success Stories page.`,
      category: 'placement',
      link: '/testimonials',
    });
  } catch (error) {
    // The invite is a nice follow-up, never a blocker for the status change
    // that triggered it.
    console.error('Success-story invite failed:', error);
  }
}
