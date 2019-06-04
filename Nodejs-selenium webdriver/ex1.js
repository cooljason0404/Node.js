var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

//高鐵訂票系統
driver.get('https://irs.thsrc.com.tw/IMINT/');
//起程站
driver.findElement(By.name('selectStartStation')).sendKeys('台中');
//到達站
driver.findElement(By.name('selectDestinationStation')).sendKeys('台北');
//車廂種類 ID=trainCon:trainRadioGroup_0標準車廂 
driver.findElement(By.id('trainCon:trainRadioGroup_1')).click();
/**
 * 座位喜好 
 * 無      id=seatRadio0  
 * 靠窗優先 id=seatRadio1  
 * 走到優先 id=seatRadio2 
 * */
driver.findElement(By.id('seatRadio1')).click();
/**
 * 訂位方式 
 * 依時間搜尋合適車次 id=bookingMethod_0
 * 直接輸入車次號碼   id=bookingMethod_1
 */
driver.findElement(By.id('bookingMethod_0')).click();
/**
 * 時間
 * 去程時間 Format YYYY/MM/DD id=toTimeInputField
 */
driver.findElement(By.id('toTimeInputField')).sendKeys('2018/8/17');
//約hh:mm出發 Format hh:mm name=toTimeTable
driver.findElement(By.name('toTimeTable')).sendKeys('18:00');
//選擇輸入車次號碼 name=toTrainIDInputField
//driver.findElement(By.name('toTimeTable')).sendKeys('XXXX');

/**
 * 票數
 */

//driver.findElement(By.name('btnK')).submit();
//driver.wait(until.titleIs('webdriver - Google 搜尋'), 10000);
//driver.quit();