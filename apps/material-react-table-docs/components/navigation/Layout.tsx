import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { BreadCrumbs } from './BreadCrumbs';
import { MiniNav } from './MiniNav';
import { Footer } from './Footer';
import { TopBar } from './TopBar';
import { SideBar } from './Sidebar';
import { useThemeContext } from '../../styles/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useRouter();

  const { isSandboxOpen } = useThemeContext();

  const showBreadCrumbs = pathname !== '/';
  const showMiniNav =
    pathname.includes('/docs/getting-started') ||
    pathname.includes('/docs/api/mrt') ||
    pathname.includes('/docs/guides/') ||
    pathname.includes('/migrating') ||
    pathname === '/about' ||
    pathname === '/changelog' ||
    pathname === '/roadmap';

  const isMobile = useMediaQuery('(max-width: 900px)');
  const isDesktop = useMediaQuery('(min-width: 1500px)');
  const isXLDesktop = useMediaQuery('(min-width: 1800px)');

  const [navOpen, setNavOpen] = useState(false);
  return (
    <>
      <TopBar
        navOpen={navOpen || (isDesktop && !isSandboxOpen)}
        setNavOpen={setNavOpen}
      />
      <SideBar
        navOpen={navOpen || (isDesktop && !isSandboxOpen)}
        setNavOpen={setNavOpen}
      />
      <Box
        component="main"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
          p: `64px ${showMiniNav && isXLDesktop ? '264px' : '32px'} 0 ${
            (navOpen || (isDesktop && !isSandboxOpen)) && !isMobile
              ? '320px'
              : '32px'
          }`,
          transition: 'all 100ms ease-in-out',
        })}
      >
        <Box
          sx={{
            maxWidth: isSandboxOpen ? '100%' : '1200px',
            margin: 'auto',
            transition: 'all 100ms ease-in-out',
            width: '100%',
          }}
        >
          {showBreadCrumbs && <BreadCrumbs />}
          {showMiniNav && !isXLDesktop && <MiniNav />}
          {pathname === '/' ? children : <article>{children}</article>}
          <Footer />
        </Box>
        {showMiniNav && isXLDesktop && <MiniNav />}
      </Box>
    </>
  );
};
