// Test :: Packer
const assert = require('chai').assert;
const findRoot = require('find-root');
const fs = require('fs');
const packer = require('../index');
const path = require('path');
const root = findRoot(process.cwd());

beforeEach(function(done) {
  // Wipes _seed-pack.scss to blank
  let file = '/test/scss/_seed-packs.scss';
  file = path.join(root, file);
  fs.writeFileSync(file, '');
  done();
});

describe('packer: writes', function() {
  const output = packer();

  it('should automatically add seed packs (from package.json)', function(done) {
    assert.equal(true, output.includes('seed-breakpoints'));
    done();
  });

  it('should automatically add @seedcss/ seed packs (from package.json)', function(done) {
    assert.equal(true, output.includes('pack/seed-color-scheme/_index'));
    done();
  });

  it('should automatically prefix seed packs with @import', function(done) {
    assert.equal(true, output.includes('@import'));
    done();
  });
});


describe('packer: custom path', function() {
  it('should locate _seed-pack.scss from custom glob path', function(done) {
    assert.equal(true, packer('./test/scss/**/*.scss').includes('seed-breakpoints'));
    done();
  });

  it('should locate _seed-pack.scss from absolute path', function(done) {
    assert.equal(true, packer('/test/scss/_seed-packs.scss').includes('seed-breakpoints'));
    done();
  });
});
