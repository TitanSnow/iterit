const cp = require('child_process')

const pipeline = [
  'clean.js',
  'prepare.js',
  'step1.js',
  'step2.mjs',
  'step3.js',
  'step4.js'
]

for (const file of pipeline) {
  console.log(file.split('.')[0] + ' ...')
  cp.execFileSync(
    process.execPath,
    ['--experimental-modules', 'build/' + file],
    {
      stdio: 'inherit'
    }
  )
}
