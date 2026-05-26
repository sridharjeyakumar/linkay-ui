'use client';

import { useEffect } from 'react';

export default function VerifyEmailRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    window.location.replace(token ? `/?verifyToken=${encodeURIComponent(token)}` : '/');
  }, []);

  return null;
}
