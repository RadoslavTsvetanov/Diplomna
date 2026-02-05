import { panic } from "@blazyts/better-standard-library";

export type TopicSchemaDefault = { [version: `v${number}`]: Record<string, unknown> }

export class TopicSchema<T extends TopicSchemaDefault> {
  public readonly type = "topic-schema" as const 
  private versions: T;

  constructor(versions: T) {
    this.versions = versions;
  }

  TGetVersions: T = () => panic("using type only method ")

  getVersion<V extends keyof T>(version: V): T[V] {
    return this.versions[version];
  }

  getAllVersions(): T {
    return this.versions;
  }

  hasVersion(version: string): version is keyof T {
    return version in this.versions;
  }

  getVersionKeys(): (keyof T)[] {
    return Object.keys(this.versions) as (keyof T)[];
  }
}