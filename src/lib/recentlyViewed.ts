export interface RecentlyViewedItem {
  _id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  category?: string;
}

const RECENTLY_VIEWED_KEY = "onecarta_recently_viewed";
const MAX_RECENTLY_VIEWED = 10;

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  const existing = getRecentlyViewed().filter((p) => p.slug !== item.slug);
  const updated = [item, ...existing].slice(0, MAX_RECENTLY_VIEWED);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
}