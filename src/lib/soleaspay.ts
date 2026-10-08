export type MobileService = {
  id: number;
  name: string;
  description: string;
};

export type Country = {
  code: string;
  name: string;
  currency: string;
  services: MobileService[];
};

export const SOLEASPAY_COUNTRIES: Country[] = [
  {
    code: "CM",
    name: "Cameroun",
    currency: "XAF",
    services: [
      { id: 1, name: "MTN Mobile Money", description: "MOMO Cameroun" },
      { id: 2, name: "Orange Money", description: "OM Cameroun" },
    ],
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    currency: "XOF",
    services: [
      { id: 29, name: "Orange Money", description: "OM Côte d'Ivoire" },
      { id: 30, name: "MTN Money", description: "MOMO Côte d'Ivoire" },
      { id: 31, name: "Moov Money", description: "Moov Côte d'Ivoire" },
      { id: 32, name: "Wave", description: "Wave Côte d'Ivoire" },
    ],
  },
  {
    code: "BF",
    name: "Burkina Faso",
    currency: "XOF",
    services: [
      { id: 33, name: "Moov Money", description: "Moov Burkina Faso" },
      { id: 34, name: "Orange Money", description: "OM Burkina Faso" },
    ],
  },
  {
    code: "BJ",
    name: "Bénin",
    currency: "XOF",
    services: [
      { id: 35, name: "MTN Money", description: "MOMO Bénin" },
      { id: 36, name: "Moov Money", description: "Moov Bénin" },
    ],
  },
  {
    code: "TG",
    name: "Togo",
    currency: "XOF",
    services: [
      { id: 37, name: "T-Money", description: "T-Money Togo" },
      { id: 38, name: "Moov Money", description: "Moov Togo" },
    ],
  },
  {
    code: "COD",
    name: "Congo (RDC)",
    currency: "CDF",
    services: [
      { id: 52, name: "Vodacom", description: "Vodacom RDC" },
      { id: 53, name: "Airtel Money", description: "Airtel RDC" },
      { id: 54, name: "Orange Money", description: "Orange RDC" },
    ],
  },
  {
    code: "COG",
    name: "Congo Brazzaville",
    currency: "XAF",
    services: [
      { id: 55, name: "Airtel Money", description: "Airtel Congo" },
      { id: 56, name: "MTN Money", description: "MOMO Congo" },
    ],
  },
  {
    code: "GAB",
    name: "Gabon",
    currency: "XAF",
    services: [{ id: 57, name: "Airtel Money", description: "Airtel Gabon" }],
  },
  {
    code: "UGA",
    name: "Ouganda",
    currency: "UGX",
    services: [
      { id: 58, name: "Airtel Money", description: "Airtel Ouganda" },
      { id: 59, name: "MTN Money", description: "MOMO Ouganda" },
    ],
  },
];

export function getCountry(code: string): Country | undefined {
  return SOLEASPAY_COUNTRIES.find((c) => c.code === code);
}
