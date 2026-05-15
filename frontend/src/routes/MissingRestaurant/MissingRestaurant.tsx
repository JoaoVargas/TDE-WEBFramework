import { Link } from 'react-router-dom'

import './MissingRestaurant.css'

export default function MissingRestaurant() {
  return (
    <section className="missing-page">
      <span className="missing-page__icon">🍽️</span>
      <h1>Restaurante não encontrado</h1>
      <p>Essa unidade não existe ou não está mais disponível.</p>
      <Link to="/" className="missing-page__link">
        Voltar para Home
      </Link>
    </section>
  )
}
