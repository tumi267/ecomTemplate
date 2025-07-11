import { Inter } from 'next/font/google';
import '../globals.css';
import Nav from '../components/nav/Nav';
import Dawer from '../components/Dawer/Dawer';

const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({ children }) {
  return (
    <div className={inter.className}>
      <Nav />
      <Dawer />
      {children}
    </div>
  );
}
