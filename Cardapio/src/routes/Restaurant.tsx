import { useParams } from 'react-router-dom'
import './Restaurant.css'

export default function Restaurant() {
  const { id } = useParams()

  return (
    <section style={{ padding: '1.5rem' }}>
      <h1>Restaurant</h1>
      <p>Viewing restaurant #{id}</p>
    </section>
  )
}
