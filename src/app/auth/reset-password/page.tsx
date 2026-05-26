'use client';

import { useEffect } from 'react';

export default function ResetPasswordRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    window.location.replace(token ? `/?resetToken=${encodeURIComponent(token)}` : '/');
  }, []);

  return null;
}
