import Link from 'next/link';

interface Props {
  title: string;
  href: string;
}

export const GuideCard = ({ href, title }: Props) => {
  return (
    <Link href={href} className="block">
      <div className="rounded-lg border bg-card p-4 text-primary shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/30">
        <h4 className="whitespace-nowrap text-center text-[1.2rem] font-medium">
          {title}
        </h4>
      </div>
    </Link>
  );
};
