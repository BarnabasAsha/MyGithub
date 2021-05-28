import 'regenerator-runtime/runtime'
import renderData from "./render";
const token = process.env.GITHUB_APP_API_KEY;

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
        console.log(data.data)
        renderData(data.data);
      }, (e) => console.log(e.message));
  } catch(e) {
    console.log(e.message)
  }
 }
}

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

window.onload = async () => {
  const userName = await sessionStorage.getItem('userName')
  if(!userName) {
    window.location.href = '/'
  }else {
    fetchData()
  }
}
