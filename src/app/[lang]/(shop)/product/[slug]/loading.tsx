import styles from "./loading.module.css";

export default function ProductLoading() {
  return (
    <div className="container">
      <div style={{ padding: "1rem 0" }}>
        <div
          className="skeleton"
          style={{ width: 300, height: 16, borderRadius: 4 }}
        />
      </div>
      <div className={styles.grid}>
        <div className={`${styles.imageSkeleton} skeleton`} />
        <div className={styles.info}>
          <div
            className="skeleton"
            style={{ width: 120, height: 14, borderRadius: 4 }}
          />
          <div
            className="skeleton"
            style={{ width: "80%", height: 32, borderRadius: 6 }}
          />
          <div
            className="skeleton"
            style={{ width: 100, height: 20, borderRadius: 4 }}
          />
          <div
            className="skeleton"
            style={{ width: 160, height: 40, borderRadius: 6 }}
          />
          <div
            className="skeleton"
            style={{ width: 80, height: 14, borderRadius: 4 }}
          />
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: 48,
              borderRadius: 99,
              marginTop: 8,
            }}
          />
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: 120,
              borderRadius: 6,
              marginTop: 16,
            }}
          />
        </div>
      </div>
    </div>
  );
}
