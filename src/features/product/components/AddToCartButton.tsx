"use client";

import { useState } from "react";
import { useCartStore } from "@/features/cart/store";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: {
    id: number;
    productId: number;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.quantityControl}>
        <button
          className={styles.quantityButton}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={disabled || quantity <= 1}
          aria-label="Miktarı azalt"
        >
          -
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          className={styles.quantityButton}
          onClick={() => setQuantity((q) => q + 1)}
          disabled={disabled}
          aria-label="Miktarı artır"
        >
          +
        </button>
      </div>
      <button
        className={`${styles.addButton} ${added ? styles.added : ""}`}
        onClick={handleAdd}
        disabled={disabled}
        aria-label={`${product.name} sepete ekle`}
      >
        {disabled
          ? "Stokta Yok"
          : added
            ? "Sepete Eklendi!"
            : "Sepete Ekle"}
      </button>
    </div>
  );
}
