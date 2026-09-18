import CategoryPageClient from "./CategoryPageClient";

// Thin server component — resolves instantly so navigation is immediate.
// Passes the route param down as a plain prop; no async awaits here.
export default async function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <CategoryPageClient handle={handle} />;
}
