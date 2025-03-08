import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button"; // Import Button from ShadCN
  import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    MessageCircle,
  } from "lucide-react";
  
  const ContactSummary = () => {
    return (
      <Card className="max-w-sm mx-auto bg-emerald-800 m-10 p-4 rounded-lg shadow-lg flex flex-col ">
        <CardHeader>
          <h2 className="text-2xl font-bold text-white">Contact Information</h2>
        </CardHeader>
  
        {/* Ensures content expands to push footer to the bottom */}
        <CardContent className="flex-grow space-y-4">
          <p className="text-white pb-10">Please feel free to contact us!</p>
  
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center gap-2 text-white hover:bg-emerald-700 p-4"
            asChild
          >
            <a href="tel:+96101123456">
              <Phone className="w-5 h-5" />
              +961 01 123 456
            </a>
          </Button>
  
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center gap-2 text-white hover:bg-emerald-700 p-4"
            asChild
          >
            <a href="mailto:combinatorialSolutions@gmail.com">
              <Mail className="w-5 h-5" />
              combinatorialSolutions@gmail.com
            </a>
          </Button>
  
          <div className="flex items-center gap-2 text-white p-4">
            <MapPin className="w-5 h-5 text-white" />
            <span>
              Office 22, Honor Building, Baalbek Street, Hamra, Beirut, Lebanon
            </span>
          </div>
        </CardContent>
  
        {/* Stick the footer to the bottom */}
        <CardFooter className="flex justify-center gap-4 mt-auto">
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <a href="https://facebook.com">
              <Facebook className="w-6 h-6 text-white" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
            asChild
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6 text-white hover:text-gray-300 transition-colors" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent"
            asChild
          >
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-6 h-6 text-white hover:text-red-300 transition-colors" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  export default ContactSummary;
  