// Usage example
const envManager = EnvManager.new({
  PORT: z.string().min(1).max(5).default("3000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
})

const env = envManager.envs

console.log(env.PORT)       // ✅ "3000"
console.log(env.NODE_ENV)   // ✅ "development"
