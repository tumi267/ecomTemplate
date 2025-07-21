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

async function getSingleProduct(id){
  const res =await fetch(`/api/product/${id}`)
  return res.json()
}
  
  async function fetchcategory() {
    const res = await fetch('/api/getcategories')
    return res.json()
  }
   async function addProduct(data) {
    const res = await fetch('/api/addproduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return data
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

const getProductsByCategory = async (id) => {
  const res = await fetch(`/api/getProductByCategory`,{
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify(id)
  })
  if (!res.ok) throw new Error('Failed to update variant')
  return res.json()
}

const addDiscount=async(body)=>{
  
  const res =await fetch(`/api/addDiscount`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to update variant')
  return res.json()
}
const getSingleOrder=async(body)=>{
  const res =await fetch('/api/getSingleOrder',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to update variant')
  return res.json()
}

const processOrder=async(id, updatedProductJSON, OrderStatus)=>{
  const res =await fetch('/api/processOrder',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id, updatedProductJSON, OrderStatus})
  })
  if (!res.ok) throw new Error('Failed to update variant')
  return res.json()
}
function timeAgo(date) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))

  if (hours >= 24) {
    const day = String(past.getDate()).padStart(2, '0')
    const month = String(past.getMonth() + 1).padStart(2, '0')
    const year = past.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (hours > 0) {
    return hours === 1 ? 'less than an hour ago' : `${hours} hours ago`
  }

  if (minutes > 5) {
    return `${minutes} minutes ago`
  }

  return 'just now'
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
  getProductsByCategory,
  fetchcategory,
  getSingleProduct,
  addDiscount,
  getSingleOrder,
  timeAgo,
  processOrder,
}