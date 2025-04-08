import BuildingViewer from "@/components/LandLordDashboad/MyProperties/BuildingViewer";

export default async function Page({ params }: { params: { buildingId: string } }) {
  return <BuildingViewer buildingId={params.buildingId} />;
}
