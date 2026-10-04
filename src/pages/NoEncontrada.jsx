// Dirección que no existe dentro de la app.
import { Link } from 'react-router-dom'
import Marco from '../components/Marco'
import { Icono, Vacio } from '../components/ui'

export default function NoEncontrada() {
  return (
    <Marco titulo="No encontrada">
      <div className="pt-10">
        <Vacio icono="search" titulo="Esa página no existe" texto="Puede que el enlace esté mal escrito o que lo que buscabas se haya borrado.">
          <Link to="/" className="btn-primario"><Icono n="calendar_today" size={20} /> Ir al diario</Link>
        </Vacio>
      </div>
    </Marco>
  )
}
