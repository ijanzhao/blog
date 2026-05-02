'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data, error } = await supabase
      .from('v_compound_full')
      .select('*')

    if (error) {
      console.error(error)
    } else {
      setData(data)
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>🧬 铁筷子 R&D 数据库</h1>

      {loading && <p>加载中...</p>}

      {data.map((item, i) => (
        <div key={i} style={{
          border: '1px solid #ddd',
          padding: 10,
          marginBottom: 10,
          borderRadius: 8
        }}>
          <h2>{item.compound}</h2>
          <p>🎯 靶点：{item.target}</p>
          <p>🧠 通路：{item.pathway}</p>
        </div>
      ))}
    </main>
  )
}
