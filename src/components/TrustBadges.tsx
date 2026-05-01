import { Award, RefreshCw, Truck, Shield } from "lucide-react";

const badges = [
  { icon: Award, label: "Premium Quality" },
  { icon: RefreshCw, label: "Easy Return" },
  { icon: Truck, label: "National Delivery" },
  { icon: Shield, label: "Safe Payment" },
];

const TrustBadges = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center justify-center gap-3 bg-card rounded-lg px-4 py-4 border border-border"
          >
            <badge.icon className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm font-body font-medium text-foreground">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
