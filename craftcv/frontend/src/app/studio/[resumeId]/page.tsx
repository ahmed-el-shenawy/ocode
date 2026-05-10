export default async function StudioPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  return <div>Studio — under construction (Resume: {resumeId})</div>;
}
