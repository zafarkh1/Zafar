import { writeFileSync } from "fs";
import { join } from "path";

export const writeFileCustom = (path) => {
  writeFileSync(join(process.cwd(), "src", "data", path)),
    JSON.stringify(data, null, 4);
		return "Ok"
};
