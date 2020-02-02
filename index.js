const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);


//-------------Color Input Styling Options------------------
const colors = {
  green: {
    bodyBackground: "#417F4F",
    listColor: "#E4F7E5",
    headerColor: "white",
    jumboColor: "#CCE3D1",
  },
  blue: {
    bodyBackground: "#2A35B3",
    listColor: "#D0D7ED",
    headerColor: "white",
    jumboColor: "#3C4BFA",
  },
  pink: {
    bodyBackground: "#FFC0CB",
    headerBackground: "#FF8374",
    headerColor: "black",
    listColor: "#F7E4ED",
    jumboColor: "#FFFFFF",
  },
  red: {
    bodyBackground: "#C94C44",
    headerColor: "black",
    listColor: "#EBCBC6",
    jumboColor: "#FCAEA9",
  },
  purple: {
    bodyBackground: "#6F45D3",
    headerColor: "black",
    listColor: "#D7CBF5",
    jumboColor: "#A68DE1",
  }
};


//----------User Input Prompt---------------------------------
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "What is your github username?"
    },
    {
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    },
  ])
}


//-----------Github Data------------------------------------
async function githubData(answers){
  const githubURL = `https://api.github.com/users/${answers.username}`;
  return axios.get(githubURL)
};


//-------------Stars-----------------------------------------
async function starsData(answers){
  const starsURL =`https://api.github.com/users/${answers.username}/starred`;
  let stars = await axios.get(starsURL);
  return stars.data.length;

}


//-------------Generate HTML File-----------------------------
function generateHTML(answers, response, starred) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
  <title>Developer Profile</title>
<style>
 body {
   background-color: ${colors[answers.color].bodyBackground};
    }
.bio {  background-color: #ffffff;
    }
.badge { background-color: #444444;
}
.col-6, .col-12{
  background-color:${colors[answers.color].listColor};
  border: 10px solid ${colors[answers.color].jumboColor};
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
.main { margin-top: 40px;
        margin-bottom: 40px;
}
.followers, .following, .stars, .repos {
  padding: 15px;
}
  img { border-radius: 200px;
        border: 4px solid ${colors[answers.color].listColor};
}
</style>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4 text-center">Hi!</h1>
      <h1 class="text-center">My name is <b>${response.data.name}</b></h1>
        <div class="row">
        <div class="col-7">
    <h2><span class="badge badge-secondary">Contact Me</span></h2>
    <ul class="list-group">
      <li class="list-group-item"><p class="lead"><h4><i class="fas fa-location-arrow"></i> Location:</h4><a target="_blank" href="https://www.google.com/maps/place/${response.data.location}/data=!3m1!4b1!4m5!3m4!1s0x89e64a65bdf7146f:0x6c1c794f3958b866!8m2!3d41.5623209!4d-72.6506488">${response.data.location}</a></p></li>
      <li class="list-group-item"><h4><i class="fab fa-github"></i> Github User:</h4> <a href="https://github.com/${response.data.login}">${response.data.login}</a></li>
      <li class="list-group-item"><h4><i class="fas fa-blog"></i></h4><a href="${response.data.blog}">Check out my webpage!</a></li>
    </ul>
    </div>
    <div class="col-5">
    <div class="profileImg">
    <img width="300px" src="${response.data.avatar_url}">
    </div>
    </div>
    </div>
  </div>
</div>
<div>
    <div class="main container">
    <div class="row">
    <div class="col-12">
    <h2><span class="badge badge-secondary">About Me</span></h2>
      <p class="text-center"> ${response.data.bio}</p>
    </div>
    </div>
  <div class="row text-center">
      <div class="col-6">
        <div class="repos"><h4>Public Repositories:</h4>${response.data.public_repos}</div>
      </div>
      <div class="col-6">
        <div class="followers"><h4>Followers:</h4>${response.data.followers}</div>
    </div>
  </div>
  <div class="row text-center">
    <div class="col-6">
      <div class="stars"><h4>Github Stars:</h4>${starred}</div>
    </div>
    <div class="col-6">
      <div class="following"><h4>Following:</h4>${response.data.following}</div>
    </div>
  </div>
  </div>
</div>
</body>
</html>`;
}


//-----------------------------------------------------------------------------
async function init() {
  try {
    const answers = await promptUser();
    const response = await githubData(answers);
    const starred = await starsData(answers);
    
    const html = generateHTML(answers,response, starred);
   
    await writeFileAsync("index.html", html);

    console.log("Successfully wrote to index.html");
  } catch (err) {
    console.log(err);
  }
}
init();

