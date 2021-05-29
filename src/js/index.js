import "regenerator-runtime/runtime";
const token = process.env.GITHUB_APP_API_KEY;

const myForm = document.getElementById("view-profile");
let errors = [];

myForm.onsubmit = function (e) {
  e.preventDefault();
  const { userName } = this.elements;
  checkUser(userName)
};

function checkUser(user) {
  const reqBody = {
    query: `
            query { 
              user (login: "${user.value}") { 
                login
              }
            }
            `,
  };

  if (user) {
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
        .then(
          (data) => {
              if(data.errors) {
                  errors.push(data.errors[0].message)
                  showError()
              }else {
                  user.value = ""
                const userName = data.data.user.login
                sessionStorage.setItem("userName", userName);
                window.location.href = "/src/pages/profile.html";
              }
          },
          (e) => {
              errors.push(e.message)
              showError()
          }
        );
    } catch (e) {
        errors.push(e.message)
        showError()
    }
  }
}

const errorElement = document.querySelector('.errors')

function showError () {
  if(errors.length) {
    errorElement.innerHTML = `
      ${ errors.map( error => `<li>${error}</li>`)}
    `
  }
  setTimeout(() => {
    errors = []
    errorElement.innerHTML = null
  }, 2500)
}
