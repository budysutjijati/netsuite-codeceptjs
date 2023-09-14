const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

const path = require('path');

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  async bootstrap() {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  },
  tests: './tests/*_test.js',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://www.google.nl',
      show: true
    }
  },
  plugins: {
    commentStep: {
      enabled: true,
      registerGlobal: true
    },
    autoLogin: {
      enabled: true,
      saveToFile: false,
      inject: 'login',
      users: {
        qa: {
          login: (I) => I.loginNetSuite(),
  
          check: (I) => {
            I.amOnPage('/');
            I.see('Home');
          }
        }
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'netsuite-codeceptjs'
}