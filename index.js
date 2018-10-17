// Seed Packer
"use strict";

// Dependencies
const findRoot = require("find-root");
const fs = require("fs");
const glob = require("glob");
const packfinder = require("seed-packfinder");
const path = require("path");
const root = findRoot(process.cwd());

const SEEDCSS_NAMESPACE = "@seedcss";
const SEEDCSS_PATH = `${SEEDCSS_NAMESPACE}/`;

// Methods

const getPathFile = function(file) {
  if (!file) {
    return false;
  }

  if (file.indexOf("_seed-packs.scss") < 0) {
    console.log("A non-glob path must include _seed-pack.scss");
    process.exit(1);
    return false;
  }

  file = path.join(root, file);
  const stat = fs.statSync(file).isFile();

  if (!stat) {
    console.log("seed-packer could not find " + file + ".");
    console.log(
      "Please double check to make sure the path to _seed-packs.scss is correct."
    );
    console.log(
      "If you're not sure, you can try using seed-packer with an argument."
    );
    return process.exit(1);
  } else {
    return file;
  }
};

const getPackFile = function(filePath) {
  // Default glob path
  filePath = filePath ? filePath : "**/*.scss";

  let file = false;
  const options = {
    ignore: ["bower_components/**/*", "node_modules/**/*"]
  };

  if (filePath.indexOf("*.scss") >= 0) {
    const scssFiles = glob.sync(filePath, options);

    if (!scssFiles.length) {
      return false;
    }

    for (let i = 0, len = scssFiles.length; i < len; i++) {
      const f = scssFiles[i];
      if (f.indexOf("_seed-packs.scss") >= 0) {
        file = f;
        break;
      }
    }
  } else {
    file = getPathFile(filePath);
  }

  return file;
};

const getResetPacks = function(packs) {
  return packs.filter(function(pack) {
    return pack.indexOf("reset") >= 0;
  });
};

const prioritizeResetPacks = function(packs) {
  var resetPacks = getResetPacks(packs);
  if (resetPacks.length) {
    resetPacks.forEach(function(pack) {
      packs.splice(packs.indexOf(pack), 1);
      packs.unshift(pack);
    });
  }
  return packs;
};

const addPacks = function(packs, file) {
  if (!packs || !file) {
    return false;
  }

  // Prioritize reset packs
  packs = prioritizeResetPacks(packs);

  let template = "// Seed packs\n";
  template += "// Automagically added by seed-packer <3\n\n";

  for (let i = 0, len = packs.length; i < len; i++) {
    let p = packs[i];
    p = p.replace(SEEDCSS_PATH, "");

    template += '@import "pack/' + p + '/_index";\n';
  }
  // Write to file
  fs.writeFileSync(file, template);

  return template;
};

const seedPacker = function(filePath) {
  const packs = packfinder.find();
  if (!packs) {
    return false;
  }

  const file = getPackFile(filePath);

  if (!file) {
    return;
  }

  return addPacks(packs, file);
};

module.exports = seedPacker;
