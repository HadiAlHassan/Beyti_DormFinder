import Image from "next/image";

interface HalfPageComponentProps {
  dynamicText: string;
}

export default function HalfPageComponent({ dynamicText }: HalfPageComponentProps) {
  return (

      <div className="flex bg-emerald-800 flex flex-col items-center justify-center w-full ">
        
        <Image src="/beytilogowhite1.png" alt="Display Image" width={400} height={400} className="mb-4 w-1/2 h-auto" />

        <h2 className="text-white text-4xl font-bold">Beyti</h2>

        <p className="text-white text-xl mt-4">{dynamicText}</p>

      </div>
  );
}
