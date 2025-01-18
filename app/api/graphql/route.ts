import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPHQL_ENDPOINT = 'https://xapi.sonic.soniclabs.com/graphqlapi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('GraphQL request:', body);

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('GraphQL error response:', {
        status: response.status,
        statusText: response.statusText,
        body: text
      });
      return NextResponse.json(
        { error: `GraphQL endpoint returned ${response.status}: ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('GraphQL response:', data);

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json(
        { error: data.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy GraphQL request' },
      { status: 500 }
    );
  }
} 