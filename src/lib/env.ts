const serverEnv = {
  JWT_SECRET: process.env.JWT_SECRET,
};

const clientEnv = {
  BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
};

// Validation function
export function validateEnv() {
  const requiredServerVars = ["JWT_SECRET"];
  const requiredClientVars = ["NEXT_PUBLIC_BASE_API_URL"];

  requiredServerVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  requiredClientVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

// Runtime check (development-এ)
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  validateEnv();
}

export const envVariables = {
  ...serverEnv,
  ...clientEnv,
} as const;
