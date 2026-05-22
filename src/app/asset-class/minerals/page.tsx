import Navbar from '@/components/landing/Navbar';
import Minerals from '@/components/landing/asset-class/minerals/Minerals';
import { getMineralModalContent, getNavbarContent } from '@/lib/content';

export default function MineralsPage() {
  const content = getMineralModalContent();
  const navbar = getNavbarContent();

  return (
    <>
      <Navbar content={navbar} />
      <main>
        <Minerals content={content} />
      </main>
    </>
  );
}
