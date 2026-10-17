import { Link } from 'react-router-dom';
import Logo from './brand/Logo';

const linkCls = 'text-ink-soft hover:text-accent';

export default function Footer() {
  return (
    <footer data-theme="noir" className="mt-ez-8 border-t border-line">
      <div className="page py-ez-7 grid grid-cols-1 md:grid-cols-4 gap-ez-6">
        <div>
          <Logo size={36} />
          <p className="mt-ez-4 text-body text-ink-soft">
            Casa de perfumes de Bucaramanga. Te ayudamos a encontrar tu fragancia con Valentina, nuestra asesora.
          </p>
        </div>
        <div>
          <h4 className="eyebrow mb-ez-4">Catálogo</h4>
          <ul className="space-y-ez-2 text-body">
            <li><Link to="/shop?category=hombre" className={linkCls}>Hombre</Link></li>
            <li><Link to="/shop?category=mujer" className={linkCls}>Mujer</Link></li>
            <li><Link to="/shop?category=unisex" className={linkCls}>Unisex</Link></li>
            <li><Link to="/shop?category=arabicos" className={linkCls}>Árabes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-ez-4">Ayuda</h4>
          <ul className="space-y-ez-2 text-body">
            <li><a href="#" className={linkCls}>Envíos y devoluciones</a></li>
            <li><a href="#" className={linkCls}>Guía de fragancias</a></li>
            <li><a href="#" className={linkCls}>Cómo elegir tu perfume</a></li>
            <li><a href="#" className={linkCls}>Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-ez-4">Contacto</h4>
          <ul className="space-y-ez-2 text-body text-ink-soft">
            <li>Bucaramanga, Colombia</li>
            <li>hola@esenzzia.com</li>
            <li>Envíos en 2 a 5 días hábiles</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-ez-4 text-center legal">
        &copy; {new Date().getFullYear()} Esenzzia · Todos los derechos reservados
      </div>
    </footer>
  );
}
