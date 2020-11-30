import os  from "../node_modules/dotenv"
import load_dotenv from "../node_modules/dotenv"
load_dotenv()

const token = os.getenv('PROJECT_API_KEY')

function fetchData() {
  fetch('https://cors-anywhere.herokuapp.com/https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      
    },
    body: JSON.stringify({
      query: `
      query { 
        user (login:"BarnabasAsha") { 
          name
          login
          avatarUrl
          bio
          repositories(last: 20 privacy: PUBLIC ownerAffiliations: OWNER) {
            nodes {
              name
              forkCount
              stargazerCount
              description
              updatedAt
            }
          }
          
          
        }
      }
          `
    }
    )
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      renderData(data.data)
    })
}

function renderData (data) {
    const header_profile_img = document.querySelector('.header_profile_img')
    const user_bio = document.querySelector('.aside')
    const user_bio_img = document.querySelector('.user_bio_img')
    const repositories = document.querySelector('.repositories_cluster')
    const count = document.querySelector('.count')
    const counter = document.querySelector('.counter')


    user_bio.querySelector('.fname').textContent = data.user.name
    user_bio.querySelector('.username').textContent = data.user.login
    user_bio.querySelector('.user_description').textContent = data.user.bio
    user_bio_img.querySelector('img').setAttribute('src') = data.user.avatarUrl
    header_profile_img.querySelector('img').setAttribute('src') = data.user.avatarUrl

    
    counter.textContent = data.user.repositories.nodes.length
    count.textContent = data.user.repositories.nodes.length
    data.user.repositories.nodes.map( repo => {
       const repo_entity = document.createElement('li')
       repo_entity.className = 'repo_entity'
       repo_entity.innerHTML = `
       <div class="col1">
                            <a href="#" class="repo-title">${repo.name}</a>
                            <p class="repo-desc">${repo.description}</p>
                            <div class="repo-meta">
                                <span class="meta-language"></span>
                                Updated
                                <span class="meta-time">${(repo.updatedAt)}</span>
                            </div>
                        </div>
                        <div class="col2">
                            <button class="repo-action">
                                <i class="far fa-star"></i> <span class="action-text">Star</span>
                            </button>
                        </div>
       `
       repositories.append(repo_entity)
    })
}

window.onload = fetchData()