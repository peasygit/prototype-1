import HelperProfileClient from './HelperProfileClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HelperProfilePage({ params }: PageProps) {
  const { id } = await params;
  // Pass id to client component
  return <HelperProfileClient id={id} />;
}
