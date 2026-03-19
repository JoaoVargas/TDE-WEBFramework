import { useParams } from 'react-router-dom'
import './Dish.css'

export default function Dish() {
  const { id } = useParams()

  return (
    <section style={{ padding: '1.5rem' }}>
      <h1>Dish</h1>
      <p>Viewing dish #{id}</p>
    </section>
  )
}
