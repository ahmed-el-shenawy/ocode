export default async function PreviewPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  return <div>Preview — under construction (Resume: {resumeId})</div>;
}
