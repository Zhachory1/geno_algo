const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadSketch() {
  const context = {
    ENTER: 13,
    keyCode: 13,
    noLoopCalls: 0,
    loopCalls: 0,
  };
  context.noLoop = () => {
    context.noLoopCalls++;
  };
  context.loop = () => {
    context.loopCalls++;
  };
  vm.createContext(context);
  vm.runInContext(
      fs.readFileSync(path.join(__dirname, '..', 'sketch.js'), 'utf8'),
      context,
  );
  return context;
}

function addPauseController(context) {
  const pauseController = {
    updates: 0,
    onChange(handler) {
      this.handler = handler;
    },
    updateDisplay() {
      this.updates++;
    },
  };
  const gui = {
    addFolder() {
      return {
        add(_options, name) {
          return name == 'pause' ? pauseController : {};
        },
      };
    },
  };

  context.setUpPopOptions(gui);
  return pauseController;
}

test('Enter pauses and resumes the draw loop', () => {
  const context = loadSketch();

  context.keyPressed();
  assert.equal(vm.runInContext('options.pause', context), true);
  assert.equal(context.noLoopCalls, 1);
  assert.equal(context.loopCalls, 0);

  context.keyPressed();
  assert.equal(vm.runInContext('options.pause', context), false);
  assert.equal(context.noLoopCalls, 1);
  assert.equal(context.loopCalls, 1);
});

test('keyboard and GUI pause controls stay in sync', () => {
  const context = loadSketch();
  const pauseController = addPauseController(context);

  context.keyPressed();
  assert.equal(vm.runInContext('options.pause', context), true);
  assert.equal(pauseController.updates, 1);

  pauseController.handler(false);
  assert.equal(vm.runInContext('options.pause', context), false);
  assert.equal(context.loopCalls, 1);
  assert.equal(pauseController.updates, 2);
});
