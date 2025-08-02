'use client'
import React, { useState } from 'react'
import  Upload from '../Upload/Upload'
import Image from 'next/image'

function UpLoadHero({heroNum}) {
    const [herourl,setherourl]=useState('')
    const hero={id:`hero${heroNum}`}
    const handleSubmit=async (e)=>{
        e.preventDefault()
        if (!herourl?.imagePath) {
            alert("Please upload an image first.");
            return;
          }
        
        const res = await fetch('/api/heroimageup',{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({id:heroNum,imageUrl:herourl.imagePath,altText:`hero${heroNum}`,position:heroNum})
            })
       if(res){
        alert('success')
       }

        };
  return (
    <div>
        <h3>Up Load Hero {heroNum}</h3>
        {herourl!==''&&<Image src={herourl.imagePath} alt={`hero${heroNum}` } height={300} width={300}/>}
        <form onSubmit={handleSubmit}>
        <Upload
        prod={hero}
        onImageChange={setherourl}
        />
        <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default UpLoadHero