import { Link } from 'react-router-dom'

import './MissingRestaurant.css'

export default function MissingRestaurant() {
  return (
    <section className="missing-page">
      <h1>Restaurante nao encontrado</h1>
      <p>Essa unidade nao existe ou nao esta mais disponivel.</p>
      <Link to="/" className="missing-page__link">
        Voltar para Home
      </Link>
    </section>
  )
}
