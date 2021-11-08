export default class StaticConfig {
  static browserEnv =
    process.env.NEXT_PUBLIC_ENV === "dev" ? "development" : "production";

  static browserIsDev() {
    return this.browserEnv === "development";
  }
}
