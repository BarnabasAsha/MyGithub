import renderData from "./render";
const token = process.env.GITHUB_APP_API_KEY;

function fetchData() {
  fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query { 
        user (login:"ireade") { 
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
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      renderData(data.data);
    });
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

window.onload = fetchData();
