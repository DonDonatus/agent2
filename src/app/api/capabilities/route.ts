import { NextApiRequest, NextApiResponse } from "next";

// Define the handler function for the API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const capabilityStatement = {
    company_name: "VB Capital Partners Corp",
    contact_information: {
      email: process.env.CONTACT_EMAIL,
      website: "https://www.vbcapitalpartners.com",
      address: process.env.CONTACT_ADDRESS,
      phone: process.env.CONTACT_PHONE
    },
    company_data: {
      accepts_credit_cards: true,
      accepts_p_cards: true,
      disaster_response_registry: false,
      gsa_schedule_contract: "In Progress",
      socioeconomic_status: "In Progress"
    },
    identifiers: {
      unique_entity_id: "W9AKS8GB65U3",
      cage_ncage: "04B79"
    },
    naics_codes: [
      "541511", "541512", "541513", "541519", "541611", "541690", "541990"
    ],
    psc_codes: [
      "D302", "D306", "D307", "D308", "D310", "D316", "D39"
    ],
    special_item_numbers: [
      "54151S", "54151HEAL", "54151HACS", "518210C", "541611"
    ],
    core_services: {
      advisory_management_consulting: {
        description: "Providing strategic advisory and management consulting services tailored to client needs."
      },
      risk_management_cybersecurity: {
        description: "Helping organizations identify, assess, and mitigate security risks while ensuring regulatory compliance."
      },
      financial_management_cyber_finance: {
        description: "Consulting on financial security, business optimization, and governance risk frameworks."
      },
      process_improvement_organizational_restructuring: {
        description: "Optimizing business processes and restructuring organizations for efficiency and sustainability."
      },
      audit_remediation_sustainment: {
        description: "Ensuring audit readiness and implementing long-term compliance solutions for federal agencies."
      },
      risk_management_continuous_monitoring: {
        description: "Providing continuous security risk assessment and proactive compliance monitoring."
      },
      capital_markets_application_development: {
        description: "Offering solutions for capital markets and application development aligned with business objectives."
      },
      issue_management_remediation: {
        description: "Developing tailored strategies for resolving operational challenges and regulatory issues."
      }
    },
    value_proposition: "Balancing industry expertise, IT security knowledge, and practical solutions tailored to client-specific needs.",
    vision_statement: "Making leadership and business easier through trust, relationships, and high-quality solutions that challenge the status quo.",
    previous_current_clients: [
      "U.S. Department of Defense",
      "U.S. Department of Veterans Affairs",
      "U.S. Department of Homeland Security",
      "U.S. Department of Labor",
      "U.S. Department of Education",
      "U.S. Department of Health & Human Services",
      "National Institutes of Health",
      "Defense Information Systems Agency",
      "Santander",
      "CapitalOne"
    ]
  };

  res.status(200).json(capabilityStatement);
}
