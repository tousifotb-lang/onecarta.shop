"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function RecoverCartPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const { addItem } = useCartStore();
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const restore = async () => {
      try {
        const res = await fetch(`/api/cart/recover/${token}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();

        data.items.forEach((item: any) => {
          addItem(
            {
              _id: item.productId,
              name: item.name,
              slug: item.slug,
              image: item.image,
              price: item.price,
              originalPrice: item.originalPrice,
              category: item.category,
              brand: item.brand,
              stock: item.stock,
            },
            item.quantity
          );
        });

        router.push("/checkout");
      } catch {
        setErrored(true);
      }
    };
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (errored) {
    return (
      <div className="container-main py-20 text-center text-gray-500">
        This recovery link has expired or the items are no longer available.
      </div>
    );
  }

  return (
    <div className="container-main py-20 text-center text-gray-500">
      Restoring your cart...
    </div>
  );
}