const user_email = document.querySelector('input[type="text"]')
const pass = window.document.querySelector('input[type="password"]')
const form = document.querySelector('form')
const errElm = document.querySelector('.err')
const url = 'https://learn.zone01oujda.ma/api/auth/signin'

async function JWTHandler() {

    const res = await checkJWT()

    if (res) {
        location.pathname = `${root}/profile.html`
    }
}

JWTHandler()

form.onsubmit = async (e) => {
    //prevent page reload ==+> access profile page
    e.preventDefault()

    const data = user_email.value + ':' + pass.value


    try {
        const res = await fetch(url, {

            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(data)}`,
                'Content-Type': 'application/json'
            }
        })

        const jwt = await res.json()
        console.log("error");
        if (!res.ok) {

            throw (jwt);
        }

        localStorage.setItem('jwt', jwt)
        setTimeout(() => {
            location.pathname = `${root}/profile.html`
        }, 200);

    } catch (error) {
        errElm.textContent = error.error
        errElm.style.display = 'block'

        setTimeout(() => {
            errElm.style.display = 'none'
        }, 1500);
        // alert(error.error)
    }

}

