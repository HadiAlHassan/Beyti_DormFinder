import { Button } from "@/components/ui/button";

const InfoSection = () => {
  return (
    <div className=" space-y-4 p-16 pl-24">
      <h1 className="text-5xl font-bold ">
        Flexibility and options to suit your lifestyle.
      </h1>
      <p className="text-gray-600">
        Here we can write a brief about combinatorial solutions, our hard time
        looking for roommates, and our hope to help our beloved university and
        the newcomers to have a great peaceful life.
      </p>
      <Button className="bg-green-700 hover:bg-green-800 text-white">
        Search Dorms
      </Button>
    </div>
  );
};

export default InfoSection;
