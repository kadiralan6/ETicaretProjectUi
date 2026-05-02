"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./LoginPromptModal.module.css";

interface LoginPromptModalProps {
  onClose: () => void;
}

export const LoginPromptModal = ({ onClose }: LoginPromptModalProps) => {
  const params = useParams();
  const lang = (params?.lang as string) || "tr";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.iconWrap}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h2 id="login-modal-title" className={styles.title}>
          Giriş Yapmanız Gerekiyor
        </h2>
        <p className={styles.desc}>
          Sepete ürün eklemek için lütfen hesabınıza giriş yapın.
          Hesabınız yoksa hızlıca oluşturabilirsiniz.
        </p>

        <div className={styles.actions}>
          <Link
            href={`/${lang}/login`}
            className={styles.loginBtn}
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Giriş Yap
          </Link>

          <Link
            href={`/${lang}/register`}
            className={styles.registerBtn}
            onClick={onClose}
          >
            Hesap Oluştur
          </Link>

          <button className={styles.cancelBtn} onClick={onClose}>
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};
