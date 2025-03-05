import FeatureGrid from "@/components/AboutUs/UpperPart";
import ImagePreview from "@/components/AboutUs/ImagePreview";
import ImageGrid from "@/components/AboutUs/LowerPart";
import InfoSection from "@/components/AboutUs/InfoPart";

export default function aboutus() {
  return (
    <div className="flex flex-col w-full">
      <div className="h-1/2 flex">
        <div className="basis-1/3">
          <ImagePreview src="/AboutUsPreview.png" />
        </div>

        <div className="basis-2/3 p-10">
          <FeatureGrid />
        </div>
      </div>
      <div className="h-1/2 flex">
        <div className="basis-1/3 ml-24">
          <ImageGrid />
        </div>
        <div className="basis-2/3">
          <InfoSection />
        </div>
      </div>
    </div>
  );
}
