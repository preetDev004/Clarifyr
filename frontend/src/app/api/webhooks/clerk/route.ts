import type { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret || '');

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.log('Error verifying webhook:', err);
    return NextResponse.json({ message: 'Error occurred' }, { status: 400 });
  }
  // Handle the webhook
  if (evt.type == 'session.created') {
    const userId = evt.data.user_id;
    const sessionCreatedAt = new Date(evt.data.created_at);

    try {
      // Call Clerk's API once to get just the user creation timestamp
      const userCreationTimestamp = await getUserCreationTimestamp(userId);
      const userCreatedAt = new Date(userCreationTimestamp);
      const timeDiffSeconds = Math.abs(
        (sessionCreatedAt.getTime() - userCreatedAt.getTime()) / 1000
      );

      if (timeDiffSeconds < 10) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/signup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              SessionID: evt.data.id,
            },
            body: JSON.stringify({
              id: evt.data.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to create user in database');
        }
        return NextResponse.json({
          message: 'New user with first session processed',
        });
      }
      // Not a new user's first session
      return NextResponse.json({ message: 'Session acknowledged' });
    } catch (error) {
      console.log('Error creating user:', error);
      return NextResponse.json(
        { message: 'Error creating user' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: 'Webhook received' });
}

// Helper function to get just the user creation timestamp
async function getUserCreationTimestamp(userId: string) {
  const clerkApiKey = process.env.CLERK_SECRET_KEY;
  const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${clerkApiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user details');
  }

  const userData = await response.json();
  return userData.created_at;
}
