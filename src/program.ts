import { Denomander } from "../deps.ts";
import version from '../version.ts';

const program = new Denomander({
  app_name: "Git Fury",
  app_description: "Enables shorthand git syntax to sharpen your git fu and enhance productivity",
  app_version: version,
});

export default program;