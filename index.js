const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

//---------------------------------------------------------
const colors = {
  green: {
    bodyBackground: "#10A918",
    listColor: "#E4F7E5",
    headerColor: "black",
    jumboColor: "#065D0B",
  },
  blue: {
    bodyBackground: "#0000ff",
    listColor: "#D0D7ED",
    headerColor: "black",
    jumboColor: "#061B5D",
  },
  pink: {
    bodyBackground: "#FFC0CB",
    headerBackground: "#FF8374",
    headerColor: "white",
    listColor: "#F7E4ED"
  },
  red: {
    bodyBackground: "#CA3433",
    headerColor: "black",
    listColor: "#EBCBC6",
    jumboColor: "#4B0E0A",
  }
};


//-------------------------------------------------------

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your github username?"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    },
  ])
}


//------------------------------------------------------------

function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Developer Profile</title>
<style>
 body {
   background-color: ${colors[answers.color].bodyBackground};
    }
.bio {  background-color: #ffffff;
    }
.col-6{
  background-color:${colors[answers.color].listColor};
}
 .container {
  background-color: ${colors[answers.color].bodyBackground};
 -webkit-print-color-adjust: exact !important;
 font-family: 'Cabin', sans-serif;
 padding: 10px;
 border-radius: 20px;
 }
h1, h3 { color: ${colors[answers.color].headerColor};
}
.list-group-item {
  background-color:${colors[answers.color].listColor};
}
.jumbotron {
  background-color: ${colors[answers.color].jumboColor};
}
</style>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${answers.name}</h1>
        <div class="profileImg">
        </div>
    <h3><span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item"> <p class="lead"><i class="fas fa-location-arrow"></i><h4>Location:</h4></p></li>
      <li class="list-group-item"><i class="fab fa-github"></i><h4>Github Username:</h4> ${answers.name}</li>
      <li class="list-group-item"><i class="fab fa-linkedin-in"></i><h4>LinkedIn:</h4> blog</li>
    </ul>
  </div>
</div>
<div>
    <div class="main container">
  <div class="row">
      <div class="col-6">
        <div class="repos"><h3>Public Repositories</h3>repos</div>
      </div>
      <div class="col-6">
        <div class="followers"><h3>Followers:</h3>followers</div>
    </div>
  </div>
  <div class="row">
    <div class="col-6">
      <div class="stars"><h3>Github Stars:</h3>stars</div>
    </div>
    <div class="col-6">
      <div class="following"><h3>Following:</h3>following</div>
    </div>
  </div>
  </div>
</div>
</body>
</html>`;
}

async function init() {
  try {
    const answers = await promptUser();
    const html = generateHTML(answers, colors);

    await writeFileAsync("index.html", html);

    console.log("Successfully wrote to index.html");
  } catch (err) {
    console.log(err);
  }
}

init();








///----------------------------github data------------------------------------------------------------
/*
.then(function ({ username }) { //retreives github repos

  //github repos
     const queryUrlRepos = `https://api.github.com/users/${username}/repos?per_page=100`;
     axios
    .get(queryUrlRepos).then(function (response) {
      const userRepos = response.data.map(function (repo) {
        return repo.repos
      });
      const repoStr = userRepos.join("\n");
      fs.writeFile("repos.txt", repoStr, function (err) { //saves the string container the repo names to repos.txt
        if (err) {
          throw (err);
        }
        console.log(`${username} has ${repoStr.length} repos on github.`);
      })
    });
 //followers
       const queryUrlFollowers = `https://api.github.com/users/${username}/followers`;
     axios
       .get(queryUrlFollowers).then(function (response) {

         const userFollowers = response.data.map(function(followers){
           return followers.followers
         });
         const followerStr = userFollowers.join("\n");
         fs.writeFile("repos.txt", followerStr, function(err){
           if(err){
             throw(err);
           }
           console.log( `${username} has ${followerStr.length} followers on github.`);
         })
       });
 //following
       const queryUrlFollowing = `https://api.github.com/users/${username}/following`;
       axios
         .get(queryUrlFollowing).then(function (response) {
           const userFollowing = response.data.map(function(following){
             return following.following
           });
           const followingStr = userFollowing.join("\n");
           fs.writeFile("repos.txt", followingStr, function(err){
             if(err){
               throw(err);
             }
             console.log( `${username} is following ${followingStr.length} users.`);
           })
         });
 //bio
 const queryUrlBio = `https://api.github.com/users/${username}/bio`;
 axios
   .get(queryUrlBio).then(function (response) {
     const userBio = response.data.map(function(bio){
       return bio.bio
     });
     const bioStr = userBio.join("\n");
     fs.writeFile("repos.txt", bioStr, function(err){
       if(err){
         throw(err);
       }
       console.log( `${bioStr}`);
     })
   });

//location----------------------------------------------------------------------
 const queryUrlLocation = `https://api.github.com/users/${username}/location`;
 axios
  .get(queryUrlLocation).then(function (response) {
    const userLocation = response.data.map(function(location){
      return location.location
    });
  const locationStr = userLocation.join("\n");
    fs.writeFile("repos.txt", locationStr, function(err){
      if(err){
        throw(err);
      }
      console.log( `From : ${locationStr}`);
    })
  });
 //name---------------------------------------------------------------------------
 const queryUrlName = `https://api.github.com/users/${username}/name`;
 axios
 .get(queryUrlName).then(function (response) {
  const userName = response.data.map(function(name){
    return name.name
  });
  const nameStr = userName.join("\n");
  fs.writeFile("repos.txt", nameStr, function(err){
    if(err){
      throw(err);
    }
    console.log( `From : ${nameStr}`);
  })
 });
 //blog--------------------------------------------------------------------------
 const queryUrlBlog = `https://api.github.com/users/${username}/blog`;
 axios
 .get(queryUrlBlog).then(function (response) {
  const userBlog = response.data.map(function(blog){
    return blog.blog
  });
  const blogStr = userBlog.join("\n");
  fs.writeFile("repos.txt", blogStr, function(err){
    if(err){
      throw(err);
    }
    console.log( `LinkedIn : ${blogStr}`);
  })
 });
   });
   */