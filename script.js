const paths={
	style: "/style",
	pages: "/html",
	posts: "/posts",
	images:"/images"
};

let blogName = "Various Oddities";
let authorName = "conor nally";
let authorLink = "https://bsky.app/profile/conornally.bsky.social"; 

if(typeof postdat==="undefined") { window.postdat=[]; }
let url = window.location.pathname;

const postDateFormat = /\d{4}\/\d{2}/;

//Generate the Header HTML, a series of list items containing links.
let headerHTML = '<ul> '+
'<li><a href="/index.html"	  	   class="link-discrete"> various oddities</a></li>' + 
'<li><a href="'+paths.pages+'/projects.html" class="link-discrete"> projects</a></li>' +
'<li><a href="'+paths.pages+'/gallery.html"  class="link-discrete"> gallery</a></li>'+
'<li><a href="'+paths.pages+'/contact.html"  class="link-discrete"> contact</a></li>' +
'</ul>';

let footerHTML = "<hr><p>" + blogName + " is written by <a href='" + authorLink + "'>" + authorName + "</a>, with adapted <a href='https://zonelets.net/'>zonelets</a></p>";

//To do the following stuff, we want to know where we are in the posts array (if we're currently on a post page).
let currentIndex = -1;
let currentFilename = url.substring(url.lastIndexOf('/posts/'));

if(currentFilename.slice(-1)==="/") currentFilename=currentFilename.slice(0,-1);

let i;
for (i = 0; i < postdat.length; i++) {
	console.log(postdat[i].folder, currentFilename);
  if ( postdat[i].folder === currentFilename ) {
    currentIndex = i;
  }
}

//Convert the post url to readable post name. E.g. changes "2020-10-10-My-First-Post.html" to "My First Post"
//Or pass along the "special characters" version of the title if one exists
function formatPostTitle(i) {
  // Check if there is an alternate post title
  if ( postdat[i].length > 1 ) {
    //Remember how we had to use encodeURI for special characters up above? Now we use decodeURI to get them back.
    return decodeURI(postdat[i].title);
  } else { 
	  return postdat[i].title;
  }
}

function getyear(i)
{
	let raw=postdat[i].folder.slice(6)
	if( postDateFormat.test(raw.slice(1,8)) ) {return raw.slice(1,5);}
	else{return "[date] wrong file format";}
}

function getmonth(i)
{
	let raw=postdat[i].folder.slice(6)
	if( postDateFormat.test(raw.slice(1,8)) ) {return raw.slice(6,8);}
	else{return "[month] wrong file format";}
}

function formatDate(i)
{
	let yr=getyear(i);
	let mon=getmonth(i)
	let month="unknown";

    if ( mon === "01") { month = "Jan";}
    else if ( mon === "02") { month = "Feb";}
    else if ( mon === "03") { month = "Mar";}
    else if ( mon === "04") { month = "Apr";}
    else if ( mon === "05") { month = "May";}
    else if ( mon === "06") { month = "Jun";}
    else if ( mon === "07") { month = "Jul";}
    else if ( mon === "08") { month = "Aug";}
    else if ( mon === "09") { month = "Sep";}
    else if ( mon === "10") { month = "Oct";}
    else if ( mon === "11") { month = "Nov";}
    else if ( mon === "12") { month = "Dec";}

	return month+', '+yr;
}


function formatPostLink(i) {
  let postTitle_i = formatPostTitle(i);
  if (  postDateFormat.test ( postdat[i].folder.slice( 6,14 ) ) ) {
    return '<a href="'+ postdat[i].folder +'">' + getyear(i) +'/'+getmonth(i)+ " \u00BB " +  formatPostTitle(i)+'</a>';

  } else {
    return '<a href="/index.html">' + "bad file format" + '</a>';
  }
}


 
let postListHTML="";
function buildPostList(postdat) {
    postListHTML += '<ul class="post-list">';

    for (let i = 0; i < postdat.length; i++) {
        postListHTML += '<hr><li class="post-item">';
        postListHTML += '<img src="'+postdat[i].folder+'/thumbnail.png" width="20%">';
        postListHTML += '<div class="post-text">';
        postListHTML += '<h3>' + formatPostLink(i)+'</h3>';
        postListHTML += '<p>' + postdat[i].synops + '</p>';
        postListHTML += '</div></li>';
    }
    postListHTML += '</ul>';
}
buildPostList(postdat);

//Generate the Recent Post List HTML, which can be shown on the home page (or wherever you want!)
let recentPostsCutoff = 3; //Hey YOU! Change this number to set how many recent posts to show before cutting it off with a "more posts" link.
let recentPostListHTML = "<ul>";
let numberOfRecentPosts = Math.min( recentPostsCutoff, postdat.length );
for ( let i = 0; i < numberOfRecentPosts; i++ ) {
	recentPostListHTML+='<li>'+ formatPostLink(i) +'</li>';
}

if ( postdat.length > recentPostsCutoff ) {
  recentPostListHTML += '<li class="moreposts"><a href=/html/projects.html>\u00BB more posts</a></li></ul>';
} else {
  recentPostListHTML += "</ul>";
}

//Generate the Next and Previous Post Links HTML
let navlinks=""
let i_next=Math.min(currentIndex-1, postdat.length);
let i_prev=Math.max(currentIndex+1, 0);

if(currentIndex<(postdat.length-1)) navlinks+= '<a href="'+postdat[i_prev].folder+'"> \u00AB previous</a> | ';
navlinks+='<a href="/html/projects.html">all</a>'
if(currentIndex>0) navlinks+= ' | <a href="'+postdat[i_next].folder+'"> next \u00BB </a>';


//-----------------------------

//==[ 4. INSERTING THE SECTIONS INTO OUR ACTUAL HTML PAGES ]==

/*Here we check if each relevant div exists. If so, we inject the correct HTML!
  NOTE: All of these sections are optional to use on any given page. For example, if there's 
  one particular blog post where we don't want the footer to appear, 
  we simply don't put a <div id="footer"> on that page.*/

if (document.getElementById("nextprev")) {
  document.getElementById("nextprev").innerHTML = navlinks;
}
if (document.getElementById("postlistdiv")) {
  document.getElementById("postlistdiv").innerHTML = postListHTML;
}
if (document.getElementById("recentpostlistdiv")) {
  document.getElementById("recentpostlistdiv").innerHTML = recentPostListHTML;
}
if (document.getElementById("header")) {
  document.getElementById("header").innerHTML = headerHTML;
}
if (document.getElementById("blogTitleH1")) {
  document.getElementById("blogTitleH1").innerHTML = blogTitle;
}
if (document.getElementById("postTitleH1")) {
  document.getElementById("postTitleH1").innerHTML = formatPostTitle( currentIndex );
}
if (document.getElementById("postDate")) {
  document.getElementById("postDate").innerHTML = formatDate( currentIndex );
}
if (document.getElementById("footer")) {
  document.getElementById("footer").innerHTML = footerHTML;
}

//Dynamically set the HTML <title> tag from the postTitle variable we created earlier
//The <title> tag content is what shows up on browser tabs
if (document.title === "Blog Post") {
  document.title = "Various Oddities : "+formatPostTitle( currentIndex );
}
