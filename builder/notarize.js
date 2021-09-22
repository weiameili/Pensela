/*
  See https://github.com/electron/electron-notarize for more information about why it's needed.
  Also, when notarizing the app should add "afterSign": "builder/notarize.js" into the electron builder
  configuration file.
*/

import { notarize } from "electron-notarize";
import { appId } from "../electron-builder.json";

const _default = async function notarizeApp(context) {
  if (process.env.NOTARIZE !== "true") return;

  if (context.electronPlatformName !== "darwin")
    throw new Error("Notarization must be performad on macOS!");

  if (!(
    process.env.APPLE_ID &&
    process.env.APPLE_ID_PASSWORD &&
    process.env.CSC_NAME
  )) {
    throw new Error(
      "APPLE_ID, APPLE_ID_PASSWORD and CSC_NAME env variables must be set!"
    );
  }

  if (!(typeof appId === "string" && appId.length > 0))
    throw new Error("build.appId must be set in package.json!");

  return await notarize({
    appBundleId: appId,
    appPath: `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};

export { _default as default };