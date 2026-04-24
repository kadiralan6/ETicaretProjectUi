import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.column}>
          <h3>E-Ticaret</h3>
          <ul>
            <li>
              <Link href="/about">Hakkımızda</Link>
            </li>
            <li>
              <Link href="/contact">İletişim</Link>
            </li>
            <li>
              <Link href="/careers">Kariyer</Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Kategoriler</h3>
          <ul>
            <li>
              <Link href="/category/elektronik">Elektronik</Link>
            </li>
            <li>
              <Link href="/category/moda">Moda</Link>
            </li>
            <li>
              <Link href="/category/ev-yasam">Ev & Yaşam</Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Yardım</h3>
          <ul>
            <li>
              <Link href="/faq">Sıkça Sorulan Sorular</Link>
            </li>
            <li>
              <Link href="/shipping">Kargo & Teslimat</Link>
            </li>
            <li>
              <Link href="/returns">İade & Değişim</Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Yasal</h3>
          <ul>
            <li>
              <Link href="/privacy">Gizlilik Politikası</Link>
            </li>
            <li>
              <Link href="/terms">Kullanım Koşulları</Link>
            </li>
            <li>
              <Link href="/kvkk">KVKK Aydınlatma</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        &copy; {new Date().getFullYear()} E-Ticaret. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
