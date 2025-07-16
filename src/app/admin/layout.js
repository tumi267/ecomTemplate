
import NavAdmin from "../components/NavAdmin/NavAdmin"

export const metadata = {
    title: 'Admin Section',
  description: 'Admin pages only',
  }
  
  export default function AdminLayout({ children }) {
    return (
     
        < >
        <NavAdmin/>
          {children}
          </>
      
    )
  }
  