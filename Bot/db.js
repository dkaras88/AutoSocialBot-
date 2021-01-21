
const firebase = require('firebase-admin');
const config = require("./config/db_config");

firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: 'https://hors00-default-rtdb.firebaseio.com'  /* Set YOur Firebase REal Time Url Here in db.js */
});
let database = firebase.database();
let today = new Date().toISOString().slice(0, 10);

//Following Methods
const following = (param = '') => database.ref(`following/${param}`);
let getFollowings = async () => following().once('value').then(data => data.val());
let inFollowing = async username => followHistory(username).once('value').then(data => data.val());
let addFollowing = async username =>{
    const added = new Date().getTime();
    return following(username).set({username,added});
};

//Alread Followed History Methods
const followHistory = (param = '') => database.ref(`follow_history/${param}`);
let inHistory = async username => followHistory(username).once('value').then(data => data.val());



//Unfollow Methods

let unFollowed = async username =>{
   // const added = new Date().getTime();
    return unfollowtoday(today).set(username);
};
let unFollow = async username => following(username).remove().then(() => followHistory(username).set({username}));


//Followers
const followers = (param = '') => database.ref(`followers/${param}`);
let addFollowers = async username =>{
    const added = new Date().getTime();
    return followers(username).set({username,added});
};
let getFollowers = async () => followers().once('value').then(data => data.val());

let inFollowers = async username => followers(username).once('value').then(data => data.val());


//Today Follow Stats
const followtoday = (param = '') => database.ref(`Statsfollowed/${param}`);
let addFollow = async username =>{
    return followtoday(today).set(username);
};

let todayfollowed = async username => followtoday(username).once('value').then(data => data.val());


//Today Unfollow Stats
const unfollowtoday = (param = '') => database.ref(`Statsunfollow/${param}`);
let addunFollow = async username =>{
    return unfollowtoday(today).set(username);
};
let todayunfollowed=async username => unfollowtoday(username).once('value').then(data => data.val());

//Comments & LIkes
const commentstoday = (param = '') => database.ref(`Statscomment/${param}`);
let addcomment = async username =>{
    return commentstoday(today).set(username);
};
let commentsmade=async username => commentstoday(username).once('value').then(data => data.val());


//Save Post ID  of Comment
const commentPost = (param = '') => database.ref(`commentID/${param}`);
let addcommentid = async postid =>{
    const added = new Date().getTime();
    return commentPost(postid).set({postid,added});
};
let GetCommentId=async username => commentPost(username).once('value').then(data => data.val());

module.exports = {
	commentstoday,
	addcomment,
	commentsmade,
	commentPost,
    GetCommentId,
	addcommentid,
    addFollowing,
    getFollowings,
    unFollow,
    inHistory,
    followers,
    addFollowers,
    addunFollow,
    getFollowers,
    inFollowers,
    addFollow,
    followtoday,
    unfollowtoday,
    unFollowed,
    todayfollowed,
    todayunfollowed,
    inFollowing
};
