import BuildingViewer from "@/components/StudentDashboard/Dorms/BuildingViewer";

export default function Page({
  params,
  searchParams,
}: {
  params: { buildingId: string };
  searchParams: { [key: string]: string | undefined }; // ← THIS is the fix
}) {
  return (
    <BuildingViewer
      buildingId={params.buildingId}
      name={searchParams.name}
      address={searchParams.address}
      description={searchParams.description}
    />
  );
}
