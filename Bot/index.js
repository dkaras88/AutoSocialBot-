

class InstagramBot {

    constructor() {
        this.firebase_db = require('./db'); //Import Firebase Dabase Methods
        this.config = require('./config/puppeteer.json'); //Import Puppeteer Config File
        this.today=new Date().toISOString().slice(0, 10)
    }

    async initPuppeter() {
        const puppeteer = require('puppeteer');
        
        this.browser = await puppeteer.launch({
            headless: this.config.settings.headless, //Headless
            args: ['--no-sandbox'],
            userDataDir:'./mydata'
          
        });
        this.page = await this.browser.newPage();
      
        this.page.setViewport({width: 1200, height:768});
        //User Agent
        this.page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0');

    }


    async initStats(){
        //Initialize Firebase Stats If Date Change.
 let followers = await this.firebase_db.getFollowers();
      console.log(await this.CountResult(followers)+" Followers in DB")
let followings = await this.firebase_db.getFollowings();
      console.log(await this.CountResult(followings)+" Following in DB ")
let tofollowers = await this.firebase_db.todayfollowed(this.today);
      console.log("Today Follow "+tofollowers)
      if(tofollowers==null){
        await this.firebase_db.addFollow('0');
      }
let tounfollow = await this.firebase_db.todayunfollowed(this.today);
      console.log("Today Unfollow "+tounfollow)
      if(tounfollow==null){
        await this.firebase_db.addunFollow('0');
      }
let tocomment= await this.firebase_db.commentsmade(this.today);
      console.log("Today Comments "+tocomment)
      if(tocomment==null){
        await this.firebase_db.addcomment('0');
      }
    }

async CountResult(result){
    //Return Result length of list(firebase Database)
let countr = [];
        if (result) {
            const all_users = Object.keys(result);
            countr= all_users.filter(user =>result[user]);
        }
return countr.length;
}

    async visitInstagram() { 
        /* Open & Login Instagram */
        await this.page.goto(this.config.base_url+"/accounts/login/?source=auth_switcher", {timeout: 60000});
        await this.page.waitFor(2500);
        //await this.page.click(this.config.selectors.home_to_login_button);
        //await this.page.waitFor(2500);
        /* Click on the username field using the field selector*/
        if (await this.page.$(this.config.selectors.password_field) !== null){
         
            await this.page.click(this.config.selectors.username_field);
            await this.page.keyboard.type(this.config.username,{delay:100});
            await this.page.click(this.config.selectors.password_field);
            await this.page.keyboard.type(this.config.password,{delay:100});
            await this.page.click(this.config.selectors.login_button);
            //wait for page redirect
            await this.page.waitForNavigation();
            }
        if (await this.page.$(this.config.selectors.one_tap_button) !== null){
            //onetap 
             await this.page.waitFor(Math.floor(Math.random() *500)+1500);
            await this.page.click("div.cmbtv button");
            //wait for page redirect
          await this.page.waitForNavigation();
        }

        //Close Turn On Notification modal after login
        if (await this.page.$(this.config.selectors.not_now_button) !== null){
       await this.page.click(this.config.selectors.not_now_button);
                   await this.page.waitFor(Math.floor(Math.random() *500)+1500);
               }
//Scroll Element
 await this.ScrollElement('html');
 await this.page.waitFor(Math.floor(Math.random() *500)+1500);

if (await this.page.$("a[href='/accounts/activity/']") !== null){
            //Click Notifications
             await this.page.waitFor(Math.floor(Math.random() *500)+1500);
            await this.page.click("a[href='/accounts/activity/']");

             await this.page.waitFor(Math.floor(Math.random() *2500)+1500);
          await this.page.click("a[href='/accounts/activity/']");

             await this.page.waitFor(Math.floor(Math.random() *2500)+1500);
          await this.page.goto(this.config.base_url+"/"+this.config.myusername, {timeout: 60000});
        }
    }

    async visitHashtagUrl() {
        const shuffle = require('shuffle-array');
        let hashTags = shuffle(this.config.hashTags);
        // loop through hashTags
        for (let tagIndex = 0; tagIndex < hashTags.length; tagIndex++) {
            console.log('<<<< Currently Exploring >>>> #' + hashTags[tagIndex]);
            //visit the hash tag url
            await this.page.goto(`${this.config.base_url}/explore/tags/` + hashTags[tagIndex] + '/?hl=en');
            // Loop through the latest 9 posts
            await this._doPostLikeAndFollow(this.config.selectors.hash_tags_base_class, this.page)
        }
    }


async GetFollowers(){
/*Get Followers to DB */
await this.page.goto(this.config.base_url+"/"+this.config.myusername, {timeout: 60000});
await this.page.click("a[href='/"+this.config.myusername+"/followers/']");
await this.page.waitFor(2000);
let counter=await this.CountFollowers();
console.log(counter+" Followers");
await this.page.waitFor(2000);

counter=counter.replace(/,/g,"");

let following = await this.firebase_db.getFollowers();
        let followusers = [];
        if (following) {
            const all_users = Object.keys(following);
            // filter our current following to get users we've been following since day specified in config
            followusers= all_users.filter(user => following[user].username);
        }

if (followusers>=counter) { 
    //break function if followers exists
    console.log("Skipping Get Followers");
return false;
}
var Scrolltimes=Math.round(counter/10);
console.log(Scrolltimes+"Scroll Times");
for (var i = 0; i <Scrolltimes; i++) {
    await this.ScrollElement(this.config.selectors.follow_list_holder);
    await this.page.waitFor(Math.floor(Math.random() *500)+2000);
}
//await this.ScrollElement(".isgrP");
for (var i = 0; i <Scrolltimes; i++) {
var loopcount=await this.BoxCountFollowers();
if(loopcount>=(counter-10)){break;}
    await this.ScrollElement(this.config.selectors.follow_list_holder);
    await this.page.waitFor(Math.floor(Math.random() *500)+2000);
}
var boxedfollow=await this.BoxCountFollowers();
console.log("ShowBox Counter "+boxedfollow);
for (var ii = 1; ii<=boxedfollow; ii++) {
try{
//followStatus=await this.page.$eval(".isgrP ul li:nth-child("+ii+") button",el => el.innerText);
var getuser=await this.page.$eval(this.config.selectors.follow_list_holder+" ul li:nth-child("+ii+") a",el => el.getAttribute('href'));
getuser=await this.FilterUserName(getuser);
console.log(ii+" "+getuser);
let isArchivedUser = null;
                await this.firebase_db.inFollowers(getuser).then(data => isArchivedUser = data)
                    .catch(() => isArchivedUser = false);

if(!isArchivedUser){
await this.firebase_db.addFollowers(getuser);
}else{
    console.log("Alread Exists In DB");
}
}catch(e){console.log(e)}



}
}

async isVisible(selector) {
  //yet to test
  //version 2
  return await this.page.evaluate((selector) => {
    var e = document.querySelector(selector);
    if (e) {
      var style = window.getComputedStyle(e);

      return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }
    else {
      return false;
    }
  }, selector);
}


async GetFollowing(){
/* Get Following Members to DB */
await this.page.goto(this.config.base_url+"/"+this.config.myusername, {timeout: 60000});
await this.page.click("a[href='/"+this.config.myusername+"/following/']");
await this.page.waitFor(2000);
let counter=await this.CountFollowing();
console.log(counter+" Following");
await this.page.waitFor(2000);

counter=counter.replace(/,/g,"");
var Scrolltimes=Math.round(counter/10);
let following = await this.firebase_db.getFollowings();
        let followusers = [];
        if (following) {
            const all_users = Object.keys(following);
            // filter our current following to get users we've been following since day specified in config
            followusers= all_users.filter(user => following[user].username);
        }

if (followusers>=counter) { 
    //break function if followers exists
    console.log("Skipping Get Following");
return false;
}
console.log(Scrolltimes+"Scroll Times");

for (var i = 0; i <Scrolltimes; i++) {
    await this.ScrollElement(this.config.selectors.follow_list_holder);
    await this.page.waitFor(Math.floor(Math.random() *500)+2000);
}

for (var i = 0; i <Scrolltimes; i++) {

    var loopcount=await this.BoxCountFollowers();
if(loopcount>=(counter-10)){break;}
    await this.ScrollElement(this.config.selectors.follow_list_holder);
    await this.page.waitFor(Math.floor(Math.random() *500)+2000);
}
var boxedfollow=await this.BoxCountFollowers();
//console.log("ShowBox Counter "+boxedfollow);
for (var ii = 1; ii<=boxedfollow; ii++) {
try{
//followStatus=await this.page.$eval(".isgrP ul li:nth-child("+ii+") button",el => el.innerText);
var getuser=await this.page.$eval(this.config.selectors.follow_list_holder+" ul li:nth-child("+ii+") a",el => el.getAttribute('href'));
getuser=await this.FilterUserName(getuser);
console.log(ii+" "+getuser);
let isArchivedUser = null;
                await this.firebase_db.inFollowing(getuser).then(data => isArchivedUser = data)
                    .catch(() => isArchivedUser = false);

if(!isArchivedUser){
await this.firebase_db.addFollowing(getuser);
}else{
    console.log("Alread Exists In DB");
}
}catch(e){console.log(e)}



}
}

async AddComment(){
//Open Profile Page
await this.page.goto(this.config.base_url+"/"+this.config.myusername, {timeout: 60000});
await this.page.click("a[href='/"+this.config.myusername+"/following/']");
 await this.page.waitFor(Math.floor(Math.random() *500)+1000);
//Check comments made today
let tfc=await this.firebase_db.commentsmade(this.today);
if (tfc>=this.config.settings.comments){ 
console.log("Today Comment Limit Exceeded "+this.config.settings.comments);
 return false;}
try{
 let following = await this.firebase_db.getFollowings();
        let followusers = [];
        if (following) {
            const all_users = Object.keys(following);
            // filter our current following to get users we've been following since day specified in config
            followusers= all_users.filter(user => following[user].username);
        }

//console.log(followusers);

for (var i = 0; i < followusers.length; i++) {
    //Generate Random User
var rand=Math.floor(Math.random() *(followusers.length)-1) + 1;
let tfcco=await this.firebase_db.commentsmade(this.today);
if (tfcco>=this.config.settings.comments){ 
console.log("Today Comment Limit Exceeded "+this.config.settings.comments);
 break;}
//console.log(rand);
var saveduser=await this.GetFilteredUser(followusers[rand]);
//Check in History
var isArchivedUser=null;
await this.firebase_db.inHistory(followusers[rand]).then(data => isArchivedUser = data)
                    .catch(() => isArchivedUser = false);

let tfcc=await this.firebase_db.commentsmade(this.today);

if (!isArchivedUser&&tfcc<this.config.settings.comments) { 

const PLINKSELECTOR=this.config.selectors.profile_post_link;
await this.page.goto(this.config.base_url+"/"+saveduser+"/", {timeout: 60000});
await this.page.waitFor(1000 + Math.floor(Math.random() * 3000));


if (await this.page.$(PLINKSELECTOR) !== null){
var genclicks=1 + Math.floor(Math.random() * 3);
for (var i = 1; i <2; i++) {
    console.log("clicking items")
//Select Random Post on User Profile
    var clickitem=1+ Math.floor(Math.random() * 3);
   if (await this.page.$(PLINKSELECTOR+":nth-child("+clickitem+") a")==null){ 
       
    if(clickitem==3){
        if(await this.page.$(PLINKSELECTOR+":nth-child(3) a")==null){
    clickitem=clickitem-1;
        }
    }

    if(clickitem==2){
        if(await this.page.$(PLINKSELECTOR+":nth-child(2) a")==null){
    clickitem=clickitem-1;
        }
    }
    if(clickitem==1){
        if(await this.page.$(PLINKSELECTOR+":nth-child(1) a")==null){
            continue;
           }
    }
};
console.log(clickitem);
await this.page.click(PLINKSELECTOR+":nth-child("+clickitem+") a");

await this.MakeComment(clickitem);   

//Check Like / Already Liked

/*
const links = await this.page.evaluate(() => {
var list=document.evaluate("//h3[text()='Try Again Later']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  console.log(list); // 2. should be defined now
return list;
});
if (links) {return false;}

*/
        }
    }
}
            
                }
}catch(e){console.log(e)}

}

async MakeComment(clickitem){
//version 2

const PLINK=this.config.selectors.profile_post_link;
    //var clickitem=1+ Math.floor(Math.random() * 3);
var getpostid=await this.page.$eval(PLINK+":nth-child("+clickitem+") a",el => el.getAttribute('href'));
//Get Post id from link
getpostid=getpostid.replace("/p/","");
getpostid=getpostid.replace(/\//g,"");
//console.log("postid: "+getpostid)
let getid=await this.firebase_db.GetCommentId(getpostid);
//console.log("is database "+getid);
if (getid==null) {

  let tfcc=await this.firebase_db.commentsmade(this.today);

 await this.page.waitFor(3000 + Math.floor(Math.random() * 2000));
       
  const shuffle = require('shuffle-array');
        let comment = shuffle(this.config.comments); //Get Comments & Randomize it
//Check if comment box exist
if (await this.page.$(this.config.selectors.comment_link)!==null){
await this.page.click(this.config.selectors.comment_link);
        await this.page.keyboard.type(comment[0]);
        //Press Enter 
       await this.page.keyboard.press('Enter');
        await this.page.waitFor(1000 + Math.floor(Math.random() * 2000));
        //Save /Update to Database
         await this.firebase_db.addcomment(Number(tfcc)+1);
await this.firebase_db.addcommentid(getpostid);
console.log("Made Comment "+getpostid);
   await this.MakeLike(getpostid,tfcc);
    }
}else{
  console.log("Comment Skipped \n");
}
}

async MakeLike(getpostid,tfcc){
//version 2
if (await this.page.$("span button svg[aria-label='Like']")!==null){
await this.page.click("span:nth-child(1) button[type='button']");
 await this.page.waitFor(1000 + Math.floor(Math.random() * 1000));

 if (await this.page.$("span button svg[aria-label='"+this.config.lang.unlike+"']")!==null){
 console.log("Made Like...!");
 }
}else{
   if (await this.page.$("span button svg[aria-label='"+this.config.lang.unlike+"']")!==null){
console.log("Alread Liked");
} 
    }


}


async ViewStories(){
  //version 2
await this.page.goto(this.config.base_url, {timeout: 60000});
await this.page.waitFor(1000 +Math.floor(Math.random() * 3000));
console.log("Viewing Stories..!");
//await this.ScrollDown(2);
await this.WaitToClick(this.config.selectors.feed_story_item);
this.timestart=new Date().getTime();
await this.page.waitFor(1000 +Math.floor(Math.random() * 3000));
await this.InterActiveStory();
 console.log("Stories Viewed for "+this.config.settings.view_story_minutes+" Minutes");
   
}



async InterActiveStory(){
  //version 2
var nowt=new Date().getTime();
var maxtime=(this.config.settings.view_story_minutes*60)*1000;
var storytime=maxtime+this.timestart;
///console.log(storytime+" "+nowt);
if (nowt>storytime) {
try{
  await this.page.click("button.-jHC6");
      await this.page.waitFor(2000 +Math.floor(Math.random() * 3000));
  }catch(e){}
  return false;
}else{
  try{
await this.page.waitFor(1000 +Math.floor(Math.random() * 3000));
//await this.WaitToElement(".w9Vr-._6ZEdQ");
if(await this.page.$(this.config.selectors.story_selector)!==null){
await this.page.waitFor(Math.floor(Math.random() *1500)+1500);

let content=await this.page.$$eval(this.config.selectors.story_selector+" div._7zQEa",el => el.length);
for (var ic = 0; ic < content; ic++) {
//await this.page.click("button.ow3u_");
if(await this.page.$(this.config.selectors.story_next_button)!==null){
  await this.page.click(this.config.selectors.story_next_button);
await this.page.waitFor(Math.floor(Math.random() *1500)+1500);
}
await this.page.waitFor(2000 +Math.floor(Math.random() * 3000));
await this.InterActiveStory();
}
}
}catch(e){}
}

}


async BrowseFeed(){
//version 2  
await this.page.goto(this.config.base_url, {timeout: 60000});
console.log("Browsing Feed..!");
var rtimes=20 + Math.floor(Math.random() * 30)
await this.ScrollDown(rtimes);
}


async ScrollDown(times){
//version 2
for (var ir = 0; ir < times; ir++) {
await this.page.waitFor(1000 + Math.floor(Math.random() * 3000));
await this.page.evaluate(()=>{
  var ras=500+Math.floor(Math.random()*500);
  window.scrollBy({
  top: ras,
  behavior: 'smooth'
});
});

}


}


async WaitToClick(ele){
  //version 2
if(await this.page.$(ele)!==null){
            await this.page.click(ele);
await this.page.waitFor(Math.floor(Math.random() *1500)+1500);
return false;
}else{
await this.WaitToElement(ele);
}
}

async WaitToElement(ele){
  //version 2
if(await this.page.$(ele)!==null){
await this.page.waitFor(Math.floor(Math.random() *1500)+1500);
return false;
}else{
await this.WaitToElement(ele);
}
}


async FollowUsers(){
     /* Function Call For FollowFollowers Chech Limit */
let tfc=await this.firebase_db.todayfollowed(this.today);

if (tfc>=this.config.settings.followdaily){ 
console.log("Today Follow Limit Exceeded"); return false;}

 let following = await this.firebase_db.getFollowers();
        let followusers = [];
        if (following) {
            const all_users = Object.keys(following);
            // filter our current following to get users we've been following since day specified in config
            followusers= all_users.filter(user => following[user].username);
        }

for (var i = 0; i < followusers.length; i++) {
//Check Limit
let tfcf=await this.firebase_db.todayfollowed(this.today);

if (tfcf>=this.config.settings.followdaily){ 
console.log("Today Follow Limit Exceeded"); break;}

var rand=Math.floor(Math.random() *followusers.length) + 1;
var saveduser=await this.GetFilteredUser(followusers[rand]);
try{
await this.page.goto(this.config.base_url+"/"+saveduser, {timeout: 60000});
 await this.page.waitFor(1000 + Math.floor(Math.random() * 3000));

//Click Followers Link
if (await this.page.$("a[href='/"+saveduser+"/followers/']") !== null){
    await this.page.click("a[href='/"+saveduser+"/followers/']");
     await this.page.waitFor(2000);
let followers=await this.BoxCountFollowers();
//console.log(followers);
let followstatuss=await this.FollowFollowers(followers);

if (!followstatuss) { continue;}

}else{
    console.log("Account is Private || Element Not Found");
}



}catch(e){ console.log(e)}
}


}

async FollowFollowers(counter){
    /* Function Use For Follow Users On Dailog Box */

let tfc=await this.firebase_db.todayfollowed(this.today)
//console.log(tfc)
//Follow Users if He has more than 10 followers
if (counter>10&&tfc<=this.config.settings.followdaily){
try{
console.log("follow followers");

const links = await this.page.evaluate(() => {
var list=document.evaluate("//h3[text()='Try Again Later']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  console.log(list); // 2. should be defined now
return list;
});
//Break if Notice is Shown
if (links!=null) {return false;}

let followAccounts=Math.floor(Math.random() * 3) + 1;
for (var i = 0; i < followAccounts; i++) {
//Get Count of Followers
var boxedfollow=await this.BoxCountFollowers();
//console.log("ShowBox Counter"+boxedfollow);

var randomNum=Math.floor(Math.random() * boxedfollow) + 1;
//Get Follow Status
var followStatus=await this.page.$eval(this.config.selectors.follow_list_holder+" ul li:nth-child("+randomNum+") button",el => el.innerText);
//console.log(followStatus);

let tfcc=await this.firebase_db.todayfollowed(this.today)
if (followStatus==this.config.lang.follow&&tfcc<this.config.settings.followdaily) {
    //Click Random User to Follow
await this.page.click(this.config.selectors.follow_list_holder+" ul li:nth-child("+randomNum+") button");
 await this.page.waitFor(1000 + Math.floor(Math.random() * 3000));
 //Evaluate Elements
followStatus=await this.page.$eval(this.config.selectors.follow_list_holder+" ul li:nth-child("+randomNum+") button",el => el.innerText);
var getuser=await this.page.$eval(this.config.selectors.follow_list_holder+" ul li:nth-child("+randomNum+") a",el => el.getAttribute('href'));
getuser=await this.FilterUserName(getuser);
//Check Follow Status
if (followStatus==this.config.lang.following) {
await this.firebase_db.addFollowing(getuser);

console.log("User saved to db");
tfcc=Number(tfcc)+1;
await this.firebase_db.addFollow(tfcc);
}
}
if (followStatus==this.config.lang.following) {
    console.log("Alread Following");
}
}
}catch(e){ console.log(e)}


}



}

async BoxCountFollowers(){
     /* Function Use For Count Follow Users On Dailog Box */
     await this.ScrollElement(this.config.selectors.follow_list_holder);
let fse=this.config.selectors.follow_list_holder+" ul li";
const links = await this.page.evaluate((evalVar) => {
var list=document.querySelectorAll(evalVar).length;
  console.log(list); // 2. should be defined now
return list;
},fse);
return links;
}
//Remove . from Username since firebase not support.
async FilterUserName(username){
var usr=username.replace(/\//g,"");
usr=usr.replace(/\./g,'@');
return usr;
}
//Filtered to Original
async GetFilteredUser(user){var usr=user.replace(/@/g,"."); return usr;}

async CountFollowers(){
     /* Function Use For Followers Users On Profile Page*/
var countis=await this.page.$eval("a[href='/"+this.config.myusername+"/followers/'] span",el => el.innerText);
if (countis.includes('k')) {
    countis=countis*1000;
}
if (countis.includes('m')){
    countis=countis*1000000;
}
//countis=Number(countis);
countis=countis.replace(/,/g,"");

    return countis;
}

async CountFollowing(){
     /* Function Use For Following Users On Profile Page*/
var countis=await this.page.$eval("a[href='/"+this.config.myusername+"/following/'] span",el => el.innerText);
if (countis.includes('k')) {
    countis=countis*1000;
}
if (countis.includes('m')){
    countis=countis*1000000;
}
//countis=Number(countis);
countis=countis.replace(/,/g,"");

    return countis;
}

/*
Scroll Element / Any Element which is scrollable
*/
async ScrollElement(ele){
 await this.page.evaluate(ele => {
    console.log(ele);
                   var El=document.querySelector(ele);El.scrollTo({top: El.scrollHeight, behavior: 'smooth'}); 

                },ele);

}
    /**
     * @Description loops through the the first three rows and the their items which are also three on a row
     * We'll be looping through nine items in total.
     * @param parentClass the parent class for items we trying to loop through this differs depending on the page
     * @param page this.page context of our browser
     * we're currently browsing through
    
     */
    async _doPostLikeAndFollow (parentClass, page){

        for (let r = 1; r < 4; r++) {//loops through each row
            for (let c = 1; c < 4; c++) {//loops through each item in the row

c=1+ Math.floor(Math.random() *3);
                let br = false;
                //Try to select post
                await page.click(`${parentClass} > div > div > .Nnq7C:nth-child(${r}) > .v1Nh3:nth-child(${c}) > a`)
                    .catch((e) => {
                        console.log(e.message);
                        br = true;
                    });
                await page.waitFor(2250 + Math.floor(Math.random() * 250));//wait for random amount of time
                if (br) continue;//if successfully selecting post continue

                //get the current post like status by checking if the selector exist
                let hasEmptyHeart = await page.$(this.config.selectors.post_heart_grey);

                //get the username of the current post
                let username = await page.evaluate(x => {
                    let element = document.querySelector(x);
                    return Promise.resolve(element ? element.innerHTML : '');
                }, this.config.selectors.post_username);
                console.log(`INTERACTING WITH ${username}'s POST`);

/*
Future Use
                //like the post if not already liked. Check against our like ratio so we don't just like all post
                if (hasEmptyHeart !== null && Math.random() < this.config.settings.like_ratio) {
                    await page.click(this.config.selectors.post_like_button);//click the like button
                    await page.waitFor(10000 + Math.floor(Math.random() * 5000));// wait for random amount of time.
                }

                //let's check from our archive if we've follow this user before
                let isArchivedUser = null;
                await this.firebase_db.inHistory(username).then(data => isArchivedUser = data)
                    .catch(() => isArchivedUser = false);

                //get the current status of the current user using the text content of the follow button selector
                let followStatus = await page.evaluate(x => {
                    let element = document.querySelector(x);
                    return Promise.resolve(element ? element.innerHTML : '');
                }, this.config.selectors.post_follow_link);

                console.log("followStatus", followStatus);
                //If the text content of followStatus selector is Follow and we have not follow this user before
                // Save his name in the list of user we now follow and follow him, else log that we already follow him
                // or show any possible error
                if (followStatus === 'Follow' && !isArchivedUser) {
                    await this.firebase_db.addFollowing(username).then(() => {
                        return page.click(this.config.selectors.post_follow_link);
                    }).then(() => {
                        console.log('<<< STARTED FOLLOWING >>> ' + username);
                        return page.waitFor(10000 + Math.floor(Math.random() * 5000));
                    }).catch((e) => {
                        console.log('<<< ALREADY FOLLOWING >>> ' + username);
                        console.log('<<< POSSIBLE ERROR >>>' + username + ':' + e.message);
                    });
                }
*/
                //Closing the current post modal
                await page.click(this.config.selectors.post_close_button)
                    .catch((e) => console.log('<<< ERROR CLOSING POST >>> ' + e.message));
                //Wait for random amount of time
                await page.waitFor(2250 + Math.floor(Math.random() * 250));
            }
        }
    };

    /*
     * @Description let's unfollow users we've followed for the number of days specified in our config
     */
    async unFollowUsers() {


        let now = new Date().getTime();// + (this.config.settings.unfollow_after_days * 86400000);
        let diff=this.config.settings.unfollow_after_days * 86400000;
        // get the list of users we are currently following
        let following = await this.firebase_db.getFollowings();
        let users_to_unfollow = [];
        if (following) {
            const all_users = Object.keys(following);
            // filter our current following to get users we've been following since day specified in config
            users_to_unfollow = all_users.filter(user => (now-following[user].added) > diff);
        }
//Radomize List of Users
        const shuffle = require('shuffle-array');
         users_to_unfollow = shuffle(users_to_unfollow);

        if (users_to_unfollow.length) {
            for (let n = 0; n < users_to_unfollow.length; n++) {
try{
let tfc=await this.firebase_db.todayunfollowed(this.today)
if (tfc>=this.config.settings.unfollowdaily){
    console.log("Today Unfollow Limit Exceeded");
    break;
}


                let user =await this.GetFilteredUser(users_to_unfollow[n]);
                //Open User Profile
                await this.page.goto(`${this.config.base_url}/${user}/?hl=en`);
                await this.page.waitFor(1500 + Math.floor(Math.random() * 500));

                let followStatus = await this.page.evaluate(x => {
                    let element = document.querySelector(x);
                    return Promise.resolve(element ? element.getAttribute("aria-label") : '');
                }, this.config.selectors.user_unfollow_button);

                if (followStatus === this.config.lang.following) {
                    console.log('<<< UNFOLLOW USER >>>' + user);
                    //click on unfollow button
                    await this.page.click(this.config.selectors.user_unfollow_button);
                    //wait for a sec
                    await this.page.waitFor(1000);
                    //confirm unfollow user
                    await this.page.click(this.config.selectors.user_unfollow_confirm_button);
                    //wait for random amount of time
                    await this.page.waitFor(3000 + Math.floor(Math.random() * 5000));
                    //save user to following history
                    user=await this.FilterUserName(user);
                    await this.firebase_db.unFollow(user);
                    await this.firebase_db.addunFollow(Number(tfc)+1);

                } else {
                    //save user to our following history
                    user=await this.FilterUserName(user);
                    this.firebase_db.unFollow(user);
                    await this.firebase_db.addunFollow(Number(tfc)+1);
                }
                console.log("unFollowed "+tfc);

}catch(e){ console.log(e)}
            }

        }
    }
//Close Browser
    async closeBrowser(){
        await this.browser.close();
    }


}

module.exports = InstagramBot;
