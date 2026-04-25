import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ title, children }) {
  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={title} />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#f4f5f7' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
