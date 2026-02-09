import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const recipes = [
  { id: 1, name: 'Butter Chicken', ingredients: ['Chicken', 'Butter', 'Cream', 'Spices'], nutrition: '350 cal' },
  { id: 2, name: 'Biryani', ingredients: ['Rice', 'Meat', 'Spices', 'Yogurt'], nutrition: '400 cal' },
  { id: 3, name: 'Samosa', ingredients: ['Flour', 'Potato', 'Spices', 'Oil'], nutrition: '200 cal' }
]

export default function Cuisine() {
  const { register, watch } = useForm({ defaultValues: { search: '' } })
  const query = watch('search') || ''
  const list = recipes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Cuisine Explorer</h1>
      <div className="mt-4">
        <input {...register('search')} placeholder="Search recipes" className="border px-3 py-2 w-full md:w-1/2 text-black rounded" />
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {list.map(r => (
          <div key={r.id} className="relative overflow-hidden min-h-[145px] bg-gradient-to-r from-gray-900 via-gray-800 to-transparent rounded shadow p-4 text-white border border-gold/30">
            <h3 className="font-bold">{r.name}</h3>
            <p className="text-sm mt-2">Ingredients: {r.ingredients.join(', ')}</p>
            <p className="text-sm mt-1 text-gold font-semibold">{r.nutrition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
