'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas }                       from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';
import { Box, CircularProgress, Typography }            from '@mui/material';

// ── GLB Model loader ──────────────────────────────────────────────────────────
// glbUrl must be a blob: URL (created from axiosInstance blob fetch).
// This guarantees CORS can never block it — blob URLs are always same-origin.
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Revoke the blob URL after Three.js has loaded the model from it
  useEffect(() => {
    return () => {
      if (url.startsWith('blob:')) {
        useGLTF.clear(url);   // clear from drei cache
      }
    };
  }, [url]);

  return <Center><primitive object={scene} /></Center>;
}

// ── Loading fallback ──────────────────────────────────────────────────────────
function CanvasLoader() {
  return (
    <Box sx={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 1.5,
      bgcolor: '#f8f9ff', borderRadius: 2,
    }}>
      <CircularProgress size={40} sx={{ color: '#3b6ef8' }} />
      <Typography sx={{ fontSize: 13, color: '#6b7280' }}>Loading 3D model…</Typography>
    </Box>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
interface ThreeDViewerProps {
  glbUrl: string;   // must be a blob: URL
  height?: number;
}

export default function ThreeDViewer({ glbUrl, height = 320 }: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#f0f2ff',
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          camera={{ position: [0, 1, 3], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <GLBModel url={glbUrl} />
          </Suspense>

          <OrbitControls
            enableZoom
            enablePan
            autoRotate
            autoRotateSpeed={1.5}
            minDistance={0.5}
            maxDistance={20}
          />
        </Canvas>
      </Suspense>

      {/* Hint */}
      <Box sx={{
        position: 'absolute', bottom: 8, left: '50%',
        transform: 'translateX(-50%)',
        px: 1.5, py: 0.4,
        bgcolor: 'rgba(0,0,0,0.45)', borderRadius: 10,
        pointerEvents: 'none',
      }}>
        <Typography sx={{ fontSize: 11, color: '#fff', whiteSpace: 'nowrap' }}>
          Drag to rotate · Scroll to zoom
        </Typography>
      </Box>
    </Box>
  );
}
