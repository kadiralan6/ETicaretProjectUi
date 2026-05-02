import styles from "./TrustBadges.module.css";

const badges = [
  {
    id: "free-shipping",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Ücretsiz Kargo",
    description: "150₺ üzeri siparişlerde",
  },
  {
    id: "secure-payment",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    title: "Güvenli Ödeme",
    description: "256-bit SSL koruması",
  },
  {
    id: "easy-return",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
      </svg>
    ),
    title: "Kolay İade",
    description: "14 gün iade garantisi",
  },
];

export function TrustBadges() {
  return (
    <div className={styles.trustBadges}>
      {badges.map((badge) => (
        <div key={badge.id} className={styles.badge}>
          <div className={styles.badgeIcon}>{badge.icon}</div>
          <div className={styles.badgeText}>
            <span className={styles.badgeTitle}>{badge.title}</span>
            <span className={styles.badgeDesc}>{badge.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
