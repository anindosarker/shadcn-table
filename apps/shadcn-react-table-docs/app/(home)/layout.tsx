/**
 * The homepage brings its own nav and footer (components/dev-home/v12), so
 * this group renders it bare: no fumadocs HomeLayout around it.
 */
export default function Layout({ children }: LayoutProps<'/'>) {
  return <>{children}</>;
}
