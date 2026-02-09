import React from 'react'

const items = [
  { id:1, title: 'Taj Mahal', img:'https://static.wixstatic.com/media/055605_65e20a7fcbc54e2e8720adfc2544c35e~mv2.jpg/v1/fill/w_1800,h_1082,al_c,q_85/taj_new_contant_edited.jpg', desc:'The Taj Mahal, a white marble mausoleum in Agra, India, was commissioned in 1632 by Mughal Emperor Shah Jahan to honor his beloved wife Mumtaz Mahal, who died during childbirth. Construction took about 22 years, blending Persian, Islamic, and Indian architecture' },
  { id:2, title: 'Qutub Minar', img:'https://plus.unsplash.com/premium_photo-1697730320983-f99aab252a44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cXV0dWIlMjBtaW5hcnxlbnwwfHwwfHx8MA%3D%3D', desc:'Delhi' },
  { id:3, title: 'Hampi', img:'https://images.unsplash.com/photo-1667115788169-b4549d3d5b4d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFtcGklMjB0ZW1wbGV8ZW58MHx8MHx8fDA%3D', desc:'Karnataka' }
]

export default function Carousel(){
  return (
    <div className="overflow-hidden">
      <div className="flex gap-4">
        {items.map(it=> (
          <div key={it.id} className="min-w-[280px] bg-white rounded shadow overflow-hidden">
            <img src={it.img} alt={it.title} className="h-40 w-full object-cover" />
            <div className="p-3">
              <h4 className="font-bold text-black">{it.title}</h4>
              <p className="text-black">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
