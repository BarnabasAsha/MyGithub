import 'regenerator-runtime/runtime'
// const token = process.env.GITHUB_APP_API_KEY;

const myForm = document.getElementById('view-profile');
let errors = []

myForm.onsubmit = function (e) {
    e.preventDefault()
    const { userName } = this.elements;
    sessionStorage.setItem('userName', userName.value)
    window.location.href = '/src/pages/profile.html'
}


// const errorElement = document.querySelector('.errors')

// function showError () {
//   if(errors.length) {
//     errorElement.innerHTML = `
//       ${ errors.map( error => `<li>${error}</li>`)}
//     `
//   }
//   setTimeout(() => {
//     errors = []
//     errorElement.innerHTML = null
//   }, 1500)
// }

