const addcategory=async(name, description)=>{
    const res=await fetch('/api/addcategory',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.message || 'Failed to add category')
      }
    
      return res.json()
    }



 async function updatecategory(id, name, description) {
    const res = await fetch('/api/updateCategory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, description }),
    })
  
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error?.error || 'Failed to update category')
    }
  
    return await res.json()
  }
 async function fetchProducts() {
    const res = await fetch('/api/product')
    return res.json()
  }
  
   async function addProduct(data) {
    const res = await fetch('/api/addproduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }
  
   async function editProduct(id, data) {
    const res = await fetch(`/api/product/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  }
  
   async function removeProduct(id) {
    const res = await fetch(`/api/product/${id}`, {
      method: 'DELETE',
    })
    return res.json()
  }
  
  //
// 🔽 VARIANTS
//

const fetchVariants = async (productId) => {
  const res = await fetch(`/api/variants?productId=${productId}`)
  if (!res.ok) throw new Error('Failed to fetch variants')
  return res.json()
}

const addVariant = async (data) => {
  const res = await fetch('/api/variants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to add variant')
  return res.json()
}

const editVariant = async (id, data) => {
  const res = await fetch(`/api/variants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update variant')
  return res.json()
}

const removeVariant = async (id) => {
  const res = await fetch(`/api/variants/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete variant')
  return res.json()
}

export {
  addcategory,
  updatecategory,
  fetchProducts,
  addProduct,
  editProduct,
  removeProduct,
  fetchVariants,
  addVariant,
  editVariant,
  removeVariant,
}