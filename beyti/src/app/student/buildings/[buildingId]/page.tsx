import BuildingViewer from "@/components/StudentDashboard/Dorms/BuildingViewer";

export default function Page({ params }: { params: { buildingId: string } }) {
  return <BuildingViewer buildingId={params.buildingId} />;
}
