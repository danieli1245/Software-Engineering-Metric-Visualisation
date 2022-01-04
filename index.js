google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

var ftoken = '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';

function handleToken()
{
    var token = document.getElementById("token").value;
    
        document.getElementById("loader0").innerHTML = "Token Saved : " + token;


}

function handleInput()
{
  var x = document.getElementById("username").value;
    document.getElementById("loader1").innerHTML = "Please Wait...<div style='align-items: center; text-align: center;'><div class='loader'></div></div>";
  main(x);
}

async function GetRequest(url)
{
var token = document.getElementById("token").value;
  const response = await fetch(url , {
  headers: {
    Authorization: `token ${token}`
      
  }
});
  let data = await response.json();
  return data;
}


async function main(user) {
  
  let url = `https://api.github.com/users/${user}/repos`;
  

  let reposData = await GetRequest(url).catch(error => console.error(error));
    
    Avatar(user)
    UserInfo(user)
  commitsPerRepo(reposData, user)
  languagesUsed(reposData, user)
    ContributersPerRepo(reposData, user)
}

function Avatar(user)
{
    
    document.getElementById("myImg").src = `https://avatars.githubusercontent.com/${user}`;


}

async function UserInfo(user)
{
    
    document.getElementById("userfield").innerHTML = "Username: " + user;
    let parser = await GetRequest(`https://api.github.com/users/${user}`).catch((error) => console.error(error));
    let y = JSON.stringify(parser);
    let x = JSON.parse(y);
    console.log(x.public_repos);
    document.getElementById("reposfield").innerHTML = "Public Repos: " + x.public_repos;
    document.getElementById("followersfield").innerHTML = "Followers: " + x.followers;
    document.getElementById("followingfield").innerHTML = "Following: " + x.following;




}



async function languagesUsed(userData, user){
  let languages = [['Language', 'Frequency']];
  for(let i=0; i<userData.length; i++){
    const repo = userData[i].name;
    let languageList = await GetRequest(`https://api.github.com/repos/${user}/${repo}/languages`).catch((error) => console.error(error));
    let y = JSON.stringify(languageList);
    let x = JSON.parse(y);
    for(var q of Object.entries(x)){
      languages.push(q);
    }
  }

  for(var i = 0; i < languages.length; i++){
    for(var j = i+1; j < languages.length; j++){
        if(languages[i][0] === languages[j][0]){
           languages[i][1] = languages[i][1]+languages[j][1];
           languages.splice(j, 1);
           j--;
        }
    }
  }
  drawLanguageChart(languages);
}

async function commitsPerRepo(userReposData, user) {
  let commits = [['Repo', 'Number of commits']];
  for (let i = 0; i < userReposData.length; i++) 
  {
    let page = 1;
    const repo = userReposData[i].name;
    while(page <= 5){  
      let a = await GetRequest(`https://api.github.com/repos/${user}/${repo}/commits?page=${page}&per_page=50`).catch((error) => console.error(error));
        if(a.length > 0){
          let b = [repo, a.length];
          commits.push(b);
        }
        page = page + 1;
    }
  }
    

  for(var x = 0; x <commits.length; x++){
    for(var j = x+1; j < commits.length; j++){
        if(commits[x][0] == commits[j][0]){
            commits[x][1] = commits[x][1]+commits[j][1];
            commits.splice(j, 1);
            j--;
        }
    }
  }

  drawChart(commits);
}


async function ContributersPerRepo(userReposData, user) {
  let contributor = [['Repo', 'Number of contributors']];
  for (let i = 0; i < userReposData.length; i++)
  {
    let page = 1;
    const repo = userReposData[i].name;
    while(page <= 5){
      let a = await GetRequest(`https://api.github.com/repos/${user}/${repo}/contributors?page=${page}&per_page=50`).catch((error) => console.error(error));
        if(a.length > 0){
          let b = [repo, a.length];
            contributor.push(b);
        }
        page = page + 1;
    }
  }

  for(var x = 0; x <contributor.length; x++){
    for(var j = x+1; j < contributor.length; j++){
        if(contributor[x][0] == contributor[j][0]){
            contributor[x][1] = contributor[x][1]+contributor[j][1];
            contributor.splice(j, 1);
            j--;
        }
    }
  }

    drawEventChart(contributor);
}



function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return(color);
}


async function drawChart(myData){
  var data = google.visualization.arrayToDataTable(
    myData
  );

  var options = {
    title: 'Number of commits',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('chart1'));
  chart.draw(data, options);
};


async function drawLanguageChart(myData){
  var data = google.visualization.arrayToDataTable(
    myData
  );

  var options = {
    title: "Bytes written per Language",
    pieHole: 0.4
  };

  var chart = new google.visualization.PieChart(document.getElementById("chart2"));
  chart.draw(data, options);
};


async function drawEventChart(myData){
  var data = google.visualization.arrayToDataTable(
    myData
  );

  var options = {
    title: "Individual Contributors per Repo",
    hAxis: {
      title: "Repo Name"
    },
    vAxis: {
    title: "Number of Contributors",
    format: '0' }

    
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("chart3"));
  chart.draw(data, options);
};
