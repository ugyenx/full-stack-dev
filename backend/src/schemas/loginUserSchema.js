const { z } = require("zod");

const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Cannot exceed more that 255 characters")
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1, "Password is required"),
});

module.exports = { loginUserSchema };
