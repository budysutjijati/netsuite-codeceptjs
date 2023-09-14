const { I } = inject();
const generateTOTPToken = require('netsuite-totp')

module.exports = {

    answerNetSuiteSecurityQuestion: async(bodyText) => {
        console.log('Answering security question');
        const questionsAndAnswers = {
            'In what city did you meet your spouse/significant other?': process.env.NS_SECURITY_QUESTION_SPOUSE,
            'What was your childhood nickname?': process.env.NS_SECURITY_QUESTION_NICKNAME,
            'In what city or town was your first job?': process.env.NS_SECURITY_QUESTION_FIRST_JOB,
            'What is your maternal grandmother\'s maiden name?': process.env.NS_SECURITY_QUESTION_GRANDMOTHER
        };
    
        for (const [question, answer] of Object.entries(questionsAndAnswers)) {
            if (bodyText.includes(question)) {
                console.log(`Answering security question: ${question}`);
                await this.answerQuestionWith(answer);
                return;
            }
        }
        console.log('No security question matched');
    },
    
    answerQuestionWith: async(answer) => {
        I.click('input[name="answer"]');
        I.fillField('input[name="answer"]', answer);
    
        this.helpers['Playwright'].wait(10);
        await this.helpers['Playwright'].click('Submit');
    },
    
    
    twoFactorLogin: async() => {
        // I.saveScreenshot('./tests/output/login/5_login_entered_totp.png');
        const intToken = await new generateTOTPToken({
            secret: `${process.env.NS_2FAKEY}`,
            digits: 6,
            period: 30,
        }).generateToken();
    
        console.log(`I fill field with placeholder 6-digit code ${JSON.stringify(intToken)}`);
        I.fillField( locate('input').withAttr({ placeholder: '6-digit code' }), intToken);
    
        // I.saveScreenshot('./tests/output/login/5_login_entered_totp.png');
    
        console.log('I click button Submit');
        I.click('Submit');
        I.wait(5);
        I.amOnPage('https://system.netsuite.com/app/center/card.nl?sc=-29&whence=');
    }
}