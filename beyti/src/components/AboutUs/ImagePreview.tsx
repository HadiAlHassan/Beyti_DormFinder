import Image from "next/image";

const ImagePreview = ({src="", text = "" }) => {
  return (
    <div className="h-full flex justify-center items-center relative">
      <Image
        src={src}
        alt="Hero Image"
        width={800}
        height={600}
        className="max-h-full w-full object-contain rounded-3xl"
      />
      <div className="absolute top-10 left-0 text-center p-4">
        <h1 className="text-white font-bold text-xl">{text}</h1>
      </div>
    </div>
    
  );
};

export default ImagePreview;