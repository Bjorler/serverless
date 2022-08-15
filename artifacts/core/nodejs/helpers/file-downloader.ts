import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import { mkdir, pathExistsSync } from "fs-extra";

/**
 * Downloads file from remote HTTP[S] host and puts its contents to the
 * specified location.
 */
export async function downloadFile(url: string, rootDir: string = "/tmp/") {
  const split_url = url.split("/");

  if (!pathExistsSync(rootDir)) {
    mkdir(rootDir);
  }

  const filename = rootDir + split_url[split_url.length - 1];
  const proto = !url.charAt(4).localeCompare("s") ? https : http;

  return new Promise<Boolean | String>((resolve, reject) => {
    const file = fs.createWriteStream(filename);

    const request = proto.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(filename, () => {
          resolve(false);
        });
        return;
      }

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on("finish", () => resolve(filename));

    request.on("error", (err) => {
      fs.unlink(filename, () => resolve(false));
    });

    file.on("error", (err) => {
      fs.unlink(filename, () => resolve(false));
    });

    request.end();
  });
}
