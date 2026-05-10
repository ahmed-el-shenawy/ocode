export default async function ChatPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  return <div>Chat — under construction (Resume: {resumeId})</div>;
}
