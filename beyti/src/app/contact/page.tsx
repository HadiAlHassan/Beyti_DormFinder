import ContactSummary from "@/components/ContactUs/ContactSummary";
import Form from "@/components/ContactUs/Form"

export default function ContactUs() {
    return (
        <div className="flex flex-row ">
            <div className="flex w-1/3">
                <ContactSummary />
            </div>
            <div className="flex w-2/3 m-12">
                <Form />
            </div>
        </div>
    );
}
