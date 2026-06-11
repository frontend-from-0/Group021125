import Link from 'next/link';

export const metadata = {
  title: 'User pages in Demo Project',
};

export default function MainLayout({ children }) {
  return (
    <div className='flex'>
      <nav className='w-[320px]'>
        <ul>
          <li>
            <Link href='/user/orders'>Orders</Link>
          </li>
          <li>
            <Link href='/user/settings'>Settings</Link>
          </li>
          <li>
            <Link href='/'>Go to Main Page</Link>
          </li>
        </ul>
      </nav>
      <div>{children}</div>
    </div>
  );
}
