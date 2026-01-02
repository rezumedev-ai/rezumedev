import { CompanyLogos } from './CompanyLogos';
import { UserStats } from './UserStats';
import { Testimonials } from './Testimonials';

export const TrustSignals = () => {
    return (
        <div className="space-y-0">
            <CompanyLogos />
            <UserStats />
            <Testimonials />
        </div>
    );
};
