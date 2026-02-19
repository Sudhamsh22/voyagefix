import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="group">
      <span className="text-2xl font-bold text-primary font-headline tracking-tighter">
        VoyageFlix
      </span>
    </Link>
  );
}
