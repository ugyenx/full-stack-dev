const { z } = require("zod");

const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must at least contain 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain  at least 8 characters")
    .max(72, "Password cannot contain more that 72 characters"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),
});

module.exports = {
  registerUserSchema,
};
