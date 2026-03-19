import { Link } from 'react-router-dom'

export default function MissingDish() {
  return (
    <section className="missing-page">
      <h1>Prato nao encontrado</h1>
      <p>Esse prato nao existe ou foi removido do cardapio.</p>
      <Link to="/" className="missing-page__link">
        Voltar para Home
      </Link>
    </section>
  )
}
