var app = require('app')
var window = require('electron-window')
var ipc = require('ipc')
var path = require('path')
var args = require('./args')
var mocha = require('./mocha')

// these were suppose to do something, but they don't
// https://github.com/atom/electron/blob/master/docs/api/chrome-command-line-switches.md#--vlog_level
// app.commandLine.appendSwitch('v', -1)
// app.commandLine.appendSwitch('vmodule', 'console=0')

var opts = args.parse(process.argv)

app.on('ready', function () {
  if (!opts.renderer) {
    mocha.run(opts, exit)
  } else {
    var win = window.createWindow({ height: 700, width: 1200 })
    // undocumented call in electron-window
    win._loadUrlWithArgs(path.resolve('./renderer/index.html'), opts, Function())
    //win.showUrl(path.resolve('./renderer/index.html'))
    ipc.on('mocha-done', function (event, code) {
      console.log('done')
      exit(code)
    })
  }
})

function exit (code) {
  // process.exit() does not work properly
  // app.quit() does not set code
  // bug in Electron, see issue: https://github.com/atom/electron/issues/1983
  app.quit(code)
}
