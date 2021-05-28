// import 'regenerator-runtime/runtime'
const token = process.env.GITHUB_APP_API_KEY

async function fetchData() {
  const userName = await sessionStorage.getItem('userName')
  const reqBody = {
    query: `
        query { 
          user (login: "${userName}") { 
            name
            login
            avatarUrl
            bio
            repositories(
              first: 20 
              privacy: PUBLIC 
              orderBy: { field: UPDATED_AT, direction: DESC } ) {
              nodes {
                name
                forkCount
                stargazerCount
                description
                updatedAt
                primaryLanguage {
                  name
                  color
                }
              }
            }
            
            
          }
        }
            `,
  }
 if(userName) {
  try {
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((data) => {
          renderData(data.data)
      }, (e) => console.log(e.message))
  } catch(e) {
    console.log(e.message)
  }
 }
}


function renderData(data) {
  const header_profile_img = document.querySelector(".header_profile_img");
  const user_bio = document.querySelector(".aside");
  const user_bio_img = document.querySelector(".user-bio_img");
  const sticky_avatar = document.querySelector(".sticky_avatar");
  const sticky_username = document.querySelector(".sticky_username");
  const repositories = document.querySelector(".repositories_cluster");
  const count = document.querySelector(".count");
  const counter = document.querySelector(".counter");

  user_bio.querySelector(".fname").textContent = data.user.name;
  user_bio.querySelector(".username").textContent = data.user.login;
  user_bio.querySelector(".user_description").textContent = data.user.bio;
  user_bio_img.querySelector("img").setAttribute("src", data.user.avatarUrl);
  sticky_avatar.querySelector("img").setAttribute("src", data.user.avatarUrl);
  sticky_username.textContent = data.user.login;
  header_profile_img
    .querySelector("img")
    .setAttribute("src", data.user.avatarUrl);
  counter.textContent = data.user.repositories.nodes.length;
  count.textContent = data.user.repositories.nodes.length;

  data.user.repositories.nodes.map((repo) => {
    const {
      name,
      description,
      primaryLanguage,
      stargazerCount,
      forkCount,
      updatedAt,
    } = repo;

    const repo_entity = document.createElement("li");
    repo_entity.className = "repo_entity";
    repo_entity.innerHTML = `
                            <div class="col1">
                              <a href="#" class="repo-title">${name}</a>
                              <p class="repo-desc">${
                                description === null ? "" : description
                              }</p>
                              <div class="repo-meta">
                              ${
                                repo.primaryLanguage
                                  ? `
                                  <span class="meta_language">
                                  <span class="meta_language-color" style="background-color: ${
                                    primaryLanguage ? primaryLanguage.color : ""
                                  }"></span>
                                  <span>${primaryLanguage.name}</span>
                                  </span>
                                  `
                                  : ""
                              }
                                 
                                  <span class="meta_language effect">
                                  <span class="meta_language-stars">
                                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                      d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z" />
                                  </svg>
                                  </span>
                                  <span>${stargazerCount}</span>
                                  </span>
                                  <span class="meta_language effect">
                                  <span class="meta_language-forks">
                                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                                  </svg>
                                  </span>
                                  <span>${forkCount}</span>
                                  </span>
                                  <time datetime=${updatedAt}>
                                  Updated
                                  <span class="meta-time">${handleTime(
                                    updatedAt
                                  )}</span>
                                  </time>
                              </div>
                          </div>
                          <div class="col2">
                              <button class="repo-action">
                                  <i class="far fa-star"></i> <span class="action-text">Star</span>
                              </button>
                          </div>
         `;
    repositories.append(repo_entity);
  });
}

const handleTime = (updatedAt) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentTime = new Date();
  const currentTimeStamp = currentTime.getTime();
  const currentTimeYear = currentTime.getFullYear();

  const apiTime = new Date(updatedAt);
  const apiTimeStamp = new Date(updatedAt).getTime();
  const apiTimeDay = apiTime.getDate();
  const apiTimeMonth = apiTime.getMonth();
  const apiTimeYear = apiTime.getFullYear();

  const microSecondsDiff = Math.abs(currentTimeStamp - apiTimeStamp);
  const daysDiff = Math.round(microSecondsDiff / (1000 * 60 * 60 * 24));
  const hourDiff = Math.round(microSecondsDiff / (1000 * 60 * 60));
  const minDiff = Math.round(microSecondsDiff / (1000 * 60));
  const secDiff = Math.round(microSecondsDiff / 1000);

  if (hourDiff < 1 && minDiff < 1) {
    return `${secDiff} seconds ago`;
  } else if (minDiff >= 1 && hourDiff < 1) {
    return `${minDiff} minutes ago`;
  } else if (hourDiff >= 1 && hourDiff <= 24) {
    return `${hourDiff} hours ago`;
  } else if (daysDiff >= 1 && daysDiff <= 30) {
    return `${daysDiff} days ago`;
  } else if (apiTimeYear !== currentTimeYear) {
    return `on ${months[apiTimeMonth]} ${apiTimeDay} ${apiTimeYear}`;
  } else if (apiTimeYear === currentTimeYear) {
    return `on ${months[apiTimeMonth]} ${apiTimeDay}`;
  } else {
    return "null";
  }
};

function handleSticky() {
  const observerOptions = {
    root: null,
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(displaySticky, observerOptions);
  const aside = document.querySelector(".aside");
  const stickyBio = document.querySelector(".sticky_bio");

  function displaySticky(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      stickyBio.classList.add("hidden");
    } else {
      stickyBio.classList.remove("hidden");
    }
  }
  observer.observe(aside);
}

window.onload = async () => {
    const userName = await sessionStorage.getItem("userName");
    if (!userName) {
      window.location.href = "/";
    } else {
      fetchData()
      handleSticky()
    }
  };

  
  
