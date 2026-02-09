import React, { useState } from 'react'

const crafts = [
  { id:1, name:'Madhubani Painting', img:'https://thumbs.dreamstime.com/b/madhubani-painting-8294267.jpg', artisan:'Radha Devi' },
  { id:2, name:'Warli Art', img:'https://i.ytimg.com/vi/UJtefdDzgpY/maxresdefault.jpg', artisan:'Savitribai Wagh' },
  { id:3, name:'Patachitra', img:'https://www.indicinspirations.com/cdn/shop/products/mahakali-bengal-patachitra-painting-a5-frame-paintings-346595.jpg?v=1665660009&width=899', artisan:'Jagannath Mahanta' }
]

export default function ArtCrafts(){
  const [selected, setSelected] = useState(null)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold ">Art & Crafts Gallery</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {crafts.map(c=> (
          <div key={c.id} className="cursor-pointer rounded overflow-hidden shadow hover:scale-105 transition" onClick={()=>setSelected(c)}>
            <img src={c.img} alt={c.name} className="h-48 w-full object-cover" />
            <div className="p-3">
              <h3 className="font-bold">{c.name}</h3>
              <p className="text-sm text-gray-600">By {c.artisan}</p>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={()=>setSelected(null)}>
          <img src={selected.img} alt={selected.name} className="max-h-[80vh] w-auto rounded" />
        </div>
      )}
    </div>
  )
}
