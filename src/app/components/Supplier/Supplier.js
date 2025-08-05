'use client'
import React, { useEffect, useState } from 'react'
import { getsupplier, updateSupplier } from '../../utils/admincalls';

function Supplier({ supplierId,product}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);    // for initial data fetch
  const [updating, setUpdating] = useState(false);  // for form submission

  useEffect(() => {
    if (supplierId === null) return;

    const getdata = async () => {
      try {
        setLoading(true);
        const supplier = await getsupplier(supplierId);
        setFormData(supplier);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getdata();
  }, [supplierId]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await updateSupplier(supplierId, formData,product);
      alert('Create/update was successful');
    } catch (error) {
      alert(error.message || 'Failed to update supplier');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading supplier data...</p>;

  return (
    <div>
      <label>Supplier</label>
      <form onSubmit={handleUpdateSupplier}>
        <label>Name</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          type='tel'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type='text'
          name='address'
          value={formData.address}
          onChange={handleChange}
        />

        <label>Notes</label>
        <input
          type='text'
          name='notes'
          value={formData.notes}
          onChange={handleChange}
        />

        <button type='submit' disabled={updating}>
          {updating ? 'Updating...' : 'Update Supplier'}
        </button>
      </form>
    </div>
  );
}

export default Supplier;
