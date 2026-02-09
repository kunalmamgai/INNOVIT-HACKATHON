import React from "react";
import { useForm } from "react-hook-form";


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
    image: "https://images.unsplash.com/photo-1592843997881-cab3860b1067?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpd2FsaXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    name: "Holi",
    date: "2026-03-25",
    image: "https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9saXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    name: "Navratri",
    date: "2026-10-15",
    image: "https://images.unsplash.com/photo-1622279488670-123d0fd161cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG5hdnJhdHJpfGVufDB8fDB8fHww"
  },
  {
    id: 4,
    name: "Makar Sankranti",
    date: "2026-01-14",
    image: "https://images.unsplash.com/photo-1641792113723-667c35b6766b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFrYXIlMjBzYW5rcmFudGl8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: 5,
    name: "Pongal",
    date: "2026-01-15",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzxQzS0X0WdDz6hpRJ52Eh5xR8NJ_jQzmmBw&s"
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
  const query = watch("search");

  const list = festivals.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white">
        Festivals & Traditions
      </h1>

      <div className="mt-4">
        <input
          {...register("search")}
          placeholder="Search festivals"
          className="border px-3 py-2 w-full text-black md:w-1/2 rounded"
        />
      </div>

      <div className="grid md:grid-cols-3 text-black gap-4 mt-6">
        {list.map((f) => (
          <div
            key={f.id}
            className="relative overflow-hidden min-h-[145px] bg-gradient-to-r from-gray-900 via-gray-800 to-transparent rounded shadow p-4 text-white border border-gold/30"
          >
            {/* TEXT CONTENT */}
            <div className="relative z-10 max-w-[60%]">
              <h3 className="font-bold text-gold">{f.name}</h3>

              <p className="text-sm mt-1 text-gray-300">
                Date: {getNextOccurrence(f.date).toISOString().slice(0, 10)}
              </p>

              <Countdown date={f.date} />
            </div>

            {/* IMAGE */}
            <img
              src={f.image}
              alt={f.name}
              className="festival-image "
            />
          </div>
        ))}

      </div>
    </div>
  );
}
