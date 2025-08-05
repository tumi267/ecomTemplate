
import React from 'react'
import { getUsers } from '../../libs/category'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import styles from './customers.module.css'
async function Customer() {
  const users= await getUsers()
  
  return (
    <div><h2>Customers</h2>
      <Table className={styles.Table}>
        <TableHeader className={styles.head}>
          <TableRow>
            <TableHead className={styles.theader}>Customer</TableHead>
            <TableHead className={styles.theader}>email</TableHead>
            <TableHead className={styles.theader}>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              
              <TableRow
                key={user.id}
                className={styles.itemselect}
                
                style={{ cursor: 'pointer' }}
              >
                <TableCell className="font-medium">
                  <TableCell className="font-medium">
                  <a href={`/admin/customers/${user.id}`}>{user.name}</a>
                  </TableCell>
                  </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{(() => {
                    const date = new Date(user.createdAt)
                    const day = date.getDate().toString().padStart(2, '0')
                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                    const year = date.getFullYear()
                    return `${day}/${month}/${year}`
                })()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className={styles.noOrders}>
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default Customer