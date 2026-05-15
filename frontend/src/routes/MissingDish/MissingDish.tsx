import { Link } from 'react-router-dom'

import './MissingDish.css'

export default function MissingDish() {
  return (
    <section className="missing-page">
      <span className="missing-page__icon">🔍</span>
      <h1>Prato não encontrado</h1>
      <p>Esse prato não existe ou foi removido do cardápio.</p>
      <Link to="/" className="missing-page__link">
        Voltar para Home
      </Link>
    </section>
  )
}
