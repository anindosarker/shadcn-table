import type { ComponentType } from 'react';
import {
  BookOpenIcon,
  BugIcon,
  CodeIcon,
  MessageCircleIcon,
  PackageIcon,
} from 'lucide-react';

const cardData: {
  text: string;
  Icon: ComponentType<{ className?: string }>;
  href: string;
}[] = [
  {
    text: 'NPM',
    Icon: PackageIcon,
    href: 'https://www.npmjs.com/package/shadcn-react-table',
  },
  {
    text: 'Source Code',
    Icon: CodeIcon,
    href: 'https://github.com/anindosarker/shadcn-react-table',
  },
  {
    text: 'GitHub Issues',
    Icon: BugIcon,
    href: 'https://github.com/anindosarker/shadcn-react-table/issues',
  },
  {
    text: 'Discord',
    Icon: MessageCircleIcon,
    href: 'https://discord.gg/5wqyRx6fnm',
  },
  {
    text: 'Storybook',
    Icon: BookOpenIcon,
    href: 'https://shadcn-react-table.dev',
  },
];

export const LinkCards = () => {
  return (
    <div className="mt-8 text-center">
      <h3 className="p-4 text-2xl font-semibold md:text-3xl">Useful Links</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {cardData.map((cd, index) => (
          <a
            key={index}
            href={cd.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <div className="group flex min-h-[90px] w-[9.5rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border bg-card p-4 font-bold text-primary shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/30">
              <cd.Icon className="size-14 transition-transform duration-150 ease-in-out group-hover:scale-[1.01]" />
              <p>{cd.text}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
