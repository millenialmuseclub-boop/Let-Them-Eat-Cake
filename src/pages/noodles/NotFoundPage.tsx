import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page-container">
      <h1>Page not found</h1>
      <Link to="/" className="btn btn-secondary" style={{ marginTop: 12 }}>← Back to Discover</Link>
    </div>
  );
}
