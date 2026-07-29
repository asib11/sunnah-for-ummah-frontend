import ProductDetailsClient from "./ProductDetailsClient";

// Thin server component — resolves instantly so navigation is immediate.
// Passes the route param down as a plain prop; all data fetching is client-side.
export default async function ProductDetailsPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ProductDetailsClient handle={handle} />;
}
