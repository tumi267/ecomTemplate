'use client'
import { useState,useEffect } from "react";

export default function ProductMetrics({ price, cost, productId }) {
    const [velocity, setVelocity] = useState(null);
    
    useEffect(() => {
      // Fetch real sales data when productId changes
      async function fetchVelocity() {
       // 2. Date range for sales history
    //    later input dates
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 28) // last 4 weeks

      // 3. Fetch sales data
      const res = await fetch('/api/getsalesdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, startDate, endDate }),
      })
      const data=await res.json()
      
        setVelocity(data.velocity);
      }
      productId && fetchVelocity();
    }, [productId]);
  
    const margin = price && cost 
      ? (((price - cost) / price) * 100).toFixed(1)
      : '--';
  
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Profit Margin</p>
          <p className={`text-lg font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {margin}%
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-500">Sales Velocity</p>
          <p className="text-lg font-medium">
            {velocity || '--'} units/day
          </p>
          <p className="text-xs text-gray-400">30-day average</p>
        </div>
      </div>
    );
  }