import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../shared/Modal";


function getNextOccurrence(dateStr) {
  const today = new Date()
  const [year, month, day] = dateStr.split("-").map(Number)

  // Assume festival happens every year on same month/day
  let nextDate = new Date(today.getFullYear(), month - 1, day)

  // If already passed this year → move to next year
  if (nextDate < today) {
    nextDate = new Date(today.getFullYear() + 1, month - 1, day)
  }

  return nextDate
}



const festivals = [
  {
    id: 1,
    name: "Diwali",
    date: "2026-11-01",
    image: "https://images.unsplash.com/photo-1592843997881-cab3860b1067?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpd2FsaXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Diwali, the Festival of Lights, celebrates the victory of light over darkness and good over evil. Families light diyas, decorate homes, exchange sweets, and perform Lakshmi puja for prosperity.",
  },
  {
    id: 2,
    name: "Holi",
    date: "2026-03-25",
    image: "https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9saXxlbnwwfHwwfHx8MA%3D%3D",
    description: "Holi is the vibrant spring festival of colors symbolizing joy, renewal, and togetherness. People celebrate with gulal, music, dance, and festive foods while strengthening community bonds.",
  },
  {
    id: 3,
    name: "Navratri",
    date: "2026-10-15",
    image: "https://images.unsplash.com/photo-1622279488670-123d0fd161cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG5hdnJhdHJpfGVufDB8fDB8fHww",
    description: "Navratri is a nine-night festival dedicated to Goddess Durga in her various forms. It is celebrated with devotional songs, fasting, Garba and Dandiya dances, and community worship.",
  },
  {
    id: 4,
    name: "Makar Sankranti",
    date: "2026-01-14",
    image: "https://images.unsplash.com/photo-1641792113723-667c35b6766b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFrYXIlMjBzYW5rcmFudGl8ZW58MHx8MHx8fDA%3D",
    description: "Makar Sankranti marks the sun’s transition into Capricorn and the harvest season in many regions. Kite flying, sesame sweets, and thanksgiving rituals are key parts of the celebration.",
  },
  {
    id: 5,
    name: "Pongal",
    date: "2026-01-15",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzxQzS0X0WdDz6hpRJ52Eh5xR8NJ_jQzmmBw&s",
    description: "Pongal is a Tamil harvest festival thanking nature, the sun, and cattle for a bountiful season. Families cook the traditional Pongal dish, decorate homes, and celebrate with cultural events.",
  },
  {
  id: 6,
  name: "Raksha Bandhan",
  date: "2026-08-19",
  image: "https://images.unsplash.com/photo-1693473812472-a9f1887a6b2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFrc2hhJTIwYmFuZGhhbnxlbnwwfHwwfHx8MA%3D%3D",
  description: "Raksha Bandhan celebrates the bond between brothers and sisters. Sisters tie a sacred thread (rakhi) on their brothers' wrists, symbolizing protection, love, and lifelong support."
  },
  
  {
    id: 7,
    name: "Ganesh Chaturthi",
    date: "2026-09-10",
    image: "https://plus.unsplash.com/premium_photo-1674898516505-e8913fb7f40c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2FuZXNoJTIwY2hhdHVydGhpfGVufDB8fDB8fHww",
    description: "Ganesh Chaturthi honors Lord Ganesha, the remover of obstacles. Devotees install clay idols, perform prayers, sing devotional songs, and immerse the idols in water after celebrations."
  },
  
  {
    id: 8,
    name: "Durga Puja",
    date: "2026-10-20",
    image: "https://images.unsplash.com/photo-1616074385287-67f6fb9e9eb8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHVyZ2ElMjBwdWphfGVufDB8fDB8fHww",
    description: "Durga Puja celebrates Goddess Durga’s victory over evil. Beautifully decorated pandals, artistic idols, cultural performances, and community gatherings are central to the festivities."
  },
  
  {
    id: 9,
    name: "Baisakhi",
    date: "2026-04-13",
    image: "https://st3.depositphotos.com/33041278/36262/i/450/depositphotos_362628318-stock-photo-sikh-people-performing-punjabi-bhangra.jpg",
    description: "Baisakhi marks the harvest season in Punjab and the Sikh New Year. It is celebrated with bhangra dances, community feasts, and visits to gurudwaras."
  },
  
  {
    id: 10,
    name: "Onam",
    date: "2026-08-28",
    image: "https://chardhambooking.com/wp-content/uploads/2021/01/Celebration.jpg",
    description: "Onam is Kerala’s harvest festival celebrating the legendary King Mahabali. It features floral decorations (Pookalam), traditional feasts (Onam Sadya), and boat races."
  },
  
  {
    id: 11,
    name: "Janmashtami",
    date: "2026-09-02",
    image: "https://www.iskconbangalore.org/blog/wp-content/uploads/2015/04/sri-krishna-janmashtami-festival-recipe.jpg",
    description: "Janmashtami celebrates the birth of Lord Krishna. Devotees fast, sing devotional songs, decorate temples, and participate in Dahi Handi events."
  },
  
  {
    id: 12,
    name: "Mahashivratri",
    date: "2026-02-15",
    image: "https://blog.cdn.level.game/2024/02/what-to-do-on-Mahashivratri.webp",
    description: "Mahashivratri is dedicated to Lord Shiva. Devotees observe fasting, night vigils, and special prayers seeking spiritual growth and blessings."
  },
  
  {
    id: 14,
    name: "Karva Chauth",
    date: "2026-10-24",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/Karva-Chauth-1-fes-hero?qlt=82&ts=1726639240658",
    description: "Karva Chauth is observed by married women who fast from sunrise to moonrise for the well-being and longevity of their husbands."
  },
  
  {
    id: 15,
    name: "Chhath Puja",
    date: "2026-11-17",
    image: "https://drishtiias.com/images/uploads/1667468445_image1.png",
    description: "Chhath Puja is dedicated to the Sun God. Devotees offer prayers at riverbanks during sunrise and sunset, expressing gratitude for life and prosperity."
  },
  
  {
    id: 16,
    name: "Lohri",
    date: "2026-01-13",
    image: "https://www.theindianpanorama.news/wp-content/uploads/2021/01/lori-648x381.jpg",
    description: "Lohri marks the end of winter and celebrates the harvest season in North India. Bonfires, folk songs, and dancing are central to the festivities."
  }
];

function Countdown({ date }) {
  const nextDate = getNextOccurrence(date)
  const today = new Date()

  const diff = Math.max(nextDate - today, 0)
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  return (
    <div className="text-sm text-gold font-medium">
      {days} days remaining
    </div>
  )
}


export default function Festivals() {
  const { register, watch } = useForm({ defaultValues: { search: "" } });
  const [selectedFestival, setSelectedFestival] = useState(null)
  const query = watch("search");

  const list = festivals.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue">
        Festivals & Traditions
      </h1>

      <div className="mt-4">
        <input
          {...register("search")}
          placeholder="Search festivals"
          className="border px-3 py-2 w-full md:w-1/2 rounded"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {list.map((f) => (
          <button
            type="button"
            key={f.id}
            onClick={() => setSelectedFestival(f)}
            className="relative overflow-hidden min-h-[140px] bg-gradient-to-r from-gray-900 via-gray-800 to-transparent rounded shadow p-4 text-white border border-gold/30"
          >
            {/* TEXT CONTENT */}
            <div className="relative z-10 max-w-[60%] text-left">
              <h3 className="font-bold text-gold">{f.name}</h3>

              <p className="text-sm mt-1 text-gray-300">
                Date: {getNextOccurrence(f.date).toISOString().slice(0, 10)}
              </p>

              <Countdown date={f.date} />
              <p className="text-[11px] mt-2 text-cyan-400">Click to view details</p>
            </div>

            {/* IMAGE */}
            <img
              src={f.image || "/assets/placeholder-image.svg"}
              alt={f.name}
              className="festival-image"
            />
          </button>
        ))}

      </div>

      {selectedFestival && (
        <Modal onClose={() => setSelectedFestival(null)}>
          <div className="text-white">
            <img
              src={selectedFestival.image || "/assets/placeholder-image.svg"}
              alt={selectedFestival.name}
              className="w-full h-64 object-cover rounded-lg mb-5"
            />

            <h2 className="text-2xl font-bold text-gold">{selectedFestival.name}</h2>
            <p className="text-sm text-gray-400 mt-1">
              Date: {getNextOccurrence(selectedFestival.date).toISOString().slice(0, 10)}
            </p>
            <div className="mt-1">
              <Countdown date={selectedFestival.date} />
            </div>

            <div className="mt-5 p-4 rounded-lg bg-gray-800 border border-gold/20">
              <h3 className="text-gold font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{selectedFestival.description}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
