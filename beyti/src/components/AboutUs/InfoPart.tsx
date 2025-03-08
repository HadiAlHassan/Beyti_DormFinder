import { Button } from "@/components/ui/button";

const InfoSection = () => {
  return (
    <div className=" space-y-4 p-16 pl-24">
      <h1 className="text-5xl font-bold  text-emerald-800">
        Flexibility and options to suit your lifestyle.
      </h1>
      <p className="text-gray-600">
      At Combinatorial Solutions, we understand the challenges students face when searching for the perfect place to live. Finding a suitable dorm, securing compatible roommates, and ensuring a smooth transition to university life can be overwhelming.
      <br /><br />
      As former students who have experienced these struggles firsthand, we created Beyti—a platform designed to simplify dorm selection and roommate matching. Our mission is to provide affordable, convenient, and student-friendly housing solutions, ensuring every student finds a comfortable and secure living space.
      <br /><br />
      With a deep commitment to our university community, we strive to support both incoming and current students in making informed housing decisions. By combining technology with real-world experience, we aim to foster a harmonious and stress-free living environment, helping students focus on what truly matters—their education and personal growth.
      <br /><br />
      Join us in making student life easier, one dorm at a time.
      </p>
      <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
        Search Dorms
      </Button>
    </div>
  );
};

export default InfoSection;
