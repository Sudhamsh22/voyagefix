import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="group">
      <span className="text-2xl font-extrabold tracking-wider text-primary">
        VoyageFlix
      </span>
    </Link>
  );
}
