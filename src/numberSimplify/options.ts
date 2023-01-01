
export interface NumberSimplifyOptions {

  precision: number;

  decimalSeparator: string;

  lowercase: boolean;

  space: boolean;

  units: string[];
}


export const defaultOptions: NumberSimplifyOptions = {
  decimalSeparator: ".",
  lowercase: false,
  precision: 1,
  space: false,
  units: [
    "",
    "K", // Thousand
    "M", // Million
    "B", // Billion
    "T", // Trillion
    "P", // Quadrillion
    "E", // Quintillion
  ],
};
