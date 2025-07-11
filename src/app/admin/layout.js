import { Inter } from 'next/font/google'
import '../globals.css'
const inter = Inter({ subsets: ['latin'] })
import NavAdmin from "../components/NavAdmin/NavAdmin"

export const metadata = {
    title: 'Admin Section',
  description: 'Admin pages only',
  }
  
  export default function AdminLayout({ children }) {
    return (
      <html lang="en">
        <body className={inter.className}>
        <NavAdmin/>
          {children}
          </body>
      </html>
    )
  }
  