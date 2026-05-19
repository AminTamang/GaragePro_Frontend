import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import AlertBanner from '../../components/AlertBanner';
import { apiRequest } from '../../services/apiClient';

export default function LoyaltyOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const payload = await apiRequest('/api/customers/loyalty-offers');
        setOffers(Array.isArray(payload.data) ? payload.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <PageHeader eyebrow="Customer" title="Loyalty Offers" description="Active discounts and rewards you can use on your next visit." />
      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState /> : (
        <div className="offer-grid animate-in">
          {offers.length === 0 ? (
            <section className="panel-card empty-panel">No active offers right now. Check back soon.</section>
          ) : (
            offers.map((offer, i) => (
              <article className="offer-card panel-card" key={offer.offerName || i}>
                <div className="offer-icon"><Gift size={22} /></div>
                <h3>{offer.offerName || offer.title || 'Loyalty Offer'}</h3>
                <p>{offer.description || offer.eligibility || 'Available for eligible customers.'}</p>
                <div className="offer-meta">
                  <span className="status-pill status-in-stock">{offer.discountPct ? `${offer.discountPct}% off` : offer.discount || 'Active'}</span>
                  {offer.validUntil && <span>Valid until {offer.validUntil}</span>}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </>
  );
}
