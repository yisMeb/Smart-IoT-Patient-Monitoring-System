import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Terms: React.FC = () => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-4">Last updated: February 14, 2025</p>
        <p className="mb-4">Please read these terms and conditions carefully before using Our Service.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Interpretation and Definitions</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Interpretation</h3>
        <p className="mb-4">
          The words of which the initial letter is capitalized have meanings defined under the following conditions.
          The following definitions shall have the same meaning regardless of whether they appear in singular or in
          plural.
        </p>

        <h3 className="text-lg font-medium mt-4 mb-2">Definitions</h3>
        <p className="mb-2">For the purposes of these Terms and Conditions:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Affiliate:</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest, or other securities entitled to vote for election of directors or other managing authority.
          </li>
          <li className="mb-2">
            <strong>Country:</strong> refers to Ethiopia.
          </li>
          <li className="mb-2">
            <strong>Company:</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to TENA GUARD.
          </li>
          <li className="mb-2">
            <strong>Device:</strong> means any device that can access the Service, such as a computer, cellphone, or digital tablet.
          </li>
          <li className="mb-2">
            <strong>Service:</strong> refers to the Website.
          </li>
          <li className="mb-2">
            <strong>Terms and Conditions:</strong> (also referred to as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the <a href="https://www.termsfeed.com/terms-conditions-generator/" target="_blank">Terms and Conditions Generator</a>.
          </li>
          <li className="mb-2">
            <strong>Third-party Social Media Service:</strong> means any services or content (including data, information, products, or services) provided by a third party that may be displayed, included, or made available by the Service.
          </li>
          <li className="mb-2">
            <strong>Website:</strong> refers to TENA GUARD, accessible from <a href="https://main.d3etx1c2gs52pg.amplifyapp.com" rel="external nofollow noopener" target="_blank">this link</a>.
          </li>
          <li className="mb-2">
            <strong>You:</strong> means the individual accessing or using the Service, or the company or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
          </li>
        </ul>
        
        <h2>Acknowledgment</h2>
        <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company...</p>
      </div>
    </ScrollArea>
  );
};

export default Terms;
