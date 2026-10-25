export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [{ locale: 'en' }];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  
  // Only return for English
  if (locale !== 'en') {
    return new Response('Not Found', { status: 404 });
  }

  return new Response('HLzxBeb1pv5FYC2hzaZr', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

