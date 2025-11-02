import fs from "fs";
import path from "path";
import yaml from "yaml";

export function loadFlow(flowId: string) {
  const flowPath = path.join(process.cwd(), "flows", `${flowId}.yaml`);
  const file = fs.readFileSync(flowPath, "utf8");
  return yaml.parse(file);
}
