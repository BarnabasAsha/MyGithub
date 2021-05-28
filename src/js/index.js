const myForm = document.getElementById('view-profile');

myForm.onsubmit = function (e) {
    e.preventDefault()
    const { userName } = this.elements;
    console.log(userName.value)
    sessionStorage.setItem('userName', userName.value)
    window.location.href = './src/pages/profile.html'
}