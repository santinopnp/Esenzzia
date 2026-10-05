import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-serif text-xl font-bold text-gold mb-3">Esenzzia</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Perfumes y esencias premium para Colombia. Descubre tu fragancia perfecta con la ayuda de Valentina, nuestra asesora IA.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Catalogo</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/shop?category=hombre" className="hover:text-gold">Hombre</Link></li>
            <li><Link to="/shop?category=mujer" className="hover:text-gold">Mujer</Link></li>
            <li><Link to="/shop?category=unisex" className="hover:text-gold">Unisex</Link></li>
            <li><Link to="/shop?category=arabicos" className="hover:text-gold">Arabicos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Ayuda</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-gold">Envios y devoluciones</a></li>
            <li><a href="#" className="hover:text-gold">Guia de fragancias</a></li>
            <li><a href="#" className="hover:text-gold">Como elegir tu perfume</a></li>
            <li><a href="#" className="hover:text-gold">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-300">Contacto</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Colombia</li>
            <li>hola@esenzzia.com</li>
            <li>Envios 2-5 dias habiles</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Esenzzia. Todos los derechos reservados.
      </div>
    </footer>
  );
}
