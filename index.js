/*
 * @author Kingbots
 * ig-bot
 * 31-Oct-2020 6:22 PM
 */

const Bot = require('./Bot');// this directly imports the index.js file
const config = require('./Bot/config/puppeteer');

const run = async () => {
    const bot = new Bot();

    const startTime = Date();

    await bot.initPuppeter().then(() => console.log("PUPPETEER INITIALIZED"));
	//Open Instagram
    await bot.visitInstagram().then(() => console.log("BROWSING INSTAGRAM"));

	await bot.initStats().then(() => console.log("STATS INITIALIZED"));


    //Get Following List
	await bot.GetFollowing();

	//Get Following List 
	await bot.GetFollowers();

	//Unfollow Users From List //Now this.
	await bot.unFollowUsers();

	//Follow Users From List
	await bot.FollowUsers();

		//Browse Feed
		await bot.BrowseFeed();

		//View Stories
		await bot.ViewStories().then(()=>console.log("Viewed Stories"));
	
	await bot.AddComment(); //Comment & Like

    await bot.visitHashtagUrl().then(() => console.log("VISITED HASH-TAG URL"));
    
  //await bot.closeBrowser().then(() => console.log("BROWSER CLOSED"));

    const endTime = Date();

    console.log(`START TIME - ${startTime} / END TIME - ${endTime}`)

};

run().catch(e=>console.log(e.message));
//run bot at certain interval we have set in our config file
//setInterval(run, config.settings.run_every_x_hours * 3600000);

