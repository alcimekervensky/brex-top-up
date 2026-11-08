import { Link } from 'react-router-dom';
export default function NotFoundPage(){return <div className="container-shell py-24 text-center"><p className="text-6xl font-black">404</p><h1 className="mt-3 text-2xl font-bold">Page introuvable</h1><Link to="/" className="btn-primary mt-6">Retour à l’accueil</Link></div>}
