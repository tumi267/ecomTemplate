import React from 'react'
import { getsingleUsers } from '../../../libs/category'
import { getuserOrders } from '../../../libs/product'

async function userDetails({ params }) {
    const id=params.id
    const user = await getsingleUsers(id)
    if(!user){
        return
    }
    const orderinfo=await getuserOrders(user.email)
    const totalSpent = orderinfo.reduce((sum, order) => sum + parseFloat(order.price), 0);
  return (
    <div>User Details
        <h1>{user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>number of orders:{orderinfo.length}</p>
       <p>amount spent :R {totalSpent.toFixed(2)}</p> 
        
        orders:{orderinfo.map((e)=>{return<div key={e.id}> 
        <a href={`/admin/orders/${e.id}`}>{e.id}</a>
        </div>})}
    </div>
  )
}

export default userDetails